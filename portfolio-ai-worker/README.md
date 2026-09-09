# Portfolio AI Worker

Small Python API for the assistant embedded in `federicocabello.net`. It uses a Cloudflare Workers AI binding and reads its public facts from `data/portfolio-context.json`.

## Setup

Requirements: a Cloudflare account and Node.js.

```powershell
cd portfolio-ai-worker
npx.cmd wrangler dev
```

Local Workers AI inference connects to your Cloudflare account. Wrangler may ask you to authenticate the first time.

## Deploy

```powershell
npx.cmd wrangler login
npx.cmd wrangler deploy
```

After deployment, copy the generated `https://...workers.dev` URL into the portfolio's endpoint meta tag:

```html
<meta name="portfolio-ai-endpoint" content="https://YOUR-WORKER.workers.dev">
```

The frontend then switches automatically from its local preview answers to Workers AI. No API token is stored in the browser.

## Context and privacy

- Edit `../data/portfolio-context.json` to update public portfolio facts. Once that file is published on `federicocabello.net`, the Worker reads updates without another deployment.
- `src/entry.py` contains a bundled fallback context so the assistant remains useful while the public JSON is unavailable.
- Questions and answers are stored anonymously in D1 until they are manually deleted. IP addresses and device data are not stored by the application.
- The Worker stores conversations only from frontend versions that explicitly support the history feature.
- The last six chat messages are sent only to maintain short conversational context.

## Review history

Use the Cloudflare D1 dashboard or run:

```powershell
npx.cmd wrangler d1 execute portfolio-assistant-history --remote --command "SELECT id, language, question, answer, status, created_at FROM chat_history ORDER BY created_at DESC LIMIT 50"
```

Count the most common normalized questions:

```powershell
npx.cmd wrangler d1 execute portfolio-assistant-history --remote --command "SELECT lower(trim(question)) AS question, COUNT(*) AS total FROM chat_history GROUP BY lower(trim(question)) ORDER BY total DESC LIMIT 20"
```

## Email notifications through Hostinger

The Worker can notify a protected PHP endpoint after every AI response and when someone submits the portfolio contact form. The endpoint uses PHPMailer with Gmail SMTP and supports multiple recipients.

1. Upload `../api` to `public_html/api`.
2. In Hostinger SSH, run `cd domains/federicocabello.net/public_html/api` and `composer2 install --no-dev --optimize-autoloader`.
3. Copy `hostinger/portfolio-notify-config.example.php` to the domain directory above `public_html` as `portfolio-notify-config.php`.
4. Fill that private file with a long shared secret, the Gmail address, a newly generated Google App Password, and the destination addresses.
5. Add `NOTIFICATION_URL` and the matching `NOTIFICATION_SECRET` to the Worker, then redeploy it.

The notification integration remains disabled while either Worker variable is missing. AI email failures are logged without interrupting chat responses; contact form failures are returned to the form so the visitor can retry.
- Allowed browser origins are listed in `src/entry.py`.
