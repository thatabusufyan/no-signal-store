const SESSION_COOKIE = "ns_admin_session";
const SESSION_SECONDS = 86400;

function hex(bytes) {
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(text) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

function parseCookies(request) {
  const raw = request.headers.get("Cookie") || "";
  return Object.fromEntries(raw.split(";").map(x => x.trim()).filter(Boolean).map(x => {
    const i = x.indexOf("=");
    return i < 0 ? [x, ""] : [x.slice(0, i), decodeURIComponent(x.slice(i + 1))];
  }));
}

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...extra } });
}

export async function requireAdmin(request, env) {
  if (!env.DB) return { response: json({ error: "Database is not configured." }, 503) };
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) return { response: json({ error: "Unauthorized." }, 401) };
  const tokenHash = await sha256(token);
  const row = await env.DB.prepare("SELECT id, expires_at FROM admin_sessions WHERE token_hash = ?").bind(tokenHash).first();
  if (!row || Number(row.expires_at) <= Math.floor(Date.now() / 1000)) {
    if (row) await env.DB.prepare("DELETE FROM admin_sessions WHERE id = ?").bind(row.id).run();
    return { response: json({ error: "Unauthorized." }, 401) };
  }
  return { ok: true, sessionId: row.id };
}

export async function createSession(env) {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const tokenHash = await sha256(token);
  const id = crypto.randomUUID();
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  await env.DB.prepare("INSERT INTO admin_sessions (id, token_hash, expires_at, created_at) VALUES (?,?,?,?)")
    .bind(id, tokenHash, expiresAt, Math.floor(Date.now() / 1000)).run();
  return { token, expiresAt };
}

export function sessionCookie(token, maxAge = SESSION_SECONDS) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function verifyPassword(password, expected) {
  if (!expected || !password) return false;
  const a = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)));
  const b = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(expected)));
  return crypto.timingSafeEqual(a, b);
}
