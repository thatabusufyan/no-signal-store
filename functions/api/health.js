export async function onRequestGet() {
  return Response.json({ ok: true, service: "NO SIGNAL API", version: "1.0" });
}
