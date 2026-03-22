-- ============================================================
-- MillworkDatabase.com — Functions & Triggers
-- Migration 002: Auto-update timestamps, search vectors,
--                counters, and gamification triggers
-- ============================================================

-- ============================================================
-- UTILITY: updated_at timestamp trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_designs_updated_at
  BEFORE UPDATE ON designs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_collections_updated_at
  BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_cnc_providers_updated_at
  BEFORE UPDATE ON cnc_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SEARCH: Full-text search vector
-- ============================================================

CREATE OR REPLACE FUNCTION update_design_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.material, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.long_description, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_designs_search_vector
  BEFORE INSERT OR UPDATE OF title, description, long_description, material
  ON designs FOR EACH ROW EXECUTE FUNCTION update_design_search_vector();

-- ============================================================
-- COUNTERS: Favorite count on designs
-- ============================================================

CREATE OR REPLACE FUNCTION update_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE designs SET favorite_count = favorite_count + 1 WHERE id = NEW.design_id;
    -- Award points to design creator
    UPDATE user_stats SET
      favorites_received = favorites_received + 1,
      total_points = total_points + 5
    WHERE user_id = (SELECT creator_id FROM designs WHERE id = NEW.design_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE designs SET favorite_count = GREATEST(favorite_count - 1, 0) WHERE id = OLD.design_id;
    UPDATE user_stats SET
      favorites_received = GREATEST(favorites_received - 1, 0),
      total_points = GREATEST(total_points - 5, 0)
    WHERE user_id = (SELECT creator_id FROM designs WHERE id = OLD.design_id);
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_favorites_count
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW EXECUTE FUNCTION update_favorite_count();

-- ============================================================
-- COUNTERS: Comment count on designs
-- ============================================================

CREATE OR REPLACE FUNCTION update_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE designs SET comment_count = comment_count + 1 WHERE id = NEW.design_id;
    -- Award points to design creator (only if commenter is not the creator)
    UPDATE user_stats SET
      total_points = total_points + 2
    WHERE user_id = (SELECT creator_id FROM designs WHERE id = NEW.design_id)
      AND user_id != NEW.author_id;
    -- Track commenter stats
    UPDATE user_stats SET comments_made = comments_made + 1 WHERE user_id = NEW.author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE designs SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.design_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comments_count
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comment_count();

-- ============================================================
-- COUNTERS: Download count on designs + points
-- ============================================================

CREATE OR REPLACE FUNCTION update_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE designs SET download_count = download_count + 1 WHERE id = NEW.design_id;
  -- Award points to design creator
  UPDATE user_stats SET
    total_downloads_received = total_downloads_received + 1,
    total_points = total_points + 10
  WHERE user_id = (SELECT creator_id FROM designs WHERE id = NEW.design_id)
    AND user_id != NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_downloads_count
  AFTER INSERT ON downloads
  FOR EACH ROW EXECUTE FUNCTION update_download_count();

-- ============================================================
-- COUNTERS: Collection design count
-- ============================================================

CREATE OR REPLACE FUNCTION update_collection_design_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE collections SET design_count = design_count + 1 WHERE id = NEW.collection_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE collections SET design_count = GREATEST(design_count - 1, 0) WHERE id = OLD.collection_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_collection_designs_count
  AFTER INSERT OR DELETE ON collection_designs
  FOR EACH ROW EXECUTE FUNCTION update_collection_design_count();

-- ============================================================
-- USER CREATION: Auto-create user_stats when user is created
-- ============================================================

CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_create_stats
  AFTER INSERT ON users
  FOR EACH ROW EXECUTE FUNCTION create_user_stats();

-- ============================================================
-- GAMIFICATION: Award design creation points
-- ============================================================

CREATE OR REPLACE FUNCTION award_design_creation_points()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published') THEN
    UPDATE user_stats SET
      designs_created = designs_created + 1,
      total_points = total_points + 50
    WHERE user_id = NEW.creator_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_designs_publish_points
  AFTER INSERT OR UPDATE OF status ON designs
  FOR EACH ROW EXECUTE FUNCTION award_design_creation_points();

-- ============================================================
-- GAMIFICATION: Level calculation
-- ============================================================

CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := CASE
    WHEN NEW.total_points >= 15000 THEN 6
    WHEN NEW.total_points >= 5000 THEN 5
    WHEN NEW.total_points >= 1500 THEN 4
    WHEN NEW.total_points >= 500 THEN 3
    WHEN NEW.total_points >= 100 THEN 2
    ELSE 1
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_stats_level
  BEFORE UPDATE OF total_points ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_user_level();

-- ============================================================
-- CNC REVIEWS: Update provider average rating
-- ============================================================

CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cnc_providers SET
    average_rating = (
      SELECT COALESCE(AVG(rating), 0) FROM cnc_reviews WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    ),
    total_reviews = (
      SELECT COUNT(*) FROM cnc_reviews WHERE provider_id = COALESCE(NEW.provider_id, OLD.provider_id)
    )
  WHERE id = COALESCE(NEW.provider_id, OLD.provider_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cnc_reviews_rating
  AFTER INSERT OR UPDATE OR DELETE ON cnc_reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

-- ============================================================
-- AUTO-TAGGING: Basic rule-based auto-tagging on design creation
-- (Extracts keywords from title/description for tag suggestions)
-- ============================================================

CREATE OR REPLACE FUNCTION auto_tag_design()
RETURNS TRIGGER AS $$
DECLARE
  title_lower TEXT;
  tag_pairs TEXT[][] := ARRAY[
    ARRAY['crown', 'crown-molding'],
    ARRAY['baseboard', 'baseboard'],
    ARRAY['casing', 'door-casing'],
    ARRAY['window trim', 'window-trim'],
    ARRAY['newel', 'newel-post'],
    ARRAY['baluster', 'baluster'],
    ARRAY['handrail', 'handrail'],
    ARRAY['mantel', 'mantel'],
    ARRAY['fireplace', 'fireplace'],
    ARRAY['wainscot', 'wainscoting'],
    ARRAY['panel', 'paneling'],
    ARRAY['shelf', 'shelving'],
    ARRAY['door', 'door'],
    ARRAY['rosette', 'rosette'],
    ARRAY['corbel', 'corbel'],
    ARRAY['bracket', 'bracket'],
    ARRAY['plinth', 'plinth-block'],
    ARRAY['architrave', 'architrave'],
    ARRAY['frieze', 'frieze'],
    ARRAY['dentil', 'dentil'],
    ARRAY['egg and dart', 'egg-and-dart'],
    ARRAY['flute', 'fluted'],
    ARRAY['reed', 'reeded'],
    ARRAY['bead', 'beaded']
  ];
  pair TEXT[];
BEGIN
  title_lower := LOWER(COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.description, ''));

  FOREACH pair SLICE 1 IN ARRAY tag_pairs
  LOOP
    IF title_lower LIKE '%' || pair[1] || '%' THEN
      INSERT INTO design_tags (design_id, tag_name, tag_type, confidence)
      VALUES (NEW.id, pair[2], 'auto', 0.80)
      ON CONFLICT (design_id, tag_name) DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_designs_auto_tag
  AFTER INSERT OR UPDATE OF title, description ON designs
  FOR EACH ROW EXECUTE FUNCTION auto_tag_design();
