-- NO SIGNAL production database schema (Cloudflare D1 / SQLite compatible)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  compare_at INTEGER,
  badge TEXT,
  description TEXT,
  image TEXT,
  sizes_json TEXT NOT NULL DEFAULT '[]',
  colors_json TEXT NOT NULL DEFAULT '[]',
  color_images_json TEXT NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  ceeprinto_product_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  city TEXT,
  address TEXT NOT NULL,
  postal_code TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  fulfillment_status TEXT NOT NULL DEFAULT 'received',
  ceeprinto_order_id TEXT,
  tracking_number TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  size TEXT,
  color TEXT,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS promo_codes (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL,
  discount_value INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  expires_at TEXT
);
