import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { get, put } from '@vercel/blob';

// Admin authentication (Vercel Function, Web Request/Response API).
//
// Required environment variables (set in Vercel > Project > Settings > Environment Variables):
//   ADMIN_USERNAME        admin user name
//   ADMIN_PASSWORD        admin password (use a long, random one)
//   ADMIN_SESSION_SECRET  random string, 32+ chars, used to sign session cookies
//
// Storage (Vercel Blob, a *Public* store connected to the project) needs BLOB_READ_WRITE_TOKEN,
// which Vercel adds automatically when the store is connected.
//
// Endpoints:
//   POST /api/admin/login    { username, password } -> sets HttpOnly session cookie
//   POST /api/admin/logout   -> clears cookie
//   GET  /api/admin/session  -> { authenticated: boolean }
//   GET  /api/admin/content  -> { content } public site content (null if nothing saved yet)
//   PUT  /api/admin/content  -> saves site content (admin only)
//   POST /api/admin/upload   -> uploads one image, returns { url } (admin only)

const COOKIE_NAME = 'admin_session';
const CONTENT_PATH = 'site/content.json';
const MAX_CONTENT_BYTES = 2 * 1024 * 1024;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const OBJECT_KEYS = ['profile', 'academics', 'skills', 'contact'];
const ARRAY_KEYS = ['certificates', 'announcements', 'courses', 'projects', 'blogs', 'socialPosts'];
const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

// Best-effort throttle: state lives per warm function instance only.
const failedAttempts = new Map<string, { count: number; first: number }>();

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  });

const sign = (payload: string, secret: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

// Compare via fixed-length digests so length differences don't leak through timing.
const safeEqual = (a: string, b: string, secret: string) =>
  timingSafeEqual(
    createHmac('sha256', secret).update(a).digest(),
    createHmac('sha256', secret).update(b).digest()
  );

const createToken = (username: string, secret: string) => {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_SECONDS * 1000 })
  ).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
};

const verifyToken = (token: string, secret: string, username: string) => {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload, secret);
  if (signature.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.u === username && typeof data.exp === 'number' && data.exp > Date.now();
  } catch {
    return false;
  }
};

const readCookie = (req: Request, name: string) => {
  const header = req.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
};

const cookieAttrs = (maxAge: number) =>
  `Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;

const clientIp = (req: Request) =>
  req.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() ||
  req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
  'unknown';

// Compare hosts only: behind a proxy req.url may report http while Origin is https.
const sameOrigin = (req: Request) => {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || new URL(req.url).host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
};

// True when the request carries a valid admin session cookie.
const isAuthed = (req: Request, secret: string, username: string) => {
  const token = readCookie(req, COOKIE_NAME);
  return !!token && verifyToken(token, secret, username);
};

// Checks magic bytes so only real images are stored.
const looksLikeImage = (buf: Buffer, type: string) => {
  if (type === 'image/jpeg') return buf[0] === 0xff && buf[1] === 0xd8;
  if (type === 'image/png') return buf.subarray(0, 4).toString('hex') === '89504e47';
  if (type === 'image/gif') return buf.subarray(0, 3).toString('latin1') === 'GIF';
  if (type === 'image/webp') {
    return buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP';
  }
  return false;
};

const readContent = async () => {
  try {
    const result = await get(CONTENT_PATH, { access: 'public', useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return JSON.parse(await new Response(result.stream).text());
  } catch (error) {
    console.error('content read failed', error);
    return null;
  }
};

const handleContent = async (req: Request, authed: () => boolean) => {
  if (req.method === 'GET') {
    return json({ content: await readContent() }, 200, {
      'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
    });
  }

  if (req.method === 'PUT') {
    if (!sameOrigin(req)) return json({ error: 'Forbidden' }, 403);
    if (!authed()) return json({ error: 'Unauthorized' }, 401);

    const text = await req.text();
    if (text.length > MAX_CONTENT_BYTES) return json({ error: 'Content too large' }, 413);
    if (/"data:image\//.test(text)) return json({ error: 'Images must be uploaded first' }, 400);

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(text);
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json({ error: 'Invalid content' }, 400);
    }

    const content: Record<string, unknown> = {};
    for (const key of OBJECT_KEYS) {
      if (body[key] === undefined) continue;
      if (!body[key] || typeof body[key] !== 'object' || Array.isArray(body[key])) {
        return json({ error: `Invalid "${key}"` }, 400);
      }
      content[key] = body[key];
    }
    for (const key of ARRAY_KEYS) {
      if (body[key] === undefined) continue;
      if (!Array.isArray(body[key])) return json({ error: `Invalid "${key}"` }, 400);
      content[key] = body[key];
    }

    try {
      await put(CONTENT_PATH, JSON.stringify({ ...content, updatedAt: new Date().toISOString() }), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        cacheControlMaxAge: 60,
      });
    } catch (error) {
      console.error('content write failed', error);
      return json({ error: 'Storage is not configured or unavailable.' }, 503);
    }
    return json({ ok: true });
  }

  return json({ error: 'Not found' }, 404);
};

const handleUpload = async (req: Request, authed: () => boolean) => {
  if (req.method !== 'POST') return json({ error: 'Not found' }, 404);
  if (!sameOrigin(req)) return json({ error: 'Forbidden' }, 403);
  if (!authed()) return json({ error: 'Unauthorized' }, 401);

  const type = (req.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  const ext = IMAGE_TYPES[type];
  if (!ext) return json({ error: 'Unsupported image type' }, 415);

  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.length === 0 || buf.length > MAX_IMAGE_BYTES) return json({ error: 'Invalid image size' }, 413);
  if (!looksLikeImage(buf, type)) return json({ error: 'Invalid image' }, 415);

  try {
    const blob = await put(`uploads/${randomUUID()}.${ext}`, buf, {
      access: 'public',
      addRandomSuffix: false,
      contentType: type,
      cacheControlMaxAge: 31536000,
    });
    return json({ url: blob.url });
  } catch (error) {
    console.error('upload failed', error);
    return json({ error: 'Storage is not configured or unavailable.' }, 503);
  }
};

const handle = async (req: Request) => {
  const action = new URL(req.url).pathname.replace(/\/+$/, '').split('/').pop();

  // Public content must be readable even if admin login isn't configured.
  if (action === 'content' && req.method === 'GET') return handleContent(req, () => false);

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  // Fail closed when the server isn't configured.
  if (!username || !password || !secret || secret.length < 32) {
    return json({ error: 'Admin authentication is not configured.' }, 503);
  }

  const authed = () => isAuthed(req, secret, username);

  if (action === 'content') return handleContent(req, authed);
  if (action === 'upload') return handleUpload(req, authed);

  if (action === 'session' && req.method === 'GET') {
    return json({ authenticated: authed() });
  }

  if (action === 'logout' && req.method === 'POST') {
    return json({ ok: true }, 200, { 'Set-Cookie': `${COOKIE_NAME}=; ${cookieAttrs(0)}` });
  }

  if (action === 'login' && req.method === 'POST') {
    // Reject cross-site form posts (defense in depth next to SameSite=Strict).
    if (!sameOrigin(req)) return json({ error: 'Forbidden' }, 403);

    const ip = clientIp(req);
    const now = Date.now();
    const entry = failedAttempts.get(ip);
    if (entry && now - entry.first > LOCKOUT_MS) failedAttempts.delete(ip);
    const current = failedAttempts.get(ip);
    if (current && current.count >= MAX_FAILED_ATTEMPTS) {
      return json({ error: 'Too many attempts. Try again later.' }, 429);
    }

    let body: { username?: unknown; password?: unknown } = {};
    try {
      body = await req.json();
    } catch {
      return json({ error: 'Invalid request' }, 400);
    }
    const u = typeof body.username === 'string' ? body.username : '';
    const p = typeof body.password === 'string' ? body.password : '';

    // Evaluate both checks so timing doesn't reveal which one failed.
    const userOk = safeEqual(u, username, secret);
    const passOk = safeEqual(p, password, secret);

    if (!(userOk && passOk)) {
      failedAttempts.set(ip, { count: (current?.count || 0) + 1, first: current?.first || now });
      await new Promise((resolve) => setTimeout(resolve, 600));
      return json({ error: 'Invalid credentials' }, 401);
    }

    failedAttempts.delete(ip);
    return json({ ok: true }, 200, {
      'Set-Cookie': `${COOKIE_NAME}=${createToken(username, secret)}; ${cookieAttrs(SESSION_TTL_SECONDS)}`,
    });
  }

  return json({ error: 'Not found' }, 404);
};

export default { fetch: handle };
