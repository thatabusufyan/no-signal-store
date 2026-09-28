import { clearSessionCookie, json, requireAdmin } from "./_auth.js";

export async function onRequestPost({ request, env }) {
  const auth = await requireAdmin(request, env);
  if (auth.ok) await env.DB.prepare("DELETE FROM admin_sessions WHERE id = ?").bind(auth.sessionId).run();
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
}
