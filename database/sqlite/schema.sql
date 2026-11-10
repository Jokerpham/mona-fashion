-- ============================================================
-- MONA Fashion - Co so du lieu (SQLite 3) - ban chay thu ngay tren may
-- Chay:  sqlite3 database/sqlite/mona.db < database/sqlite/schema.sql
-- Sau do: psql "$DATABASE_URL" -f database/sqlite/seed.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  phone         VARCHAR(30),
  address       TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  VARCHAR(80) NOT NULL,
  slug  VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INT NOT NULL REFERENCES categories(id),
  name        VARCHAR(190) NOT NULL,
  slug        VARCHAR(190) NOT NULL UNIQUE,
  description TEXT,
  price       INT NOT NULL CHECK (price >= 0),           -- gia ban, don vi VND
  old_price   INT CHECK (old_price IS NULL OR old_price >= 0), -- gia goc khi sale
  tag         VARCHAR(20) CHECK (tag IN ('best','new','sale')),
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_tag ON products(tag);

CREATE TABLE IF NOT EXISTS product_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        VARCHAR(255),
  sort_order INT NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

CREATE TABLE IF NOT EXISTS product_sizes (
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size       VARCHAR(20) NOT NULL,
  stock      INT NOT NULL DEFAULT 100 CHECK (stock >= 0),
  PRIMARY KEY (product_id, size)
);

-- Gio hang: user_id NULL + session_id danh cho khach chua dang nhap
CREATE TABLE IF NOT EXISTS cart_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INT REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(80),
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size       VARCHAR(20) NOT NULL,
  quantity   INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (user_id, session_id, product_id, size)
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  code            VARCHAR(30) NOT NULL UNIQUE,  -- vd MONA539976
  user_id         INT REFERENCES users(id) ON DELETE SET NULL,
  customer_name   VARCHAR(120) NOT NULL,
  phone           VARCHAR(30) NOT NULL,
  email           VARCHAR(190),
  address         TEXT NOT NULL,
  payment_method  VARCHAR(20) NOT NULL DEFAULT 'cod' CHECK (payment_method IN ('cod','bank','momo')),
  status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipping','done','cancelled')),
  subtotal        INT NOT NULL DEFAULT 0,
  shipping_fee    INT NOT NULL DEFAULT 0,       -- mien phi ship tu 500.000d (logic o app)
  total           INT NOT NULL DEFAULT 0,
  note            TEXT,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INT REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(190) NOT NULL,  -- snapshot luc dat hang
  size         VARCHAR(20) NOT NULL,
  price        INT NOT NULL,           -- snapshot gia luc dat
  quantity     INT NOT NULL CHECK (quantity > 0),
  subtotal     INT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

CREATE TABLE IF NOT EXISTS posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      VARCHAR(255) NOT NULL,
  slug       VARCHAR(255) NOT NULL UNIQUE,
  category   VARCHAR(40) NOT NULL CHECK (category IN ('Fashion','Inspiration','Shopping','Lifestyle','Minimalism')),
  excerpt    TEXT,
  content    TEXT,
  image_url  TEXT,
  is_published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Form trang Lien he
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       VARCHAR(120) NOT NULL,
  email      VARCHAR(190) NOT NULL,
  subject    VARCHAR(255),
  message    TEXT NOT NULL,
  is_read    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Form "Uu dai dac biet / Nhan tu van mien phi" o footer
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      VARCHAR(190) NOT NULL UNIQUE,
  is_active  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
