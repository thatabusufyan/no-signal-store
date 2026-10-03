export async function onRequestGet({ env }) {
  if (!env.DB) {
    return Response.json(
      { error: "Database is not configured yet." },
      { status: 503 }
    );
  }

  const { results } = await env.DB.prepare(`
    SELECT
      id,
      name,
      slug,
      category,
      price,
      compare_at AS compareAt,
      badge,
      description,
      image,
      sizes_json,
      colors_json,
      color_images_json,
      stock,
      featured,
      published,
      ceeprinto_product_id AS ceeprintoProductId,
      fulfillment_type AS fulfillmentType
    FROM products
    WHERE published=1
    ORDER BY created_at DESC
  `).all();

  return Response.json(
    results.map(p => {
      const media = JSON.parse(p.color_images_json || "{}");

      const gallery = Array.isArray(media.gallery)
        ? media.gallery
        : Object.entries(media)
            .filter(([k]) => !["gallery", "musicUrl", "musicVolume"].includes(k))
            .map(([color, src]) => ({ src, color }));

      return {
        ...p,
        sizes: JSON.parse(p.sizes_json || "[]"),
        colors: JSON.parse(p.colors_json || "[]"),
        colorImages: JSON.parse(p.color_images_json || "{}"),
        gallery,
        musicUrl: media.musicUrl || "",
        musicVolume: Number(media.musicVolume ?? 0.35)
      };
    })
  );
}
