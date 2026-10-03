import { json, requireAdmin } from "./_auth.js";

export async function onRequestPost({ request, env }) {
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  if (!body.action) {
    return json({ error: "Missing action." }, 400);
  }

  const response = await fetch(new URL("/api/ceeprinto", request.url), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: request.headers.get("cookie") || ""
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();

  return new Response(text, {
    status: response.status,
    headers: {
      "content-type": "application/json"
    }
  });
}
