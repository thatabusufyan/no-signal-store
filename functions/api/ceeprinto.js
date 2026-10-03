const DEFAULT_BASE =
  "https://ceeprinto.com/wp-json/ceeprinto/v2";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function base(env) {
  return String(env.CEEPRINTO_API_BASE_URL || DEFAULT_BASE).replace(/\/+$/, "");
}

function key(env) {
  return env.CEEPRINTO_API_TOKEN;
}

async function cpFetch(env, path, options = {}) {
  if (!key(env)) {
    return {
      ok: false,
      status: 503,
      body: {
        error: {
          code: "not_configured",
          message: "CEEPRINTO_API_TOKEN is not configured."
        }
      }
    };
  }

  const headers = {
    Authorization: `Bearer ${key(env)}`,
    "Content-Type": "application/json",
    "X-CP-Api-Version": "2.2.0",
    ...(options.headers || {})
  };

  const response = await fetch(`${base(env)}${path}`, {
    ...options,
    headers
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = { error: { code: "invalid_response", message: "CeePrinto returned a non-JSON response." } };
  }

  return {
    ok: response.ok,
    status: response.status,
    body
  };
}

async function getSetting(env, name) {
  const row = await env.DB
    .prepare("SELECT value FROM settings WHERE key=?")
    .bind(name)
    .first();

  return row?.value || null;
}

async function setSetting(env, name, value) {
  await env.DB
    .prepare(`
      INSERT INTO settings (key,value)
      VALUES (?,?)
      ON CONFLICT(key) DO UPDATE SET value=excluded.value
    `)
    .bind(name, String(value))
    .run();
}

async function ensureShop(env) {
  let shopId = await getSetting(env, "ceeprinto_shop_id");

  if (shopId) return Number(shopId);

  const externalShopId =
    await getSetting(env, "ceeprinto_external_shop_id") ||
    "no-signal-store";

  const response = await cpFetch(env, "/shops", {
    method: "POST",
    body: JSON.stringify({
      channel: "custom",
      external_shop_id: externalShopId,
      name: "NO SIGNAL"
    })
  });

  if (!response.ok) {
    throw new Error(
      response.body?.error?.message ||
      `CeePrinto shop registration failed (${response.status}).`
    );
  }

  shopId = response.body?.data?.id;

  if (!shopId) {
    throw new Error("CeePrinto did not return a shop ID.");
  }

  await setSetting(env, "ceeprinto_shop_id", shopId);

  return Number(shopId);
}

async function submitOrder(env, orderId) {
  const shopId = await ensureShop(env);

  const order = await env.DB.prepare(`
    SELECT
      o.id,
      o.subtotal,
      o.shipping,
      o.total,
      o.payment_method,
      c.name,
      c.email,
      c.phone,
      c.city,
      c.address,
      c.postal_code
    FROM orders o
    JOIN customers c ON c.id=o.customer_id
    WHERE o.id=?
  `).bind(orderId).first();

  if (!order) throw new Error("NO SIGNAL order was not found.");

  const { results: items } = await env.DB.prepare(`
    SELECT
      oi.product_id,
      oi.name,
      oi.size,
      oi.color,
      oi.quantity,
      oi.unit_price,
      p.fulfillment_type,
      cm.external_variant_id,
      cm.listing_id,
      cm.external_sku
    FROM order_items oi
    LEFT JOIN products p ON p.id=oi.product_id
    LEFT JOIN ceeprinto_mappings cm
      ON cm.product_id=oi.product_id
      AND COALESCE(cm.size,'')=COALESCE(oi.size,'')
      AND COALESCE(cm.color,'')=COALESCE(oi.color,'')
    WHERE oi.order_id=?
    ORDER BY oi.id ASC
  `).bind(orderId).all();

  const ceeItems = items.filter(
    item => String(item.fulfillment_type || "internal").toLowerCase() === "ceeprinto"
  );

  if (!ceeItems.length) {
    throw new Error("This order contains no CeePrinto products.");
  }

  const lineItems = [];

  for (const item of ceeItems) {
    const reference = {};

    if (item.listing_id) {
      reference.listing_id = Number(item.listing_id);
    } else if (item.external_variant_id) {
      reference.external_variant_id = item.external_variant_id;
    } else if (item.external_sku) {
      reference.external_sku = item.external_sku;
    } else {
      throw new Error(
        `No CeePrinto mapping exists for ${item.name}` +
        `${item.size ? ` / ${item.size}` : ""}` +
        `${item.color ? ` / ${item.color}` : ""}.`
      );
    }

    lineItems.push({
      ...reference,
      quantity: Number(item.quantity),
      customer_price: Number(item.unit_price)
    });
  }

  const idempotencyKey = `no-signal-${orderId}`;

  const response = await cpFetch(env, "/orders", {
    method: "POST",
    headers: {
      "Idempotency-Key": idempotencyKey
    },
    body: JSON.stringify({
      shop_id: shopId,
      shipping_address: {
        name: order.name,
        email: order.email || undefined,
        phone: order.phone,
        city: order.city || "",
        address: order.address,
        postal_code: order.postal_code || ""
      },
      line_items: lineItems
    })
  });

  if (!response.ok) {
    throw new Error(
      response.body?.error?.message ||
      `CeePrinto order submission failed (${response.status}).`
    );
  }

  const cpOrder = response.body?.data || response.body;

  const cpId =
    cpOrder?.id ||
    cpOrder?.order_id ||
    cpOrder?.order?.id;

  await env.DB.prepare(`
    UPDATE orders
    SET
      ceeprinto_order_id=?,
      fulfillment_status='submitted'
    WHERE id=?
  `).bind(
    cpId ? String(cpId) : null,
    orderId
  ).run();

  return {
    shopId,
    ceeprintoOrderId: cpId || null,
    response: cpOrder
  };
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "Database is not configured." }, 503);

  let body;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const action = body.action || "status";

  try {
    if (action === "status") {
      if (!key(env)) {
        return json({
          ok: false,
          configured: false
        });
      }

      const me = await cpFetch(env, "/me");

      return json({
        ok: me.ok,
        configured: true,
        status: me.status,
        data: me.body
      }, me.ok ? 200 : me.status);
    }

    if (action === "connect") {
      const shopId = await ensureShop(env);

      return json({
        ok: true,
        shopId
      });
    }

    if (action === "listings") {
      const shopId = await ensureShop(env);
      const page = Number(body.page || 1);
      const perPage = Math.min(Number(body.perPage || 100), 100);

      const result = await cpFetch(
        env,
        `/shops/${shopId}/listings?page=${page}&per_page=${perPage}`
      );

      return json({
        ok: result.ok,
        shopId,
        data: result.body
      }, result.status);
    }

    if (action === "send-order") {
      if (!body.orderId) {
        return json({ error: "Missing orderId." }, 400);
      }

      const result = await submitOrder(env, body.orderId);

      return json({
        ok: true,
        ...result
      }, 202);
    }

    if (action === "get-order") {
      if (!body.orderId) {
        return json({ error: "Missing CeePrinto order ID." }, 400);
      }

      const result = await cpFetch(
        env,
        `/orders/${encodeURIComponent(body.orderId)}`
      );

      return json({
        ok: result.ok,
        data: result.body
      }, result.status);
    }

    return json({ error: "Unknown CeePrinto action." }, 400);

  } catch (error) {
    return json({
      ok: false,
      error: error.message || "CeePrinto request failed."
    }, 500);
  }
}
