<div align="center">
<img width="1200" height="475" alt="GHBanner" src=/>
</div>

# Run and deploy your aimniv.dev

This contains everything you need to run your app locally.

View your app in aimniv

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Admin panel (`/admin`)

The admin panel lives at `<site-url>/admin`. Login is verified on the server by a
Netlify Function (`netlify/functions/admin-auth.ts`); the session is an HttpOnly,
Secure, SameSite=Strict cookie that expires after 8 hours.

Set these in **Netlify → Site configuration → Environment variables** (the panel
refuses all logins until they exist):

| Variable | Value |
| --- | --- |
| `ADMIN_USERNAME` | admin user name |
| `ADMIN_PASSWORD` | a long, random password |
| `ADMIN_SESSION_SECRET` | random string, 32+ characters (e.g. `openssl rand -base64 48`) |

Locally, run `npx netlify dev` instead of `npm run dev` so `/api/admin/*` works.
Put the variables in `.env.local` (git-ignored).
