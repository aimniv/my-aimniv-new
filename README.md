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
Vercel Function (`api/admin/[action].ts`); the session is an HttpOnly, Secure,
SameSite=Strict cookie that expires after 8 hours.

Set these in **Vercel → Project → Settings → Environment Variables** (Production,
then redeploy; the panel refuses all logins until they exist):

| Variable | Value |
| --- | --- |
| `ADMIN_USERNAME` | admin user name |
| `ADMIN_PASSWORD` | a long, random password |
| `ADMIN_SESSION_SECRET` | random string, 32+ characters (e.g. `openssl rand -base64 48`) |

Locally, run `npx vercel dev` instead of `npm run dev` so `/api/admin/*` works
(`vercel env pull .env.local` or create `.env.local` by hand; it is git-ignored).

## Site content storage (Vercel Blob)

Content edited in the admin panel (profile, courses, announcements, projects, blog,
posts, ...) is stored on the server so every visitor sees it. Images are compressed in
the browser and uploaded; only their links are stored in the content.

One-time setup in Vercel → **Storage → Create → Blob**:
1. Choose **Public** access (images must be readable by visitors).
2. Connect the store to this project for **Production** (Vercel adds `BLOB_STORE_ID` or `BLOB_READ_WRITE_TOKEN` automatically).
3. Redeploy.

Then open `/admin`, click **Değişiklikleri Kaydet** once to publish what's currently in your browser.
Until the store is connected the site shows the built-in default content and saving reports an error.

Not stored on the server yet: contact-form messages (they stay in the visitor's own browser).
