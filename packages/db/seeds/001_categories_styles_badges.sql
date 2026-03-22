-- ============================================================
-- MillworkDatabase.com — Seed Data
-- Categories, Styles, and Badges
-- ============================================================

-- ============================================================
-- TOP-LEVEL CATEGORIES
-- ============================================================

INSERT INTO categories (id, name, slug, description, icon_name, display_order) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Trim & Molding', 'trim-and-molding', 'Door casings, window trim, baseboards, crown molding, and decorative trim profiles', 'Ruler', 1),
  ('a0000000-0000-0000-0000-000000000002', 'Stair Parts', 'stair-parts', 'Newel posts, balusters, handrails, treads, and staircase components', 'Stairs', 2),
  ('a0000000-0000-0000-0000-000000000003', 'Mantels', 'mantels', 'Fireplace surrounds, mantel shelves, and decorative fireplace components', 'Flame', 3),
  ('a0000000-0000-0000-0000-000000000004', 'Built-ins', 'built-ins', 'Wainscoting, paneling, shelving units, and specialty millwork', 'LayoutGrid', 4);

-- ============================================================
-- SUB-CATEGORIES: Trim & Molding
-- ============================================================

INSERT INTO categories (name, slug, description, icon_name, parent_category_id, display_order) VALUES
  ('Crown Molding', 'crown-molding', 'Decorative molding where walls meet ceilings', 'Crown', 'a0000000-0000-0000-0000-000000000001', 1),
  ('Baseboards', 'baseboards', 'Trim at the base of walls', 'AlignBottom', 'a0000000-0000-0000-0000-000000000001', 2),
  ('Door Casings', 'door-casings', 'Decorative trim around door frames', 'DoorOpen', 'a0000000-0000-0000-0000-000000000001', 3),
  ('Window Trim', 'window-trim', 'Decorative trim around windows', 'Square', 'a0000000-0000-0000-0000-000000000001', 4),
  ('Chair Rail', 'chair-rail', 'Horizontal molding running along walls', 'Minus', 'a0000000-0000-0000-0000-000000000001', 5),
  ('Picture Rail', 'picture-rail', 'Molding near ceiling for hanging artwork', 'Image', 'a0000000-0000-0000-0000-000000000001', 6),
  ('Rosettes', 'rosettes', 'Decorative corner blocks for door and window casings', 'Flower', 'a0000000-0000-0000-0000-000000000001', 7),
  ('Plinth Blocks', 'plinth-blocks', 'Base blocks at the bottom of door casings', 'Box', 'a0000000-0000-0000-0000-000000000001', 8),
  ('Corbels & Brackets', 'corbels-and-brackets', 'Decorative support elements', 'Brackets', 'a0000000-0000-0000-0000-000000000001', 9),
  ('Architraves', 'architraves', 'Main beam and decorative trim above columns', 'Columns', 'a0000000-0000-0000-0000-000000000001', 10);

-- ============================================================
-- SUB-CATEGORIES: Stair Parts
-- ============================================================

INSERT INTO categories (name, slug, description, icon_name, parent_category_id, display_order) VALUES
  ('Newel Posts', 'newel-posts', 'Main structural posts for staircase railings', 'Landmark', 'a0000000-0000-0000-0000-000000000002', 1),
  ('Balusters', 'balusters', 'Vertical spindles supporting the handrail', 'PillarIcon', 'a0000000-0000-0000-0000-000000000002', 2),
  ('Handrails', 'handrails', 'Continuous railing for staircase safety', 'Grip', 'a0000000-0000-0000-0000-000000000002', 3),
  ('Treads & Risers', 'treads-and-risers', 'Stair step surfaces and vertical faces', 'Footprints', 'a0000000-0000-0000-0000-000000000002', 4),
  ('Stair Skirts', 'stair-skirts', 'Trim boards running along the wall side of stairs', 'Slash', 'a0000000-0000-0000-0000-000000000002', 5);

-- ============================================================
-- SUB-CATEGORIES: Mantels
-- ============================================================

INSERT INTO categories (name, slug, description, icon_name, parent_category_id, display_order) VALUES
  ('Fireplace Surrounds', 'fireplace-surrounds', 'Complete framing around a fireplace opening', 'Frame', 'a0000000-0000-0000-0000-000000000003', 1),
  ('Mantel Shelves', 'mantel-shelves', 'Standalone shelf above a fireplace', 'BookOpen', 'a0000000-0000-0000-0000-000000000003', 2),
  ('Mantel Legs', 'mantel-legs', 'Side columns or pilasters for fireplace mantels', 'Pillar', 'a0000000-0000-0000-0000-000000000003', 3);

-- ============================================================
-- SUB-CATEGORIES: Built-ins
-- ============================================================

INSERT INTO categories (name, slug, description, icon_name, parent_category_id, display_order) VALUES
  ('Wainscoting', 'wainscoting', 'Decorative wall paneling on the lower half of walls', 'Layers', 'a0000000-0000-0000-0000-000000000004', 1),
  ('Wall Paneling', 'wall-paneling', 'Full or partial wall panel systems', 'Grid', 'a0000000-0000-0000-0000-000000000004', 2),
  ('Shelving Units', 'shelving-units', 'Built-in bookcases and shelving', 'BookMarked', 'a0000000-0000-0000-0000-000000000004', 3),
  ('Specialty Doors', 'specialty-doors', 'Custom panel doors and decorative entries', 'DoorClosed', 'a0000000-0000-0000-0000-000000000004', 4),
  ('Ceiling Medallions', 'ceiling-medallions', 'Ornamental ceiling centerpieces', 'Circle', 'a0000000-0000-0000-0000-000000000004', 5),
  ('Columns & Pilasters', 'columns-and-pilasters', 'Decorative and structural columns', 'Columns', 'a0000000-0000-0000-0000-000000000004', 6);

-- ============================================================
-- ARCHITECTURAL STYLES
-- ============================================================

INSERT INTO styles (name, slug, description) VALUES
  ('Craftsman', 'craftsman', 'Simple, clean lines with natural materials. Characterized by flat trim profiles and hand-crafted details.'),
  ('Colonial', 'colonial', 'Symmetrical design with moderate ornamentation. Common in American homes from the 1600s-1800s.'),
  ('Victorian', 'victorian', 'Elaborate ornamentation with intricate details. Features heavy crown moldings and decorative brackets.'),
  ('Art Deco', 'art-deco', 'Bold geometric patterns and rich materials. Streamlined forms with stylized decoration.'),
  ('Georgian', 'georgian', 'Classical proportions with refined detail. Influenced by Greek and Roman architecture.'),
  ('Federal', 'federal', 'Refined neoclassical style with delicate details. Oval shapes, urns, and swags.'),
  ('Greek Revival', 'greek-revival', 'Bold classical elements including columns, pediments, and heavy cornices.'),
  ('Gothic Revival', 'gothic-revival', 'Pointed arches, tracery, and medieval-inspired details.'),
  ('Queen Anne', 'queen-anne', 'Asymmetrical facades with ornate spindle work and varied textures.'),
  ('Tudor', 'tudor', 'Heavy timber framing influence with dark-stained wood and carved details.'),
  ('Mission', 'mission', 'Simple rectilinear forms inspired by Spanish Colonial missions.'),
  ('Prairie', 'prairie', 'Horizontal emphasis with natural materials and integrated details.'),
  ('Mid-Century Modern', 'mid-century-modern', 'Clean lines, minimal ornamentation, and natural/industrial materials.'),
  ('Contemporary', 'contemporary', 'Current design trends emphasizing clean profiles and mixed materials.'),
  ('Rustic', 'rustic', 'Natural, rough-hewn textures celebrating wood grain and imperfection.'),
  ('Traditional', 'traditional', 'Classic profiles that blend multiple historical influences.');

-- ============================================================
-- BADGES
-- ============================================================

INSERT INTO badges (name, slug, description, icon_name, criteria_type, criteria_threshold) VALUES
  ('First Upload', 'first-upload', 'Upload your first design to the community', 'Upload', 'designs_created', 1),
  ('Getting Started', 'getting-started', 'Upload 5 designs', 'Sprout', 'designs_created', 5),
  ('Prolific Creator', 'prolific-creator', 'Upload 25 designs', 'Rocket', 'designs_created', 25),
  ('Design Machine', 'design-machine', 'Upload 100 designs', 'Factory', 'designs_created', 100),
  ('Popular', 'popular', 'Receive 50 total downloads on your designs', 'TrendingUp', 'total_downloads_received', 50),
  ('Crowd Favorite', 'crowd-favorite', 'Receive 500 total downloads', 'Heart', 'total_downloads_received', 500),
  ('Legendary', 'legendary', 'Receive 5,000 total downloads', 'Crown', 'total_downloads_received', 5000),
  ('Community Star', 'community-star', 'Receive 25 favorites on your designs', 'Star', 'favorites_received', 25),
  ('Beloved', 'beloved', 'Receive 250 favorites', 'Sparkles', 'favorites_received', 250),
  ('Conversationalist', 'conversationalist', 'Leave 25 comments on designs', 'MessageSquare', 'comments_made', 25),
  ('Helpful Neighbor', 'helpful-neighbor', 'Leave 100 comments', 'HandHelping', 'comments_made', 100),
  ('Century Club', 'century-club', 'Earn 100 points', 'Award', 'total_points', 100),
  ('High Roller', 'high-roller', 'Earn 1,000 points', 'Trophy', 'total_points', 1000),
  ('Master Craftsman', 'master-craftsman', 'Earn 5,000 points', 'Hammer', 'total_points', 5000),
  ('Grand Master', 'grand-master', 'Earn 15,000 points', 'Shield', 'total_points', 15000);
