import { json, requireAdmin } from "./_auth.js";

export async function onRequestGet({ request, env }) {
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;

  const productId = new URL(request.url).searchParams.get("productId");

  if (!productId) {
    return json({ error: "Missing productId." }, 400);
  }

  const { results } = await env.DB.prepare(`
    SELECT
      id,
      product_id AS productId,
      size,
      color,
      external_variant_id AS externalVariantId,
      listing_id AS listingId,
      external_sku AS externalSku
    FROM ceeprinto_mappings
    WHERE product_id=?
    ORDER BY id ASC
  `).bind(productId).all();

  return json(results);
}

export async function onRequestPost({ request, env }) {
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;

  let b;

  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  if (!b.productId || !b.externalVariantId) {
    return json({
      error: "productId and externalVariantId are required."
    }, 400);
  }

  await env.DB.prepare(`
    INSERT INTO ceeprinto_mappings (
      product_id,
      size,
      color,
      external_variant_id,
      listing_id,
      external_sku,
      updated_at
    )
    VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(product_id,size,color)
    DO UPDATE SET
      external_variant_id=excluded.external_variant_id,
      listing_id=excluded.listing_id,
      external_sku=excluded.external_sku,
      updated_at=CURRENT_TIMESTAMP
  `).bind(
    b.productId,
    b.size || null,
    b.color || null,
    String(b.externalVariantId),
    b.listingId ? Number(b.listingId) : null,
    b.externalSku || null
  ).run();

  return json({ ok: true });
}

export async function onRequestDelete({ request, env }) {
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;

  let b;

  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  if (!b.id) return json({ error: "Missing mapping id." }, 400);

  await env.DB.prepare(
    "DELETE FROM ceeprinto_mappings WHERE id=?"
  ).bind(b.id).run();

  return json({ ok: true });
}
