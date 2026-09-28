export async function onRequestGet({ env }) {
  if (!env.DB) return Response.json({ error: "Database is not configured yet." }, { status: 503 });
  const { results } = await env.DB.prepare(`SELECT id,name,slug,category,price,compare_at AS compareAt,badge,description,image,sizes_json,colors_json,stock,featured,published,ceeprinto_product_id AS ceeprintoProductId FROM products WHERE published=1 ORDER BY created_at DESC`).all();
  return Response.json(results.map(p => ({ ...p, sizes: JSON.parse(p.sizes_json || "[]"), colors: JSON.parse(p.colors_json || "[]") })));
}
