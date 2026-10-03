export async function onRequestGet({ request, env, params }) {
  if (!env.MEDIA) return new Response("Media storage is not configured.", { status: 503 });
  const path = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  if (!path.startsWith("products/")) return new Response("Not found.", { status: 404 });

  const object = await env.MEDIA.get(path);
  if (!object) return new Response("Not found.", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
