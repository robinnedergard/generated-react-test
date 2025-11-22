-- SQL script to insert product data from products.ts
-- This script assumes a products table with the following structure:
--
-- CREATE TABLE products (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- PostgreSQL
--   -- or: id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- MySQL
--   -- or: id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- PostgreSQL with uuid-ossp extension
--   name VARCHAR(255) NOT NULL,
--   category VARCHAR(100) NOT NULL,
--   price DECIMAL(10, 2) NOT NULL,
--   image TEXT NOT NULL,
--   description TEXT NOT NULL,
--   badge VARCHAR(100),
--   featured BOOLEAN DEFAULT FALSE,
--   rating DECIMAL(3, 1) NOT NULL,
--   colors JSON -- For PostgreSQL/MySQL 5.7+, or use TEXT for older versions
-- );

-- Insert products with UUID v4 IDs
INSERT INTO products (id, name, category, price, image, description, badge, featured, rating, colors) VALUES
('9a09e0e4-7177-493c-ba58-1378353b2efa', 'Aurora Porcelain Vase', 'Decor', 120.00, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80', 'Hand-thrown porcelain with a matte glaze inspired by slow dawns and fresh blooms.', 'New Arrival', TRUE, 4.8, '["Cloud White", "Soft Blush"]'),
('8478aae0-06fd-4bd5-b4de-54ab1995b529', 'Coastal Linen Sheet Set', 'Bedroom', 240.00, 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80', 'Stone-washed European flax linen that grows softer with every night.', 'Bestseller', TRUE, 4.9, '["Mist", "Sage", "Sand"]'),
('b96ef3af-6fa3-4012-ac20-b85c6051fc3c', 'Atelier Ceramic Mug Set', 'Kitchen', 64.00, 'https://images.unsplash.com/photo-1488998527040-85054a85150e?auto=format&fit=crop&w=900&q=80', 'Set of four wheel-thrown mugs with raw stoneware base and satin glaze.', NULL, FALSE, 4.7, '["Charcoal", "Oat"]'),
('a1887567-5af8-4105-8251-28c33428609d', 'Soho Lounge Chair', 'Furniture', 890.00, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80', 'Low-profile lounge chair upholstered in recycled bouclé with walnut legs.', 'Limited', TRUE, 4.6, '["Ivory", "Ink"]'),
('16f2600a-8977-4d06-b4e9-409db390a34d', 'Balance Arc Lamp', 'Lighting', 310.00, 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=900&q=80', 'Sculptural floor lamp with adjustable arc and warm-diffused LED glow.', NULL, FALSE, 4.5, '["Matte Black", "Brass"]'),
('7892dd70-5520-40a7-ac66-0f8c1020d15e', 'Atlas Wool Rug', 'Living Room', 620.00, 'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=900&q=80', 'Hand-loomed Moroccan inspired rug in a low-contrast geometric pattern.', NULL, FALSE, 4.8, '["Natural", "Noir"]'),
('58134b0e-cb29-4c10-a208-dd960be77206', 'Gradient Glassware Duo', 'Kitchen', 78.00, 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=900&q=80', 'Heat-resistant borosilicate glasses with a subtle ombré finish.', 'Editors'' pick', FALSE, 4.4, '["Amber Fade", "Rose Fade"]'),
('2f5c81bb-4b3d-4cec-9eb2-13f98baf1499', 'Elevate Planter Trio', 'Outdoor', 185.00, 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=900&q=80', 'Powder-coated steel planters with hidden drainage for effortless greenery.', NULL, FALSE, 4.6, '["Eucalyptus", "Clay"]');

-- Alternative: If your database doesn't support JSON, you can use a normalized approach:
-- 
-- CREATE TABLE products (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- PostgreSQL
--   -- or: id CHAR(36) PRIMARY KEY DEFAULT (UUID()), -- MySQL
--   name VARCHAR(255) NOT NULL,
--   category VARCHAR(100) NOT NULL,
--   price DECIMAL(10, 2) NOT NULL,
--   image TEXT NOT NULL,
--   description TEXT NOT NULL,
--   badge VARCHAR(100),
--   featured BOOLEAN DEFAULT FALSE,
--   rating DECIMAL(3, 1) NOT NULL
-- );
--
-- CREATE TABLE product_colors (
--   id SERIAL PRIMARY KEY,
--   product_id UUID NOT NULL,
--   color VARCHAR(100) NOT NULL,
--   FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
-- );
--
-- Then insert colors separately:
-- INSERT INTO product_colors (product_id, color) VALUES
-- ('9a09e0e4-7177-493c-ba58-1378353b2efa', 'Cloud White'),
-- ('9a09e0e4-7177-493c-ba58-1378353b2efa', 'Soft Blush'),
-- ('8478aae0-06fd-4bd5-b4de-54ab1995b529', 'Mist'),
-- ('8478aae0-06fd-4bd5-b4de-54ab1995b529', 'Sage'),
-- ('8478aae0-06fd-4bd5-b4de-54ab1995b529', 'Sand'),
-- ('b96ef3af-6fa3-4012-ac20-b85c6051fc3c', 'Charcoal'),
-- ('b96ef3af-6fa3-4012-ac20-b85c6051fc3c', 'Oat'),
-- ('a1887567-5af8-4105-8251-28c33428609d', 'Ivory'),
-- ('a1887567-5af8-4105-8251-28c33428609d', 'Ink'),
-- ('16f2600a-8977-4d06-b4e9-409db390a34d', 'Matte Black'),
-- ('16f2600a-8977-4d06-b4e9-409db390a34d', 'Brass'),
-- ('7892dd70-5520-40a7-ac66-0f8c1020d15e', 'Natural'),
-- ('7892dd70-5520-40a7-ac66-0f8c1020d15e', 'Noir'),
-- ('58134b0e-cb29-4c10-a208-dd960be77206', 'Amber Fade'),
-- ('58134b0e-cb29-4c10-a208-dd960be77206', 'Rose Fade'),
-- ('2f5c81bb-4b3d-4cec-9eb2-13f98baf1499', 'Eucalyptus'),
-- ('2f5c81bb-4b3d-4cec-9eb2-13f98baf1499', 'Clay');

