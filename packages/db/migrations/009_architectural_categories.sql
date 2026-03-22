-- Migration 009: Add Carvings category and comprehensive architectural subcategories
-- Adds top-level Carvings category, Windows & Doorways, Ceiling & Wall Elements
-- Adds detailed architectural subcategories across all parent categories

-- ═══════════════════════════════════════════════════════
-- 1. NEW TOP-LEVEL CATEGORIES
-- ═══════════════════════════════════════════════════════

-- Carvings
INSERT INTO categories (name, slug, description, parent_category_id)
VALUES ('Carvings', 'carvings', 'Carved architectural ornament — relief work, rosettes, appliqués, and decorative panels', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Windows & Doorways
INSERT INTO categories (name, slug, description, parent_category_id)
VALUES ('Windows & Doorways', 'windows-and-doorways', 'Surrounds, casings, pediments, and trim for windows and doors', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Ceiling & Wall Elements
INSERT INTO categories (name, slug, description, parent_category_id)
VALUES ('Ceiling & Wall Elements', 'ceiling-and-wall-elements', 'Coffers, medallions, wainscoting, panels, and wall trim', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Columns & Pilasters
INSERT INTO categories (name, slug, description, parent_category_id)
VALUES ('Columns & Pilasters', 'columns-and-pilasters', 'Full columns, half columns, pilasters, and their component parts', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Entablature
INSERT INTO categories (name, slug, description, parent_category_id)
VALUES ('Entablature', 'entablature', 'Architrave, frieze, and cornice assemblies — the horizontal band above columns', NULL)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 2. CARVINGS SUBCATEGORIES
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, description, parent_category_id)
VALUES
  ('Low Relief (Bas-Relief)', 'low-relief', 'Shallow carved ornament projecting less than half its depth from the background', (SELECT id FROM categories WHERE slug = 'carvings')),
  ('High Relief (Alto-Relief)', 'high-relief', 'Deeply carved ornament projecting more than half its depth, nearly freestanding', (SELECT id FROM categories WHERE slug = 'carvings')),
  ('Mezzo Relief', 'mezzo-relief', 'Medium-depth carving between low and high relief', (SELECT id FROM categories WHERE slug = 'carvings')),
  ('Rosettes & Medallions', 'rosettes-and-medallions', 'Circular carved ornaments — flower forms, paterae, and roundels', (SELECT id FROM categories WHERE slug = 'carvings')),
  ('Appliqués & Onlays', 'appliques-and-onlays', 'Carved elements applied to a flat surface — scrolls, shells, acanthus leaves', (SELECT id FROM categories WHERE slug = 'carvings')),
  ('Corbels & Brackets', 'corbels-and-brackets', 'Structural and decorative projecting supports — scrolled, carved, or turned', (SELECT id FROM categories WHERE slug = 'carvings')),
  ('Finials & Drops', 'finials-and-drops', 'Terminal ornaments — pineapples, urns, acorns, pendants', (SELECT id FROM categories WHERE slug = 'carvings'))
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 3. ENTABLATURE SUBCATEGORIES
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, description, parent_category_id)
VALUES
  ('Architrave', 'architrave', 'The lowest band of the entablature, resting directly on columns or pilasters', (SELECT id FROM categories WHERE slug = 'entablature')),
  ('Frieze', 'frieze', 'The middle band between architrave and cornice — smooth, carved, or paneled', (SELECT id FROM categories WHERE slug = 'entablature')),
  ('Cornice', 'cornice', 'The projecting top section of the entablature with crown and bed moldings', (SELECT id FROM categories WHERE slug = 'entablature')),
  ('Dentils', 'dentils', 'Small, evenly spaced rectangular blocks forming a row beneath the cornice', (SELECT id FROM categories WHERE slug = 'entablature')),
  ('Modillions', 'modillions', 'Scrolled brackets under the corona of a Corinthian or Composite cornice', (SELECT id FROM categories WHERE slug = 'entablature')),
  ('Triglyphs & Metopes', 'triglyphs-and-metopes', 'Alternating vertically grooved blocks and flat panels in a Doric frieze', (SELECT id FROM categories WHERE slug = 'entablature'))
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 4. COLUMNS & PILASTERS SUBCATEGORIES
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, description, parent_category_id)
VALUES
  ('Column Bases', 'column-bases', 'Attic bases, Tuscan bases, plinths, and torus moldings', (SELECT id FROM categories WHERE slug = 'columns-and-pilasters')),
  ('Column Shafts', 'column-shafts', 'Fluted, smooth, and tapered shafts with entasis', (SELECT id FROM categories WHERE slug = 'columns-and-pilasters')),
  ('Column Capitals', 'column-capitals', 'Doric, Ionic, Corinthian, Tuscan, and Composite capitals', (SELECT id FROM categories WHERE slug = 'columns-and-pilasters')),
  ('Pilasters', 'pilasters', 'Flat, wall-mounted columns with base, shaft, and capital', (SELECT id FROM categories WHERE slug = 'columns-and-pilasters')),
  ('Engaged Columns', 'engaged-columns', 'Half-round columns attached to a wall surface', (SELECT id FROM categories WHERE slug = 'columns-and-pilasters'))
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 5. WINDOWS & DOORWAYS SUBCATEGORIES
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, description, parent_category_id)
VALUES
  ('Lintels', 'lintels', 'Horizontal structural elements spanning the top of an opening', (SELECT id FROM categories WHERE slug = 'windows-and-doorways')),
  ('Architraves (Door & Window)', 'door-window-architraves', 'Decorative frames and casings surrounding openings', (SELECT id FROM categories WHERE slug = 'windows-and-doorways')),
  ('Archivolts', 'archivolts', 'Ornamental moldings following the curve of an arch', (SELECT id FROM categories WHERE slug = 'windows-and-doorways')),
  ('Keystones', 'keystones', 'The central wedge-shaped stone or block at the crown of an arch', (SELECT id FROM categories WHERE slug = 'windows-and-doorways')),
  ('Voussoirs', 'voussoirs', 'Wedge-shaped elements forming an arch ring', (SELECT id FROM categories WHERE slug = 'windows-and-doorways')),
  ('Spandrels', 'spandrels', 'Triangular areas between the curve of an arch and the surrounding frame', (SELECT id FROM categories WHERE slug = 'windows-and-doorways')),
  ('Pediments', 'pediments', 'Triangular or curved crowning elements above doors and windows', (SELECT id FROM categories WHERE slug = 'windows-and-doorways')),
  ('Transoms & Fanlights', 'transoms-and-fanlights', 'Glazed panels above doors — rectangular transoms and arched fanlights', (SELECT id FROM categories WHERE slug = 'windows-and-doorways')),
  ('Sills & Aprons', 'sills-and-aprons', 'Horizontal bottom elements of window openings and decorative panels below', (SELECT id FROM categories WHERE slug = 'windows-and-doorways')),
  ('Mullions & Muntins', 'mullions-and-muntins', 'Vertical and horizontal dividers within window frames', (SELECT id FROM categories WHERE slug = 'windows-and-doorways'))
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 6. CEILING & WALL ELEMENTS SUBCATEGORIES
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, description, parent_category_id)
VALUES
  ('Coffered Panels', 'coffered-panels', 'Recessed ceiling panels in grid patterns — square, octagonal, or diamond', (SELECT id FROM categories WHERE slug = 'ceiling-and-wall-elements')),
  ('Ceiling Medallions', 'ceiling-medallions', 'Ornamental discs surrounding light fixtures — acanthus, egg-and-dart, rope', (SELECT id FROM categories WHERE slug = 'ceiling-and-wall-elements')),
  ('Ceiling Rosettes', 'ceiling-rosettes', 'Carved floral ornaments for ceiling center points', (SELECT id FROM categories WHERE slug = 'ceiling-and-wall-elements')),
  ('Wainscoting & Paneling', 'wainscoting-and-paneling', 'Lower wall paneling — raised panel, flat panel, board-and-batten, beadboard', (SELECT id FROM categories WHERE slug = 'ceiling-and-wall-elements')),
  ('Dado Rails', 'dado-rails', 'Horizontal molding dividing wall surfaces at dado height', (SELECT id FROM categories WHERE slug = 'ceiling-and-wall-elements')),
  ('Niches & Alcoves', 'niches-and-alcoves', 'Recessed wall features — arched, shell-topped, or rectangular', (SELECT id FROM categories WHERE slug = 'ceiling-and-wall-elements')),
  ('Soffits & Coves', 'soffits-and-coves', 'Concave moldings transitioning between wall and ceiling planes', (SELECT id FROM categories WHERE slug = 'ceiling-and-wall-elements'))
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 7. ADDITIONAL STAIR PARTS SUBCATEGORIES
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, description, parent_category_id)
VALUES
  ('Volutes & Scrolls', 'volutes-and-scrolls', 'Spiral terminations for handrails and newel posts', (SELECT id FROM categories WHERE slug = 'stair-parts')),
  ('Stringers', 'stringers', 'The inclined structural members supporting treads and risers', (SELECT id FROM categories WHERE slug = 'stair-parts')),
  ('Rosettes (Stair)', 'stair-rosettes', 'Decorative blocks used where handrails meet walls', (SELECT id FROM categories WHERE slug = 'stair-parts')),
  ('Tread Brackets', 'tread-brackets', 'Ornamental end pieces on exposed stair treads', (SELECT id FROM categories WHERE slug = 'stair-parts'))
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- 8. ADDITIONAL TRIM & MOLDING SUBCATEGORIES
-- ═══════════════════════════════════════════════════════

INSERT INTO categories (name, slug, description, parent_category_id)
VALUES
  ('Picture Rails', 'picture-rails', 'Horizontal molding near the ceiling for hanging artwork', (SELECT id FROM categories WHERE slug = 'trim-and-molding')),
  ('Plate Rails', 'plate-rails', 'Grooved shelf molding for displaying plates and decorative items', (SELECT id FROM categories WHERE slug = 'trim-and-molding')),
  ('Cove Molding', 'cove-molding', 'Concave molding used at the junction of wall and ceiling', (SELECT id FROM categories WHERE slug = 'trim-and-molding')),
  ('Egg-and-Dart', 'egg-and-dart', 'Classical ornamental molding alternating oval and pointed forms', (SELECT id FROM categories WHERE slug = 'trim-and-molding')),
  ('Dentil Molding', 'dentil-molding', 'Molding featuring evenly spaced small rectangular blocks', (SELECT id FROM categories WHERE slug = 'trim-and-molding'))
ON CONFLICT (slug) DO NOTHING;
