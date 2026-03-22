-- ============================================================
-- MillworkDatabase.com — Row Level Security Policies
-- Migration 003: RLS for all tables
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

-- ============================================================
-- DESIGNS
-- ============================================================
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published designs"
  ON designs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Creators can view own designs (any status)"
  ON designs FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Authenticated users can create designs"
  ON designs FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update own designs"
  ON designs FOR UPDATE
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can delete own designs"
  ON designs FOR DELETE
  USING (creator_id = auth.uid());

-- ============================================================
-- CATEGORIES (read-only for all, admin writes via service role)
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

-- ============================================================
-- STYLES (read-only for all)
-- ============================================================
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view styles"
  ON styles FOR SELECT
  USING (true);

-- ============================================================
-- DESIGN CATEGORIES
-- ============================================================
ALTER TABLE design_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view design categories"
  ON design_categories FOR SELECT
  USING (true);

CREATE POLICY "Design creators can manage categories"
  ON design_categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

CREATE POLICY "Design creators can remove categories"
  ON design_categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

-- ============================================================
-- DESIGN STYLES
-- ============================================================
ALTER TABLE design_styles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view design styles"
  ON design_styles FOR SELECT
  USING (true);

CREATE POLICY "Design creators can manage styles"
  ON design_styles FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

CREATE POLICY "Design creators can remove styles"
  ON design_styles FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

-- ============================================================
-- DESIGN IMAGES
-- ============================================================
ALTER TABLE design_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view images of published designs"
  ON design_images FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND (status = 'published' OR creator_id = auth.uid()))
  );

CREATE POLICY "Design creators can manage images"
  ON design_images FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

CREATE POLICY "Design creators can update images"
  ON design_images FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

CREATE POLICY "Design creators can delete images"
  ON design_images FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

-- ============================================================
-- DESIGN FILES
-- ============================================================
ALTER TABLE design_files ENABLE ROW LEVEL SECURITY;

-- File metadata is visible for published designs (but actual download is controlled via API)
CREATE POLICY "Anyone can view file metadata for published designs"
  ON design_files FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND (status = 'published' OR creator_id = auth.uid()))
  );

CREATE POLICY "Design creators can manage files"
  ON design_files FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

CREATE POLICY "Design creators can delete files"
  ON design_files FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

-- ============================================================
-- DESIGN TAGS
-- ============================================================
ALTER TABLE design_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON design_tags FOR SELECT
  USING (true);

CREATE POLICY "Design creators can manage manual tags"
  ON design_tags FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

CREATE POLICY "Design creators can remove tags"
  ON design_tags FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND creator_id = auth.uid())
  );

-- ============================================================
-- FAVORITES
-- ============================================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove own favorites"
  ON favorites FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- COLLECTIONS
-- ============================================================
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public collections"
  ON collections FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users can create collections"
  ON collections FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  USING (creator_id = auth.uid());

-- ============================================================
-- COLLECTION DESIGNS
-- ============================================================
ALTER TABLE collection_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view designs in public collections"
  ON collection_designs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND (is_public = true OR creator_id = auth.uid()))
  );

CREATE POLICY "Collection owners can add designs"
  ON collection_designs FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND creator_id = auth.uid())
  );

CREATE POLICY "Collection owners can remove designs"
  ON collection_designs FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM collections WHERE id = collection_id AND creator_id = auth.uid())
  );

-- ============================================================
-- COMMENTS
-- ============================================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments on published designs"
  ON comments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM designs WHERE id = design_id AND status = 'published')
  );

CREATE POLICY "Authenticated users can comment"
  ON comments FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update own comments"
  ON comments FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete own comments"
  ON comments FOR DELETE
  USING (author_id = auth.uid());

-- ============================================================
-- DOWNLOADS
-- ============================================================
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own downloads"
  ON downloads FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can record downloads"
  ON downloads FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- PURCHASES
-- ============================================================
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (user_id = auth.uid());

-- Inserts handled by service role (Stripe webhook)

-- ============================================================
-- USER STATS
-- ============================================================
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user stats"
  ON user_stats FOR SELECT
  USING (true);

-- Updates handled by triggers (elevated privilege)

-- ============================================================
-- BADGES & USER BADGES
-- ============================================================
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  USING (true);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user badges"
  ON user_badges FOR SELECT
  USING (true);

-- ============================================================
-- CNC PROVIDERS
-- ============================================================
ALTER TABLE cnc_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active providers"
  ON cnc_providers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view own provider profile"
  ON cnc_providers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create provider profile"
  ON cnc_providers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own provider profile"
  ON cnc_providers FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- CNC REVIEWS
-- ============================================================
ALTER TABLE cnc_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON cnc_reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON cnc_reviews FOR INSERT
  WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Reviewers can update own reviews"
  ON cnc_reviews FOR UPDATE
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());
