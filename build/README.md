# Build with us

`/build/` is the branded "Build with us" form. It posts to `/api/build`, a Vercel function that delivers each lead to every place that is set up:

1. **Google Sheet + email** (recommended). The sheet "Material leads" lives in Blake's Google Drive. `google-sheet/Code.gs` is the Apps Script that appends a row and emails the deploying account. Deploy it as a web app (Execute as: Me, Who has access: Anyone) and set `SHEET_WEBHOOK_URL` in Vercel (Project > Settings > Environment Variables) to the web app URL.
2. **Fillout** (optional). Set `FILLOUT_API_KEY` (Fillout > Settings > Developer) and the lead is also created in the Fillout form `p8cqDmytcAus`. `FILLOUT_FORM_ID` overrides the form.

A lead counts as delivered when at least one place took it. With nothing set the API answers 503 and the page shows a link to the Fillout form instead, so nothing is lost.

On this project the environment variables above are not set yet, so `/build/` falls back to the Fillout link until they are.
