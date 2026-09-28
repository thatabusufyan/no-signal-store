import { json, createSession, sessionCookie, verifyPassword } from "./_auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.ADMIN_PASSWORD) return json({ error: "Admin authentication is not configured yet." }, 503);
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
  if (!await verifyPassword(String(body.password || ""), env.ADMIN_PASSWORD)) return json({ error: "Incorrect password." }, 401);
  const session = await createSession(env);
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(session.token) });
}
