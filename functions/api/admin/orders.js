import { json, requireAdmin } from "./_auth.js";
export async function onRequestGet({ request, env }) {
  const auth = await requireAdmin(request, env); if (!auth.ok) return auth.response;
  const { results } = await env.DB.prepare(`SELECT o.id,o.subtotal,o.shipping,o.total,o.payment_method AS paymentMethod,
    c.name AS customerName,c.email,c.phone,c.city,c.address,c.postal_code AS postalCode
    FROM orders o LEFT JOIN customers c ON c.id=o.customer_id ORDER BY o.rowid DESC`).all();
  return json(results.map(o => ({...o,status:"received"})));
}
