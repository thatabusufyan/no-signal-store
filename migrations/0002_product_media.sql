-- NO SIGNAL product media migration
ALTER TABLE products ADD COLUMN gallery_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE products ADD COLUMN music_url TEXT;
ALTER TABLE products ADD COLUMN music_volume REAL NOT NULL DEFAULT 0.35;
