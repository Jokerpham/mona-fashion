INSERT INTO categories (id, name, slug) VALUES
  (1, 'Accessories', 'accessories'),
  (2, 'Bags', 'bags'),
  (3, 'Footwear', 'footwear'),
  (4, 'Man', 'man'),
  (5, 'Woman', 'woman')
ON CONFLICT(id) DO NOTHING;

INSERT INTO products (id, category_id, name, slug, description, price, old_price, tag, created_at, updated_at) VALUES
  (1, 1, 'Guide Pack Cap', 'guide-pack-cap', 'Mũ lưỡi trai tối giản, chất liệu cotton thoáng mát, phù hợp mọi outfit.', 50000, NULL, 'best', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 5, 'Blue Raincoat', 'blue-raincoat', 'Áo khoác dài tông xanh pastel, form rộng thanh lịch cho mùa xuân.', 430000, NULL, 'best', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 5, 'Cotton Jacket', 'cotton-jacket', 'Áo jacket cotton mềm, màu be dễ phối đồ, điểm nhấn cho set đồ tối giản.', 100000, NULL, 'best', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 5, 'Crewneck Blouse', 'crewneck-blouse', 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', 215000, NULL, 'best', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 3, 'Eather Trainers', 'eather-trainers', 'Giày trainers màu nude, đế êm, phong cách tối giản Hàn Quốc.', 310000, NULL, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 5, 'Cotton T-shirt', 'cotton-t-shirt', 'Áo thun cotton màu cam đào, sale 26%, item must-have mùa hè.', 250000, 340000, 'sale', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 2, 'Azure Tote', 'azure-tote', 'Túi tote đen quai vàng, sale 20%, đựng vừa laptop 14 inch.', 200000, 250000, 'sale', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, 4, 'Classic Topper', 'classic-topper', 'Áo khoác dáng dài màu đen cổ điển, sang trọng và dễ phối.', 490000, NULL, 'new', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;

INSERT INTO product_images (id, product_id, url, alt, sort_order) VALUES
  (1, 1, '/images/products/guide-pack-cap.jpg', 'Guide Pack Cap', 0),
  (2, 2, '/images/products/blue-raincoat.jpg', 'Blue Raincoat', 0),
  (3, 3, '/images/products/cotton-jacket.jpg', 'Cotton Jacket', 0),
  (4, 4, '/images/products/crewneck-blouse.jpg', 'Crewneck Blouse', 0),
  (5, 5, '/images/products/eather-trainers.jpg', 'Eather Trainers', 0),
  (6, 6, '/images/products/cotton-t-shirt.jpg', 'Cotton T-shirt', 0),
  (7, 7, '/images/products/azure-tote.jpg', 'Azure Tote', 0),
  (8, 8, '/images/products/classic-topper.jpg', 'Classic Topper', 0),
  (9, 1, '/images/products/guide-pack-cap-2.jpg', 'Guide Pack Cap', 1),
  (10, 2, '/images/products/blue-raincoat-2.jpg', 'Blue Raincoat', 1),
  (11, 3, '/images/products/cotton-jacket-2.jpg', 'Cotton Jacket', 1),
  (12, 4, '/images/products/crewneck-blouse-2.jpg', 'Crewneck Blouse', 1),
  (13, 5, '/images/products/eather-trainers-2.jpg', 'Eather Trainers', 1),
  (14, 6, '/images/products/cotton-t-shirt-2.jpg', 'Cotton T-shirt', 1),
  (15, 7, '/images/products/azure-tote-2.jpg', 'Azure Tote', 1),
  (16, 8, '/images/products/classic-topper-2.jpg', 'Classic Topper', 1)
ON CONFLICT(id) DO NOTHING;

INSERT INTO product_sizes (product_id, size) VALUES
  (1, 'Free'),
  (2, 'S'),
  (2, 'M'),
  (2, 'L'),
  (3, 'S'),
  (3, 'M'),
  (3, 'L'),
  (3, 'XL'),
  (4, 'S'),
  (4, 'M'),
  (4, 'L'),
  (5, '36'),
  (5, '37'),
  (5, '38'),
  (5, '39'),
  (5, '40'),
  (6, 'S'),
  (6, 'M'),
  (6, 'L'),
  (6, 'XL'),
  (7, 'Free'),
  (8, 'M'),
  (8, 'L'),
  (8, 'XL')
ON CONFLICT DO NOTHING;

INSERT INTO posts (id, title, slug, category, excerpt, content, image_url, created_at, updated_at) VALUES
  (1, 'FRIDAY FINEST THE BEST OF THE WEEK', 'friday-finest-the-best-of-the-week', 'Shopping', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...', '/images/posts/post-1.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, '5 FASHION LABELS ON THE RISE THIS SUMMER', '5-fashion-labels-on-the-rise-this-summer', 'Inspiration', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...', '/images/posts/post-2.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'A GUIDE TO THE BEST ACCESSORIES FOR FALL', 'a-guide-to-the-best-accessories-for-fall', 'Inspiration', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...', '/images/posts/post-3.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'THE BEST STREET STYLE FROM BROOKLYN''S 2016', 'the-best-street-style-from-brooklyns-2016', 'Inspiration', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...', '/images/posts/post-4.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 'A MINIMALIST COAT IS A MUST FOR FALL', 'a-minimalist-coat-is-a-must-for-fall', 'Fashion', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...', '/images/posts/post-5.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 'BEST DRESSED: THE WEEK IN OUTFITS', 'best-dressed-the-week-in-outfits', 'Shopping', 'Sed in odio faucibus, sagittis lacus eu, tempor erat. Praesent tincidunt convallis vulputate. Donec enim...', 'Sed in odio faucibus, sagittis lacus eu, tempor erat. Praesent tincidunt convallis vulputate. Donec enim...', '/images/posts/post-6.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 'SLOW MORNINGS: A LIFESTYLE IN SOFT NEUTRALS', 'slow-mornings-a-lifestyle-in-soft-neutrals', 'Lifestyle', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis ligula pellentesque nisi tristique porta...', '/images/posts/post-7.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, 'LESS IS MORE: BUILDING A MINIMAL WARDROBE', 'less-is-more-building-a-minimal-wardrobe', 'Minimalism', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...', 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id...', '/images/posts/post-8.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT(id) DO NOTHING;

INSERT INTO users (name, email, password_hash, role, created_at, updated_at) VALUES
  ('Khach Demo', 'demo@mona.local', 'scrypt$16384$8$1$dc6c84bf69cabfdf689da6e55ab1745f$607f40ca5c499ad1b9dddcacb2ff2439dd3d1a5ff4a6a7bf40ddc0e4554dd977', 'customer', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT(email) DO NOTHING;
