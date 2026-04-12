-- Migration 010: Sample Empty Design Entries
-- Creates 25 empty design entries with placeholder data and appropriate tags
-- These entries have no actual files but serve as placeholders for the database

-- ════════════════════════════════════════════════════════════════════════════════
-- 1. ART DECO DOOR CASING
-- ════════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Art Deco Door Casing',
  'art-deco-door-casing',
  'Stylized Art Deco door casing with geometric patterns and stepped moldings',
  'An elegant Art Deco door casing featuring bold geometric patterns, stepped moldings, and streamlined forms. This design captures the essence of 1920s-1930s architecture with its symmetrical composition and decorative flair. Perfect for restoration projects or modern interpretations of the Art Deco style.',
  true,
  '/images/placeholder-door-casing.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000001', id FROM categories WHERE slug = 'door-casings';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000001', id FROM styles WHERE slug = 'art-deco';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'door casing', 'manual'),
  ('d0000000-0000-0000-0000-000000000001', 'art deco', 'manual'),
  ('d0000000-0000-0000-0000-000000000001', 'geometric', 'manual'),
  ('d0000000-0000-0000-0000-000000000001', 'stepped', 'manual'),
  ('d0000000-0000-0000-0000-000000000001', 'trim', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 2. VICTORIAN CROWN MOLDING
-- ════════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Victorian Crown Molding',
  'victorian-crown-molding',
  'Elaborate Victorian crown molding with intricate scrollwork and floral motifs',
  'A highly ornate Victorian crown molding design featuring complex scrollwork, floral motifs, and layered profiles. This design exemplifies the decorative excess of the Victorian era with its rich detailing and dramatic shadow lines. Ideal for historic home restoration or adding a touch of old-world elegance to modern spaces.',
  true,
  '/images/placeholder-crown.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000002', id FROM categories WHERE slug = 'crown-molding';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000002', id FROM styles WHERE slug = 'victorian';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000002', 'crown molding', 'manual'),
  ('d0000000-0000-0000-0000-000000000002', 'victorian', 'manual'),
  ('d0000000-0000-0000-0000-000000000002', 'ornate', 'manual'),
  ('d0000000-0000-0000-0000-000000000002', 'scrollwork', 'manual'),
  ('d0000000-0000-0000-0000-000000000002', 'floral', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 3. CRAFTSMAN BASEBOARD
-- ════════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'Craftsman Baseboard',
  'craftsman-baseboard',
  'Simple, clean-lined Craftsman baseboard with flat profile and minimal detailing',
  'A quintessential Craftsman-style baseboard featuring a clean, flat profile with subtle chamfers. This design emphasizes simplicity and handcrafted quality, embodying the Arts and Crafts movement principles of functional beauty. The minimal ornamentation allows the natural wood grain to take center stage.',
  true,
  '/images/placeholder-baseboard.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000003', id FROM categories WHERE slug = 'baseboards';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000003', id FROM styles WHERE slug = 'craftsman';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000003', 'baseboard', 'manual'),
  ('d0000000-0000-0000-0000-000000000003', 'craftsman', 'manual'),
  ('d0000000-0000-0000-0000-000000000003', 'simple', 'manual'),
  ('d0000000-0000-0000-0000-000000000003', 'flat profile', 'manual'),
  ('d0000000-0000-0000-0000-000000000003', 'trim', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 4. GEORGIAN DOOR CASING
-- ════════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  'Georgian Door Casing',
  'georgian-door-casing',
  'Classically proportioned Georgian door casing with refined egg-and-dart molding',
  'A refined Georgian door casing featuring classical proportions and elegant egg-and-dart molding. This design draws inspiration from Greek and Roman architecture, emphasizing symmetry and balance. The clean lines and subtle ornamentation make it versatile for both historic and contemporary interpretations.',
  true,
  '/images/placeholder-georgian-door.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000004', id FROM categories WHERE slug = 'door-casings';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000004', id FROM styles WHERE slug = 'georgian';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000004', 'door casing', 'manual'),
  ('d0000000-0000-0000-0000-000000000004', 'georgian', 'manual'),
  ('d0000000-0000-0000-0000-000000000004', 'classical', 'manual'),
  ('d0000000-0000-0000-0000-000000000004', 'egg and dart', 'manual'),
  ('d0000000-0000-0000-0000-000000000004', 'symmetrical', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 5. FEDERAL ROSETTES
-- ════════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'Federal Rosettes',
  'federal-rosettes',
  'Delicate Federal-style rosettes with oval and swag motifs for door and window corners',
  'Elegant Federal-style rosettes featuring delicate oval shapes, swags, and urn motifs. These corner blocks exemplify the refined neoclassical aesthetic of the early American republic, with their balanced proportions and subtle decorative elements. Perfect for historic restoration or adding classical detail to new construction.',
  true,
  '/images/placeholder-rosettes.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000005', id FROM categories WHERE slug = 'rosettes';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000005', id FROM styles WHERE slug = 'federal';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000005', 'rosettes', 'manual'),
  ('d0000000-0000-0000-0000-000000000005', 'federal', 'manual'),
  ('d0000000-0000-0000-0000-000000000005', 'oval', 'manual'),
  ('d0000000-0000-0000-0000-000000000005', 'swag', 'manual'),
  ('d0000000-0000-0000-0000-000000000005', 'corners', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 6. GOTHIC REVIVAL TRIM
-- ════════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000001',
  'Gothic Revival Trim',
  'gothic-revival-trim',
  'Pointed arch motifs and medieval-inspired trim for Gothic Revival architecture',
  'Dramatic Gothic Revival trim featuring pointed arch motifs, trefoils, and medieval-inspired detailing. This design captures the vertical emphasis and spiritual symbolism of Gothic architecture, with its intricate tracery and pointed forms. Ideal for churches, manors, or homes seeking a medieval aesthetic.',
  true,
  '/images/placeholder-gothic.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000006', id FROM categories WHERE slug = 'trim-and-molding';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000006', id FROM styles WHERE slug = 'gothic-revival';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000006', 'trim', 'manual'),
  ('d0000000-0000-0000-0000-000000000006', 'gothic revival', 'manual'),
  ('d0000000-0000-0000-0000-000000000006', 'pointed arch', 'manual'),
  ('d0000000-0000-0000-0000-000000000006', 'medieval', 'manual'),
  ('d0000000-0000-0000-0000-000000000006', 'tracery', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 7. QUEEN ANNE NEWEL POST
-- ╁══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000007',
  'a0000000-0000-0000-0000-000000000001',
  'Queen Anne Newel Post',
  'queen-anne-newel-post',
  'Asymmetrical Queen Anne newel post with turned elements and ornate spindle work',
  'A characteristic Queen Anne newel post featuring asymmetrical design, turned elements, and intricate spindle work. This design embodies the playful, eclectic spirit of late Victorian design with its varied textures and organic forms. Perfect for historic restoration or adding Victorian flair to new staircases.',
  true,
  '/images/placeholder-newel-post.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000007', id FROM categories WHERE slug = 'newel-posts';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000007', id FROM styles WHERE slug = 'queen-anne';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000007', 'newel post', 'manual'),
  ('d0000000-0000-0000-0000-000000000007', 'queen anne', 'manual'),
  ('d0000000-0000-0000-0000-000000000007', 'turned', 'manual'),
  ('d0000000-0000-0000-0000-000000000007', 'asymmetrical', 'manual'),
  ('d0000000-0000-0000-0000-000000000007', 'spindle', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 8. TUDOR CORBEL
-- ════════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000001',
  'Tudor Corbel',
  'tudor-corbel',
  'Heavy timber-inspired Tudor corbel with dark-stained wood and carved details',
  'A substantial Tudor-style corbel featuring heavy timber-inspired forms with dark-stained wood and intricate carved details. This design draws from medieval English architecture, with its pronounced projection and rich surface texture. Ideal for fireplace mantels, cabinetry, or structural decoration.',
  true,
  '/images/placeholder-corbel.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000008', id FROM categories WHERE slug = 'corbels-and-brackets';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000008', id FROM styles WHERE slug = 'tudor';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000008', 'corbel', 'manual'),
  ('d0000000-0000-0000-0000-000000000008', 'tudor', 'manual'),
  ('d0000000-0000-0000-0000-000000000008', 'timber', 'manual'),
  ('d0000000-0000-0000-0000-000000000008', 'carved', 'manual'),
  ('d0000000-0000-0000-0000-000000000008', 'support', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 9. MID-CENTURY MODERN CROWN
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000009',
  'a0000000-0000-0000-0000-000000000001',
  'Mid-Century Modern Crown',
  'mid-century-modern-crown',
  'Clean-lined mid-century crown molding with subtle profile and minimal projection',
  'A quintessential mid-century modern crown molding featuring clean lines, subtle profiles, and minimal projection. This design embodies the era''s emphasis on simplicity and integration with architecture, with its understated form allowing the space and light to take center stage. Perfect for 1950s-1970s homes or contemporary interpretations.',
  true,
  '/images/placeholder-mcm-crown.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000009', id FROM categories WHERE slug = 'crown-molding';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000009', id FROM styles WHERE slug = 'mid-century-modern';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000009', 'crown molding', 'manual'),
  ('d0000000-0000-0000-0000-000000000009', 'mid-century modern', 'manual'),
  ('d0000000-0000-0000-0000-000000000009', 'clean lines', 'manual'),
  ('d0000000-0000-0000-0000-000000000009', 'minimal', 'manual'),
  ('d0000000-0000-0000-0000-000000000009', 'molding', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 10. CONTEMPORARY WAINSCOTING
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000010',
  'a0000000-0000-0000-0000-000000000001',
  'Contemporary Wainscoting',
  'contemporary-wainscoting',
  'Modern wainscoting design with flat panels and clean, horizontal lines',
  'A sleek contemporary wainscoting design featuring flat panels, clean horizontal lines, and a minimalist aesthetic. This design reflects current trends in architecture with its emphasis on simplicity, clean profiles, and integration with modern interiors. Perfect for creating visual interest on walls without overwhelming the space.',
  true,
  '/images/placeholder-wainscoting.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000010', id FROM categories WHERE slug = 'wainscoting';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000010', id FROM styles WHERE slug = 'contemporary';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000010', 'wainscoting', 'manual'),
  ('d0000000-0000-0000-0000-000000000010', 'contemporary', 'manual'),
  ('d0000000-0000-0000-0000-000000000010', 'flat panel', 'manual'),
  ('d0000000-0000-0000-0000-000000000010', 'modern', 'manual'),
  ('d0000000-0000-0000-0000-000000000010', 'wall paneling', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 11. RUSTIC CEILING MEDALLION
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000011',
  'a0000000-0000-0000-0000-000000000001',
  'Rustic Ceiling Medallion',
  'rustic-ceiling-medallion',
  'Rough-hewn rustic ceiling medallion celebrating natural wood grain and imperfection',
  'A charming rustic ceiling medallion featuring rough-hewn edges, natural wood grain, and organic forms. This design celebrates the beauty of imperfection and the warmth of natural materials, with its handcrafted appearance adding character to any space. Perfect for cabins, farmhouses, or homes seeking an authentic rustic feel.',
  true,
  '/images/placeholder-medallion.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000011', id FROM categories WHERE slug = 'ceiling-medallions';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000011', id FROM styles WHERE slug = 'rustic';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000011', 'ceiling medallion', 'manual'),
  ('d0000000-0000-0000-0000-000000000011', 'rustic', 'manual'),
  ('d0000000-0000-0000-0000-000000000011', 'wood grain', 'manual'),
  ('d0000000-0000-0000-0000-000000000011', 'organic', 'manual'),
  ('d0000000-0000-0000-0000-000000000011', 'light fixture', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 12. CLASSICAL COLUMN CAPITAL
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000012',
  'a0000000-0000-0000-0000-000000000001',
  'Classical Corinthian Column Capital',
  'classical-corinthian-capital',
  'Detailed Corinthian column capital with acanthus leaves and scrolls',
  'An exquisite Corinthian column capital featuring intricate acanthus leaves, volutes, and classical detailing. This design captures the essence of ancient Greek architecture with its elaborate ornamentation and perfect proportions. Ideal for columns, pilasters, or as a standalone decorative element.',
  true,
  '/images/placeholder-capital.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000012', id FROM categories WHERE slug = 'column-capitals';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000012', id FROM styles WHERE slug = 'greek-revival';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000012', 'column capital', 'manual'),
  ('d0000000-0000-0000-0000-000000000012', 'corinthian', 'manual'),
  ('d0000000-0000-0000-0000-000000000012', 'acanthus', 'manual'),
  ('d0000000-0000-0000-0000-000000000012', 'classical', 'manual'),
  ('d0000000-0000-0000-0000-000000000012', 'scroll', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 13. VICTORIAN BALUSTER
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000013',
  'a0000000-0000-0000-0000-000000000001',
  'Victorian Baluster',
  'victorian-baluster',
  'Turned Victorian baluster with spindle work and decorative knuckles',
  'An elegant turned Victorian baluster featuring spindle work, decorative knuckles, and a graceful profile. This design adds vertical interest and traditional charm to stair railings, with its intricate turning patterns creating beautiful shadow lines. Perfect for historic restoration or adding Victorian elegance to new construction.',
  true,
  '/images/placeholder-baluster.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000013', id FROM categories WHERE slug = 'balusters';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000013', id FROM styles WHERE slug = 'victorian';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000013', 'baluster', 'manual'),
  ('d0000000-0000-0000-0000-000000000013', 'victorian', 'manual'),
  ('d0000000-0000-0000-0000-000000000013', 'turned', 'manual'),
  ('d0000000-0000-0000-0000-000000000013', 'spindle', 'manual'),
  ('d0000000-0000-0000-0000-000000000013', 'stair', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 14. GEORGIAN HANDRAIL
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000014',
  'a0000000-0000-0000-0000-000000000001',
  'Georgian Handrail',
  'georgian-handrail',
  'Classically proportioned Georgian handrail with subtle curve and elegant profile',
  'A refined Georgian handrail featuring a subtle curve, elegant profile, and classical proportions. This design embodies the era''s emphasis on balance and harmony, with its smooth lines and restrained ornamentation. Perfect for historic restoration or creating a timeless staircase design.',
  true,
  '/images/placeholder-handrail.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000014', id FROM categories WHERE slug = 'handrails';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000014', id FROM styles WHERE slug = 'georgian';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000014', 'handrail', 'manual'),
  ('d0000000-0000-0000-0000-000000000014', 'georgian', 'manual'),
  ('d0000000-0000-0000-0000-000000000014', 'curved', 'manual'),
  ('d0000000-0000-0000-0000-000000000014', 'elegant', 'manual'),
  ('d0000000-0000-0000-0000-000000000014', 'stair', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 15. CRAFTSMAN STAIR SKIRT
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000015',
  'a0000000-0000-0000-0000-000000000001',
  'Craftsman Stair Skirt',
  'craftsman-stair-skirt',
  'Simple Craftsman stair skirt with clean lines and functional form',
  'A straightforward Craftsman stair skirt featuring clean lines, functional form, and minimal ornamentation. This design embodies the Arts and Crafts movement''s emphasis on honest construction and practical beauty, with its unadorned surface highlighting the quality of the materials. Perfect for historic restoration or modern interpretations.',
  true,
  '/images/placeholder-stair-skirt.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000015', id FROM categories WHERE slug = 'stair-skirts';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000015', id FROM styles WHERE slug = 'craftsman';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000015', 'stair skirt', 'manual'),
  ('d0000000-0000-0000-0000-000000000015', 'craftsman', 'manual'),
  ('d0000000-0000-0000-0000-000000000015', 'simple', 'manual'),
  ('d0000000-0000-0000-0000-000000000015', 'functional', 'manual'),
  ('d0000000-0000-0000-0000-000000000015', 'trim', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 16. FEDERAl FIREPLACE SURROUND
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000016',
  'a0000000-0000-0000-0000-000000000001',
  'Federal Fireplace Surround',
  'federal-fireplace-surround',
  'Refined Federal-style fireplace surround with egg-and-dart and swag motifs',
  'An elegant Federal-style fireplace surround featuring egg-and-dart molding, swag motifs, and classical proportions. This design captures the refined neoclassical aesthetic of the early American republic, with its balanced composition and delicate ornamentation. Perfect for historic restoration or adding classical elegance to modern homes.',
  true,
  '/images/placeholder-fireplace.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000016', id FROM categories WHERE slug = 'fireplace-surrounds';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000016', id FROM styles WHERE slug = 'federal';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000016', 'fireplace surround', 'manual'),
  ('d0000000-0000-0000-0000-000000000016', 'federal', 'manual'),
  ('d0000000-0000-0000-0000-000000000016', 'egg and dart', 'manual'),
  ('d0000000-0000-0000-0000-000000000016', 'swag', 'manual'),
  ('d0000000-0000-0000-0000-000000000016', 'mantel', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 17. VICTORIAN MANTEL SHELF
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000017',
  'a0000000-0000-0000-0000-000000000001',
  'Victorian Mantel Shelf',
  'victorian-mantel-shelf',
  'Ornate Victorian mantel shelf with carved floral motifs and heavy cornice',
  'A highly decorative Victorian mantel shelf featuring carved floral motifs, heavy cornice, and rich surface texture. This design exemplifies the Victorian era''s love of ornamentation and craftsmanship, with its intricate carving and dramatic profile making it a focal point in any room. Ideal for historic restoration or adding Victorian grandeur to modern spaces.',
  true,
  '/images/placeholder-mantel-shelf.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000017', id FROM categories WHERE slug = 'mantel-shelves';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000017', id FROM styles WHERE slug = 'victorian';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000017', 'mantel shelf', 'manual'),
  ('d0000000-0000-0000-0000-000000000017', 'victorian', 'manual'),
  ('d0000000-0000-0000-0000-000000000017', 'carved', 'manual'),
  ('d0000000-0000-0000-0000-000000000017', 'floral', 'manual'),
  ('d0000000-0000-0000-0000-000000000017', 'ornate', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 18. GEORGIAN PLINTH BLOCK
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000018',
  'a0000000-0000-0000-0000-000000000001',
  'Georgian Plinth Block',
  'georgian-plinth-block',
  'Classically inspired Georgian plinth block with torus and ogee moldings',
  'A refined Georgian plinth block featuring torus and ogee moldings, classical proportions, and elegant form. This design draws from classical architecture with its layered profiles and balanced composition, providing a solid foundation for door casings and adding visual weight to the space. Perfect for historic restoration or traditional interiors.',
  true,
  '/images/placeholder-plinth.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000018', id FROM categories WHERE slug = 'plinth-blocks';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000018', id FROM styles WHERE slug = 'georgian';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000018', 'plinth block', 'manual'),
  ('d0000000-0000-0000-0000-000000000018', 'georgian', 'manual'),
  ('d0000000-0000-0000-0000-000000000018', 'classical', 'manual'),
  ('d0000000-0000-0000-0000-000000000018', 'molding', 'manual'),
  ('d0000000-0000-0000-0000-000000000018', 'base', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 19. TUDOR WAINSCOTING PANEL
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000019',
  'a0000000-0000-0000-0000-000000000001',
  'Tudor Wainscoting Panel',
  'tudor-wainscoting-panel',
  'Heavy timber-inspired Tudor wainscoting panel with dark-stained wood',
  'A substantial Tudor-style wainscoting panel featuring heavy timber-inspired forms, dark-stained wood, and traditional joinery details. This design draws from medieval English architecture with its pronounced texture and rich surface. Ideal for creating a historic atmosphere in homes, pubs, or commercial spaces.',
  true,
  '/images/placeholder-tudor-panel.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000019', id FROM categories WHERE slug = 'wainscoting';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000019', id FROM styles WHERE slug = 'tudor';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000019', 'wainscoting', 'manual'),
  ('d0000000-0000-0000-0000-000000000019', 'tudor', 'manual'),
  ('d0000000-0000-0000-0000-000000000019', 'timber', 'manual'),
  ('d0000000-0000-0000-0000-000000000019', 'panel', 'manual'),
  ('d0000000-0000-0000-0000-000000000019', 'wall', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 20. MID-CENTURY MODERN PLINTH
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000020',
  'a0000000-0000-0000-0000-000000000001',
  'Mid-Century Modern Plinth',
  'mid-century-modern-plinth',
  'Clean-lined mid-century plinth with subtle profile and minimal projection',
  'A quintessential mid-century modern plinth featuring clean lines, subtle profiles, and minimal projection. This design embodies the era''s emphasis on simplicity and integration, with its understated form allowing the architecture and furniture to take center stage. Perfect for 1950s-1970s homes or contemporary interpretations.',
  true,
  '/images/placeholder-mcm-plinth.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000020', id FROM categories WHERE slug = 'plinth-blocks';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000020', id FROM styles WHERE slug = 'mid-century-modern';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000020', 'plinth', 'manual'),
  ('d0000000-0000-0000-0000-000000000020', 'mid-century modern', 'manual'),
  ('d0000000-0000-0000-0000-000000000020', 'clean lines', 'manual'),
  ('d0000000-0000-0000-0000-000000000020', 'minimal', 'manual'),
  ('d0000000-0000-0000-0000-000000000020', 'base', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 21. ART DECO CORBEL
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000021',
  'a0000000-0000-0000-0000-000000000001',
  'Art Deco Corbel',
  'art-deco-corbel',
  'Streamlined Art Deco corbel with geometric patterns and stepped forms',
  'A bold Art Deco corbel featuring geometric patterns, stepped forms, and streamlined aesthetics. This design captures the essence of 1920s-1930s design with its symmetrical composition and modernist flair. Perfect for fireplace mantels, cabinetry, or as a decorative support element in modern or historic homes.',
  true,
  '/images/placeholder-artdeco-corbel.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000021', id FROM categories WHERE slug = 'corbels-and-brackets';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000021', id FROM styles WHERE slug = 'art-deco';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000021', 'corbel', 'manual'),
  ('d0000000-0000-0000-0000-000000000021', 'art deco', 'manual'),
  ('d0000000-0000-0000-0000-000000000021', 'geometric', 'manual'),
  ('d0000000-0000-0000-0000-000000000021', 'stepped', 'manual'),
  ('d0000000-0000-0000-0000-000000000021', 'support', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 22. VICTORIAN DOOR CASING
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000022',
  'a0000000-0000-0000-0000-000000000001',
  'Victorian Door Casing',
  'victorian-door-casing',
  'Elaborate Victorian door casing with intricate scrollwork and floral details',
  'A highly ornate Victorian door casing featuring complex scrollwork, floral motifs, and layered profiles. This design exemplifies the decorative excess of the Victorian era with its rich detailing and dramatic shadow lines. Ideal for historic home restoration or adding a touch of old-world elegance to modern spaces.',
  true,
  '/images/placeholder-victorian-door.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000022', id FROM categories WHERE slug = 'door-casings';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000022', id FROM styles WHERE slug = 'victorian';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000022', 'door casing', 'manual'),
  ('d0000000-0000-0000-0000-000000000022', 'victorian', 'manual'),
  ('d0000000-0000-0000-0000-000000000022', 'ornate', 'manual'),
  ('d0000000-0000-0000-0000-000000000022', 'scrollwork', 'manual'),
  ('d0000000-0000-0000-0000-000000000022', 'floral', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 23. CRAFTSMAN WINDOW TRIM
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000023',
  'a0000000-0000-0000-0000-000000000001',
  'Craftsman Window Trim',
  'craftsman-window-trim',
  'Simple, clean-lined Craftsman window trim with flat profile and minimal detailing',
  'A quintessential Craftsman-style window trim featuring a clean, flat profile with subtle chamfers. This design emphasizes simplicity and handcrafted quality, embodying the Arts and Crafts movement principles of functional beauty. The minimal ornamentation allows the natural wood grain to take center stage.',
  true,
  '/images/placeholder-craftsman-window.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000023', id FROM categories WHERE slug = 'window-trim';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000023', id FROM styles WHERE slug = 'craftsman';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000023', 'window trim', 'manual'),
  ('d0000000-0000-0000-0000-000000000023', 'craftsman', 'manual'),
  ('d0000000-0000-0000-0000-000000000023', 'simple', 'manual'),
  ('d0000000-0000-0000-0000-000000000023', 'flat profile', 'manual'),
  ('d0000000-0000-0000-0000-000000000023', 'trim', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 24. GEORGIAN CROWN MOLDING
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000024',
  'a0000000-0000-0000-0000-000000000001',
  'Georgian Crown Molding',
  'georgian-crown-molding',
  'Classically proportioned Georgian crown molding with egg-and-dart and dentil molding',
  'A refined Georgian crown molding featuring classical proportions, egg-and-dart molding, and dentil details. This design draws from Greek and Roman architecture with its balanced composition and elegant profile. Perfect for historic restoration or adding classical elegance to modern interiors.',
  true,
  '/images/placeholder-georgian-crown.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000024', id FROM categories WHERE slug = 'crown-molding';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000024', id FROM styles WHERE slug = 'georgian';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000024', 'crown molding', 'manual'),
  ('d0000000-0000-0000-0000-000000000024', 'georgian', 'manual'),
  ('d0000000-0000-0000-0000-000000000024', 'classical', 'manual'),
  ('d0000000-0000-0000-0000-000000000024', 'egg and dart', 'manual'),
  ('d0000000-0000-0000-0000-000000000024', 'dentil', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- 25. CONTEMPORARY COLUMNS
-- ╁═══════════════════════════════════════════════════════════════════════════════

INSERT INTO designs (id, creator_id, title, slug, description, long_description, is_free, primary_image_url, status)
VALUES (
  'd0000000-0000-0000-0000-000000000025',
  'a0000000-0000-0000-0000-000000000001',
  'Contemporary Columns',
  'contemporary-columns',
  'Sleek contemporary columns with clean lines and minimalist capital design',
  'A set of sleek contemporary columns featuring clean lines, minimalist capitals, and a modern aesthetic. This design reflects current trends in architecture with its emphasis on simplicity, clean profiles, and integration with modern interiors. Perfect for creating architectural interest in modern homes, commercial spaces, or as decorative elements.',
  true,
  '/images/placeholder-columns.png',
  'published'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO design_categories (design_id, category_id)
SELECT 'd0000000-0000-0000-0000-000000000025', id FROM categories WHERE slug = 'columns-and-pilasters';

INSERT INTO design_styles (design_id, style_id)
SELECT 'd0000000-0000-0000-0000-000000000025', id FROM styles WHERE slug = 'contemporary';

INSERT INTO design_tags (design_id, tag_name, tag_type)
VALUES
  ('d0000000-0000-0000-0000-000000000025', 'columns', 'manual'),
  ('d0000000-0000-0000-0000-000000000025', 'contemporary', 'manual'),
  ('d0000000-0000-0000-0000-000000000025', 'clean lines', 'manual'),
  ('d0000000-0000-0000-0000-000000000025', 'minimalist', 'manual'),
  ('d0000000-0000-0000-0000-000000000025', 'architectural', 'manual');

-- ════════════════════════════════════════════════════════════════════════════════
-- END OF MIGRATION
-- ════════════════════════════════════════════════════════════════════════════════