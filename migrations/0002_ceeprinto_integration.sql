ALTER TABLE products ADD COLUMN fulfillment_type TEXT NOT NULL DEFAULT 'internal';

CREATE TABLE IF NOT EXISTS ceeprinto_mappings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id TEXT NOT NULL,
  size TEXT,
  color TEXT,
  external_variant_id TEXT NOT NULL,
  listing_id INTEGER,
  external_sku TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, size, color),
  UNIQUE(external_variant_id),
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_ceeprinto_mappings_product
ON ceeprinto_mappings(product_id);

CREATE INDEX IF NOT EXISTS idx_ceeprinto_mappings_external
ON ceeprinto_mappings(external_variant_id);
