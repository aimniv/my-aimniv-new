import { createHmac, timingSafeEqual } from 'node:crypto';

// Admin authentication (Vercel Function, Web Request/Response API).
//
// Required environment variables (set in Vercel > Project > Settings > Environment Variables):
//   ADMIN_USERNAME        admin user name
//   ADMIN_PASSWORD        admin password (use a long, random one)
//   ADMIN_SESSION_SECRET  random string, 32+ chars, used to sign session cookies
//
// Endpoints:
//   POST /api/admin/login    { username, password } -> sets HttpOnly session cookie
//   POST /api/admin/logout   -> clears cookie
//   GET  /api/admin/session  -> { authenticated: boolean }

const COOKIE_NAME = 'admin_session';
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

const handle = async (req: Request) => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  // Fail closed when the server isn't configured.
  if (!username || !password || !secret || secret.length < 32) {
    return json({ error: 'Admin authentication is not configured.' }, 503);
  }

  const action = new URL(req.url).pathname.replace(/\/+$/, '').split('/').pop();

  if (action === 'session' && req.method === 'GET') {
    const token = readCookie(req, COOKIE_NAME);
    return json({ authenticated: !!token && verifyToken(token, secret, username) });
  }

  if (action === 'logout' && req.method === 'POST') {
    return json({ ok: true }, 200, { 'Set-Cookie': `${COOKIE_NAME}=; ${cookieAttrs(0)}` });
  }

  if (action === 'login' && req.method === 'POST') {
    // Reject cross-site form posts (defense in depth next to SameSite=Strict).
    // Compare hosts only: behind a proxy req.url may report http while Origin is https.
    const origin = req.headers.get('origin');
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || new URL(req.url).host;
    if (origin) {
      let originHost = '';
      try { originHost = new URL(origin).host; } catch { /* invalid origin */ }
      if (originHost !== host) return json({ error: 'Forbidden' }, 403);
    }

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
