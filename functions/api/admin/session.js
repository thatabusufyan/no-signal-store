import { json, requireAdmin } from "./_auth.js";
export async function onRequestGet({ request, env }) {
  const auth = await requireAdmin(request, env);
  return auth.ok ? json({ ok: true }) : auth.response;
}
