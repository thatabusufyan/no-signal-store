import { json, requireAdmin } from "./_auth.js";

export async function onRequestPost({ request, env }) {
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;

  return json({
    error: "Direct file uploads are disabled. Please use an image or audio URL."
  }, 501);
}
