/* Build with us · form behaviour
   Checks the fields, posts them as JSON to /api/build, and shows a quiet
   success state. If the API is missing or fails, a line points to the
   Fillout form instead so nobody is stuck. No dependencies. */
(function () {
  'use strict';

  var form = document.getElementById('build-form');
  if (!form || !window.fetch) return;

  var endpoint = form.getAttribute('data-endpoint') || '/api/build';
  var sendBtn = document.getElementById('build-send');
  var sendLbl = sendBtn ? sendBtn.querySelector('.lbl') : null;
  var done = document.getElementById('build-done');
  var fallback = document.getElementById('build-fallback');
  var sending = document.getElementById('build-sending');

  // Warm the function while the person is still typing, so the send itself
  // does not pay for a cold start.
  setTimeout(function () {
    try { fetch(endpoint, { method: 'OPTIONS', credentials: 'same-origin' }).catch(function () {}); } catch (e) { /* ignore */ }
  }, 800);
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var KEYS = ['name', 'email', 'company', 'role', 'whatDo', 'build', 'found', 'website'];

  var rules = [
    { name: 'name', empty: 'Add your name.' },
    { name: 'email', empty: 'Add your work email.', check: function (v) { return EMAIL.test(v) ? '' : 'That email does not look right.'; } },
    { name: 'company', empty: 'Add the company name.' },
    { name: 'build', empty: 'Tell us what you want to build or explore.' }
  ];

  function field(name) { return form.elements[name] || null; }
  function wrapOf(el) { return el.closest ? el.closest('.f') : el.parentNode; }

  function setMessage(el, msg) {
    var w = wrapOf(el);
    var m = w ? w.querySelector('.msg') : null;
    if (msg) {
      if (w) w.classList.add('err');
      el.setAttribute('aria-invalid', 'true');
      if (m) m.textContent = msg;
    } else {
      if (w) w.classList.remove('err');
      el.removeAttribute('aria-invalid');
      if (m) m.textContent = '';
    }
  }

  function messageFor(rule, el) {
    var v = el.value.trim();
    if (!v) return rule.empty;
    return rule.check ? rule.check(v) : '';
  }

  function validateAll() {
    var first = null;
    rules.forEach(function (rule) {
      var el = field(rule.name);
      if (!el) return;
      var msg = messageFor(rule, el);
      setMessage(el, msg);
      if (msg && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  }

  // A message clears as soon as the field is fixed. It only appears on
  // blur when there is something to check, so tabbing through is quiet.
  rules.forEach(function (rule) {
    var el = field(rule.name);
    if (!el) return;
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid') === 'true') setMessage(el, messageFor(rule, el));
    });
    el.addEventListener('blur', function () {
      if (el.value.trim() && rule.check) setMessage(el, messageFor(rule, el));
    });
  });

  // The long answer grows with what is typed, so it never looks like an
  // empty box. Focus opens it a little so it is clear there is room.
  var grow = field('build');
  if (grow) {
    var one = 0;
    function fit(min) {
      if (!one) { grow.style.height = 'auto'; one = grow.scrollHeight; }
      grow.style.height = 'auto';
      grow.style.height = (Math.max(grow.scrollHeight, min || 0) + 1) + 'px';
    }
    grow.addEventListener('input', function () { fit(document.activeElement === grow ? one * 2.2 : 0); });
    grow.addEventListener('focus', function () { fit(one * 2.2); });
    grow.addEventListener('blur', function () { fit(0); });
    fit(0);
  }

  function busy(on) {
    form.classList.toggle('is-sending', on);
    if (sending) sending.hidden = !on;
    if (!sendBtn) return;
    sendBtn.disabled = on;
    sendBtn.setAttribute('aria-busy', on ? 'true' : 'false');
    if (sendLbl) sendLbl.textContent = on ? 'Sending' : 'Send';
  }

  function showDone() {
    busy(false);
    form.hidden = true;
    if (done) {
      done.hidden = false;
      done.classList.add('is-in');
      var h = done.querySelector('h2');
      if (h) h.focus({ preventScroll: true });
      if (done.scrollIntoView) done.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function showFallback() {
    busy(false);
    if (fallback) fallback.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (fallback) fallback.hidden = true;
    if (!validateAll()) return;

    var payload = {};
    KEYS.forEach(function (k) {
      var el = field(k);
      payload[k] = el ? el.value.trim() : '';
    });

    busy(true);
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'same-origin'
    }).then(function (res) {
      if (!res.ok) throw new Error('status ' + res.status);
      showDone();
    }).catch(showFallback);
  });
})();
