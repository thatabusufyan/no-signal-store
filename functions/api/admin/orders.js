import { json, requireAdmin } from "./_auth.js";

export async function onRequestGet({ request, env }) {
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return auth.response;

  const { results } = await env.DB.prepare(`
    SELECT
      o.id,
      o.subtotal,
      o.shipping,
      o.total,
      o.payment_method AS paymentMethod,
      o.payment_status AS paymentStatus,
      o.fulfillment_status AS fulfillmentStatus,
      o.ceeprinto_order_id AS ceeprintoOrderId,
      o.tracking_number AS trackingNumber,
      o.created_at AS createdAt,

      c.name AS customerName,
      c.email,
      c.phone,
      c.city,
      c.address,
      c.postal_code AS postalCode

    FROM orders o
    LEFT JOIN customers c ON c.id=o.customer_id
    ORDER BY o.rowid DESC
  `).all();

  const orders = [];

  for (const o of results) {
    const { results: items } = await env.DB.prepare(`
      SELECT
        oi.product_id AS productId,
        oi.name,
        oi.size,
        oi.color,
        oi.image AS orderItemImage,
        p.image AS productImage,
        p.color_images_json AS productMedia,
        oi.quantity,
        oi.unit_price AS unitPrice
      FROM order_items oi
      LEFT JOIN products p ON p.id=oi.product_id
      WHERE oi.order_id=?
      ORDER BY oi.id ASC
    `).bind(o.id).all();

    const normalizedItems = items.map(item => {
      let fallback = item.productImage || "";
      try {
        const media = JSON.parse(item.productMedia || "{}");
        const gallery = Array.isArray(media.gallery) ? media.gallery : [];
        const wanted = String(item.color || "").trim().toLowerCase();
        const colorMatch = wanted
          ? gallery.find(x => x && x.src && String(x.color || "").trim().toLowerCase() === wanted)
          : null;
        fallback = colorMatch?.src || gallery.find(x => x && x.src)?.src || fallback;
      } catch (_) {}
      return {
        productId: item.productId,
        name: item.name,
        size: item.size,
        color: item.color,
        image: item.orderItemImage || fallback || "",
        quantity: item.quantity,
        unitPrice: item.unitPrice
      };
    });

    orders.push({
      ...o,
      status: o.fulfillmentStatus || "received",
      customer: {
        name: o.customerName || "",
        email: o.email || "",
        phone: o.phone || "",
        city: o.city || "",
        address: o.address || "",
        postalCode: o.postalCode || ""
      },
      items: normalizedItems
    });
  }

  return json(orders);
}
