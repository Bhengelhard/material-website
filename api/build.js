/* /api/build · Vercel serverless function (Node 20+, CommonJS)
   Takes the /build/ form as JSON and delivers it to every place that is
   set up: a Google Sheet (which also sends the email) and, if a key is
   set, the Fillout form.

   Env: SHEET_WEBHOOK_URL  Apps Script web app URL (see google-sheet/Code.gs)
        FILLOUT_API_KEY    optional; Fillout > Settings > Developer
        FILLOUT_FORM_ID    optional; defaults to the public form id

   With nothing set it answers 503 {error:"not configured"} and the page
   shows a link to the Fillout form instead. A lead counts as delivered
   when at least one place took it. */

'use strict';

const FILLOUT_API = 'https://api.fillout.com/v1/api';
const DEFAULT_FORM_ID = 'p8cqDmytcAus';
const MAX_LEN = 5000;
const MAX_BODY = 64 * 1024;
const CACHE_MS = 10 * 60 * 1000;
const RATE_MAX = 10;
const RATE_WINDOW_MS = 60 * 1000;
const FETCH_TIMEOUT_MS = 10 * 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

// Our fields, in the order they claim Fillout questions. The distinctive
// ones go first: company takes "Company name" before name looks for "name",
// found takes "How did you hear about us?" before whatDo looks for "about",
// and build takes "What do you want to build?" before whatDo looks for "do".
const FIELDS = [
  { key: 'email',   label: 'Work email',                               words: ['email'],                            type: 'email' },
  { key: 'company', label: 'Company',                                  words: ['company'] },
  { key: 'name',    label: 'Name',                                     words: ['name'] },
  { key: 'found',   label: 'How did you find us?',                     words: ['hear', 'find'] },
  { key: 'build',   label: 'What would you like to build or explore first?', words: ['build', 'explore', 'fix', 'goals', 'help', 'message'], type: 'longanswer' },
  { key: 'role',    label: 'Role',                                     words: ['role', 'title'] },
  { key: 'whatDo',  label: 'What does the company do?',                words: ['do', 'about'] }
];
const REQUIRED = ['name', 'email', 'company', 'build'];
// The order the fields appear on the page, used when writing leftovers.
const PAGE_ORDER = ['name', 'email', 'company', 'role', 'whatDo', 'build', 'found'];

// Question types that cannot take free text. Anything else is fair game.
const NON_TEXT = /dropdown|choice|checkbox|date|time|file|rating|slider|signature|ranking|opinion|matrix|payment|image|scheduler|picker|subform|number|address|captcha|record/;

let cache = { formId: null, questions: null, at: 0 };
const hits = new Map();

/* ---------- helpers ---------- */

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function clean(v) {
  if (typeof v !== 'string') return '';
  return v.replace(/\r\n?/g, '\n').replace(CONTROL_RE, '').replace(/[^\S\n]+/g, ' ').trim().slice(0, MAX_LEN);
}

function norm(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string' && real.length) return real.trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function limited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) {
    for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > RATE_WINDOW_MS) hits.delete(k);
  }
  return false;
}

async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') return JSON.parse(req.body);
    if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString('utf8'));
    return req.body;
  }
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > MAX_BODY) throw new Error('body too large');
  }
  return raw ? JSON.parse(raw) : {};
}

async function fillout(path, key, init) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(FILLOUT_API + path, {
      method: (init && init.method) || 'GET',
      body: init && init.body,
      signal: ctrl.signal,
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json', Accept: 'application/json' }
    });
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { /* not json */ }
    return { ok: res.ok, status: res.status, data, text };
  } finally {
    clearTimeout(timer);
  }
}

async function getQuestions(formId, key) {
  const now = Date.now();
  if (cache.questions && cache.formId === formId && now - cache.at < CACHE_MS) return cache.questions;
  const r = await fillout('/forms/' + encodeURIComponent(formId), key);
  if (!r.ok || !r.data || !Array.isArray(r.data.questions)) {
    const err = new Error('form fetch failed: ' + r.status);
    err.status = r.status;
    throw err;
  }
  const questions = r.data.questions
    .filter((q) => q && q.id != null)
    .map((q) => ({ id: String(q.id), name: String(q.name || ''), type: String(q.type || '') }));
  cache = { formId, questions, at: now };
  return questions;
}

/* ---------- mapping ---------- */

// Score how well a Fillout question fits one of our fields.
// exact name 3 · whole word 2 · substring 1 · matching type adds 1.5
function score(field, q) {
  const qn = norm(q.name);
  const qt = q.type.toLowerCase().replace(/[^a-z]/g, '');
  let best = 0;
  for (const w of field.words) {
    if (qn === w) best = Math.max(best, 3);
    else if (new RegExp('\\b' + w + '\\b').test(qn)) best = Math.max(best, 2);
    else if (qn.includes(w)) best = Math.max(best, 1);
  }
  if (field.type && qt === field.type) best += 1.5;
  return best;
}

function isTextish(q) {
  return !NON_TEXT.test(q.type.toLowerCase());
}

// Returns the Fillout answers array. Fields with no matching question are
// appended as "Label: value" lines to the long-text answer so nothing is lost.
function mapAnswers(questions, values) {
  const claimed = new Set();
  const mapped = {};
  for (const field of FIELDS) {
    let pick = null;
    let top = 0;
    for (const q of questions) {
      if (claimed.has(q.id) || !isTextish(q)) continue;
      const s = score(field, q);
      if (s > top) { top = s; pick = q; }
    }
    if (pick) { claimed.add(pick.id); mapped[field.key] = pick; }
  }

  const answers = new Map(); // question id -> value
  const leftovers = [];
  for (const key of PAGE_ORDER) {
    const field = FIELDS.find((f) => f.key === key);
    const v = values[key];
    if (!v) continue;
    const q = mapped[key];
    if (q) answers.set(q.id, v);
    else leftovers.push(field.label + ': ' + v);
  }

  if (leftovers.length) {
    let target = mapped.build || null;
    if (!target) target = questions.find((q) => !claimed.has(q.id) && isTextish(q) && /long|paragraph|textarea/.test(q.type.toLowerCase())) || null;
    if (!target) {
      let len = -1;
      for (const key of Object.keys(mapped)) {
        const cur = answers.get(mapped[key].id) || '';
        if (cur.length > len) { len = cur.length; target = mapped[key]; }
      }
    }
    if (target) {
      const cur = answers.get(target.id);
      answers.set(target.id, (cur ? cur + '\n\n' : '') + leftovers.join('\n'));
    }
  }

  return Array.from(answers, ([id, value]) => ({ id, value }));
}

/* ---------- handler ---------- */

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return send(res, 405, { error: 'method not allowed' });
  }

  let body;
  try { body = await readJson(req); } catch (e) { return send(res, 400, { error: 'invalid json' }); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return send(res, 400, { error: 'invalid body' });

  // honeypot: bots fill it, people never see it
  if (clean(body.website)) return send(res, 200, { ok: true });

  const key = String(process.env.FILLOUT_API_KEY || '').trim();
  const formId = String(process.env.FILLOUT_FORM_ID || '').trim() || DEFAULT_FORM_ID;
  const sheetUrl = String(process.env.SHEET_WEBHOOK_URL || '').trim();
  if (!key && !sheetUrl) return send(res, 503, { error: 'not configured' });

  if (limited(clientIp(req))) return send(res, 429, { error: 'too many requests' });

  const values = {};
  for (const f of FIELDS) values[f.key] = clean(body[f.key]);
  const missing = REQUIRED.filter((k) => !values[k]);
  if (missing.length) return send(res, 400, { error: 'missing ' + missing.join(', ') });
  if (!EMAIL_RE.test(values.email)) return send(res, 400, { error: 'invalid email' });

  const jobs = [];
  if (sheetUrl) jobs.push(sendToSheet(sheetUrl, values));
  if (key) jobs.push(sendToFillout(formId, key, values));
  const results = await Promise.all(jobs);
  const delivered = results.some((r) => r.ok);
  results.forEach((r) => { if (!r.ok) console.error(r.where + ' failed:', r.error); });
  if (!delivered) return send(res, 502, { error: 'could not deliver the submission' });
  return send(res, 200, { ok: true });
};

/* ---------- delivery ---------- */

// Google Sheet through the Apps Script web app. The script appends a row
// and sends the email. Apps Script answers a POST with a redirect that
// fetch follows on its own.
async function sendToSheet(url, values) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: JSON.stringify(Object.assign({ source: 'materialbuilt.com' }, values))
    });
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch (e) { /* not json */ }
    if (!res.ok || !data || data.ok !== true) return { ok: false, where: 'sheet', error: res.status + ' ' + text.slice(0, 200) };
    if (data.warning) console.warn('sheet:', data.warning);
    return { ok: true, where: 'sheet' };
  } catch (e) {
    return { ok: false, where: 'sheet', error: e && e.message };
  } finally {
    clearTimeout(timer);
  }
}

async function sendToFillout(formId, key, values) {
  let questions;
  try {
    questions = await getQuestions(formId, key);
  } catch (e) {
    return { ok: false, where: 'fillout', error: 'form fetch failed ' + (e && e.status) + ' ' + (e && e.message) };
  }
  const answers = mapAnswers(questions, values);
  if (!answers.length) return { ok: false, where: 'fillout', error: 'form has no text questions to map to' };
  let r;
  try {
    r = await fillout('/forms/' + encodeURIComponent(formId) + '/submissions', key, {
      method: 'POST',
      body: JSON.stringify({ submissions: [{ questions: answers }] })
    });
  } catch (e) {
    return { ok: false, where: 'fillout', error: 'submission request failed ' + (e && e.message) };
  }
  if (!r.ok) {
    // question ids may have changed; refetch the form next time
    if (r.status >= 400 && r.status < 500) cache = { formId: null, questions: null, at: 0 };
    return { ok: false, where: 'fillout', error: 'submission rejected ' + r.status + ' ' + String(r.text || '').slice(0, 300) };
  }
  return { ok: true, where: 'fillout' };
}
