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
        product_id AS productId,
        name,
        size,
        color,
        quantity,
        unit_price AS unitPrice
      FROM order_items
      WHERE order_id=?
      ORDER BY id ASC
    `).bind(o.id).all();

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
      items
    });
  }

  return json(orders);
}
