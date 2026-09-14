/* Material · Build with us → Google Sheet + email
   Paste this into the Apps Script editor of the "Material leads" sheet
   (Extensions > Apps Script), then Deploy > New deployment > Web app,
   "Execute as: Me", "Who has access: Anyone". Copy the web app URL into
   Vercel as SHEET_WEBHOOK_URL. Each submission becomes one row and one email
   to the account that deployed the script. */

var SHEET_NAME = 'Leads';
var SUBJECT_PREFIX = 'New lead: ';

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return reply({ ok: false, error: 'bad json' });
  }
  var v = function (k) { return String(body[k] || '').trim().slice(0, 5000); };
  var name = v('name'), email = v('email'), company = v('company');
  if (!name || !email || !company) return reply({ ok: false, error: 'missing fields' });

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  sh.appendRow([new Date(), name, email, company, v('role'), v('whatDo'), v('build'), v('found'), v('source') || 'site']);

  var to = Session.getEffectiveUser().getEmail();
  var lines = [
    'Name: ' + name,
    'Email: ' + email,
    'Company: ' + company,
    'Role: ' + (v('role') || '-'),
    'What the company does: ' + (v('whatDo') || '-'),
    '',
    'What to build or explore first:',
    v('build') || '-',
    '',
    'How they found us: ' + (v('found') || '-'),
    '',
    'Sheet: ' + ss.getUrl()
  ];
  try {
    MailApp.sendEmail({
      to: to,
      replyTo: email,
      subject: SUBJECT_PREFIX + name + ' at ' + company,
      body: lines.join('\n')
    });
  } catch (err) {
    return reply({ ok: true, warning: 'row saved, email failed: ' + err });
  }
  return reply({ ok: true });
}

// A GET on the web app URL just confirms it is alive.
function doGet() {
  return reply({ ok: true, service: 'material-leads' });
}

// Run this once from the editor to grant the sheet and email permissions
// and to see a test row and email arrive.
function sendTestLead() {
  var e = { postData: { contents: JSON.stringify({
    name: 'Test Lead', email: 'test@example.com', company: 'Example Co',
    role: 'COO', whatDo: 'Regional logistics', build: 'This is a test from the Apps Script editor.',
    found: 'Test', source: 'apps-script-test'
  }) } };
  Logger.log(doPost(e).getContent());
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
