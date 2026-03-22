-- ============================================================================
-- Migration 005: Recommendation Engine Functions
-- Provides "similar designs" and "trending/popular" suggestions
-- ============================================================================

-- 1. Function: Get similar designs based on shared tags, categories, and styles
-- Used on individual design pages ("You might also like")
CREATE OR REPLACE FUNCTION get_similar_designs(
  p_design_id UUID,
  p_limit INT DEFAULT 8
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  description TEXT,
  creator_id UUID,
  creator_username VARCHAR,
  creator_display_name VARCHAR,
  thumbnail_url TEXT,
  view_count INT,
  download_count INT,
  favorite_count INT,
  is_free BOOLEAN,
  price INT,
  published_at TIMESTAMPTZ,
  similarity_score BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH source_tags AS (
    SELECT tag_name FROM design_tags WHERE design_id = p_design_id
  ),
  source_categories AS (
    SELECT category_id FROM design_categories WHERE design_id = p_design_id
  ),
  source_styles AS (
    SELECT style_id FROM design_styles WHERE design_id = p_design_id
  ),
  scored AS (
    SELECT
      d.id,
      -- 3 points per shared tag, 5 per shared category, 4 per shared style
      COALESCE(tag_matches.cnt, 0) * 3 +
      COALESCE(cat_matches.cnt, 0) * 5 +
      COALESCE(style_matches.cnt, 0) * 4 AS score
    FROM designs d
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INT AS cnt
      FROM design_tags dt
      WHERE dt.design_id = d.id AND dt.tag_name IN (SELECT tag_name FROM source_tags)
    ) tag_matches ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INT AS cnt
      FROM design_categories dc
      WHERE dc.design_id = d.id AND dc.category_id IN (SELECT category_id FROM source_categories)
    ) cat_matches ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::INT AS cnt
      FROM design_styles ds
      WHERE ds.design_id = d.id AND ds.style_id IN (SELECT style_id FROM source_styles)
    ) style_matches ON true
    WHERE d.id != p_design_id
      AND d.status = 'published'
  )
  SELECT
    d.id,
    d.title,
    d.slug,
    d.description,
    d.creator_id,
    u.username AS creator_username,
    u.display_name AS creator_display_name,
    COALESCE(di.thumbnail_url, di.image_url) AS thumbnail_url,
    d.view_count,
    d.download_count,
    d.favorite_count,
    d.is_free,
    d.price_cents AS price,
    d.published_at,
    s.score AS similarity_score
  FROM scored s
  JOIN designs d ON d.id = s.id
  JOIN users u ON u.id = d.creator_id
  LEFT JOIN LATERAL (
    SELECT dim.thumbnail_url, dim.image_url
    FROM design_images dim
    WHERE dim.design_id = d.id
    ORDER BY dim.display_order ASC
    LIMIT 1
  ) di ON true
  WHERE s.score > 0
  ORDER BY s.score DESC, d.favorite_count DESC, d.download_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;


-- 2. Function: Get trending designs (popular in last 30 days)
-- Weighted by recent downloads, favorites, and views
CREATE OR REPLACE FUNCTION get_trending_designs(
  p_limit INT DEFAULT 12,
  p_days INT DEFAULT 30
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  description TEXT,
  creator_id UUID,
  creator_username VARCHAR,
  creator_display_name VARCHAR,
  thumbnail_url TEXT,
  view_count INT,
  download_count INT,
  favorite_count INT,
  is_free BOOLEAN,
  price INT,
  published_at TIMESTAMPTZ,
  trending_score BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH recent_downloads AS (
    SELECT design_id, COUNT(*) AS cnt
    FROM downloads
    WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
    GROUP BY design_id
  ),
  recent_favorites AS (
    SELECT design_id, COUNT(*) AS cnt
    FROM favorites
    WHERE created_at > NOW() - (p_days || ' days')::INTERVAL
    GROUP BY design_id
  ),
  scored AS (
    SELECT
      d.id,
      -- Downloads worth 3 points, favorites worth 5, base views worth 1
      COALESCE(rd.cnt, 0) * 3 +
      COALESCE(rf.cnt, 0) * 5 +
      d.view_count AS score
    FROM designs d
    LEFT JOIN recent_downloads rd ON rd.design_id = d.id
    LEFT JOIN recent_favorites rf ON rf.design_id = d.id
    WHERE d.status = 'published'
  )
  SELECT
    d.id,
    d.title,
    d.slug,
    d.description,
    d.creator_id,
    u.username AS creator_username,
    u.display_name AS creator_display_name,
    COALESCE(di.thumbnail_url, di.image_url) AS thumbnail_url,
    d.view_count,
    d.download_count,
    d.favorite_count,
    d.is_free,
    d.price_cents AS price,
    d.published_at,
    s.score AS trending_score
  FROM scored s
  JOIN designs d ON d.id = s.id
  JOIN users u ON u.id = d.creator_id
  LEFT JOIN LATERAL (
    SELECT dim.thumbnail_url, dim.image_url
    FROM design_images dim
    WHERE dim.design_id = d.id
    ORDER BY dim.display_order ASC
    LIMIT 1
  ) di ON true
  WHERE s.score > 0
  ORDER BY s.score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;


-- 3. Function: Get personalized suggestions based on user's favorites and downloads
-- "Because you liked X" — finds designs similar to what user has engaged with
CREATE OR REPLACE FUNCTION get_personalized_suggestions(
  p_user_id UUID,
  p_limit INT DEFAULT 12
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  description TEXT,
  creator_id UUID,
  creator_username VARCHAR,
  creator_display_name VARCHAR,
  thumbnail_url TEXT,
  view_count INT,
  download_count INT,
  favorite_count INT,
  is_free BOOLEAN,
  price INT,
  published_at TIMESTAMPTZ,
  relevance_score BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_engaged AS (
    -- Designs the user has favorited or downloaded
    SELECT DISTINCT design_id FROM favorites WHERE user_id = p_user_id
    UNION
    SELECT DISTINCT design_id FROM downloads WHERE user_id = p_user_id
  ),
  user_tags AS (
    -- Tags from designs the user has engaged with
    SELECT tag_name, COUNT(*) AS weight
    FROM design_tags dt
    JOIN user_engaged ue ON ue.design_id = dt.design_id
    GROUP BY tag_name
  ),
  user_categories AS (
    SELECT category_id, COUNT(*) AS weight
    FROM design_categories dc
    JOIN user_engaged ue ON ue.design_id = dc.design_id
    GROUP BY category_id
  ),
  user_styles AS (
    SELECT style_id, COUNT(*) AS weight
    FROM design_styles ds
    JOIN user_engaged ue ON ue.design_id = ds.design_id
    GROUP BY style_id
  ),
  scored AS (
    SELECT
      d.id,
      COALESCE(SUM(ut.weight), 0) * 3 +
      COALESCE(SUM(uc.weight), 0) * 5 +
      COALESCE(SUM(us.weight), 0) * 4 AS score
    FROM designs d
    LEFT JOIN design_tags dt ON dt.design_id = d.id
    LEFT JOIN user_tags ut ON ut.tag_name = dt.tag_name
    LEFT JOIN design_categories dc ON dc.design_id = d.id
    LEFT JOIN user_categories uc ON uc.category_id = dc.category_id
    LEFT JOIN design_styles ds ON ds.design_id = d.id
    LEFT JOIN user_styles us ON us.style_id = ds.style_id
    WHERE d.status = 'published'
      AND d.id NOT IN (SELECT design_id FROM user_engaged)
      AND d.creator_id != p_user_id
    GROUP BY d.id
  )
  SELECT
    d.id,
    d.title,
    d.slug,
    d.description,
    d.creator_id,
    u.username AS creator_username,
    u.display_name AS creator_display_name,
    COALESCE(di.thumbnail_url, di.image_url) AS thumbnail_url,
    d.view_count,
    d.download_count,
    d.favorite_count,
    d.is_free,
    d.price_cents AS price,
    d.published_at,
    s.score AS relevance_score
  FROM scored s
  JOIN designs d ON d.id = s.id
  JOIN users u ON u.id = d.creator_id
  LEFT JOIN LATERAL (
    SELECT dim.thumbnail_url, dim.image_url
    FROM design_images dim
    WHERE dim.design_id = d.id
    ORDER BY dim.display_order ASC
    LIMIT 1
  ) di ON true
  WHERE s.score > 0
  ORDER BY s.score DESC, d.favorite_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;


-- 4. Function: Get popular designs by category (for homepage sections)
CREATE OR REPLACE FUNCTION get_popular_by_category(
  p_category_slug VARCHAR,
  p_limit INT DEFAULT 8
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  slug VARCHAR,
  description TEXT,
  creator_id UUID,
  creator_username VARCHAR,
  creator_display_name VARCHAR,
  thumbnail_url TEXT,
  view_count INT,
  download_count INT,
  favorite_count INT,
  is_free BOOLEAN,
  price INT,
  published_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.title,
    d.slug,
    d.description,
    d.creator_id,
    u.username AS creator_username,
    u.display_name AS creator_display_name,
    COALESCE(di.thumbnail_url, di.image_url) AS thumbnail_url,
    d.view_count,
    d.download_count,
    d.favorite_count,
    d.is_free,
    d.price_cents AS price,
    d.published_at
  FROM designs d
  JOIN users u ON u.id = d.creator_id
  JOIN design_categories dc ON dc.design_id = d.id
  JOIN categories c ON c.id = dc.category_id
  LEFT JOIN LATERAL (
    SELECT dim.thumbnail_url, dim.image_url
    FROM design_images dim
    WHERE dim.design_id = d.id
    ORDER BY dim.display_order ASC
    LIMIT 1
  ) di ON true
  WHERE d.status = 'published'
    AND (c.slug = p_category_slug OR c.parent_category_id = (
      SELECT cat.id FROM categories cat WHERE cat.slug = p_category_slug LIMIT 1
    ))
  ORDER BY d.favorite_count DESC, d.download_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;


-- 5. Add performance indexes for recommendations
CREATE INDEX IF NOT EXISTS idx_downloads_created_at ON downloads(created_at);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at);
CREATE INDEX IF NOT EXISTS idx_favorites_design_created ON favorites(design_id, created_at);
CREATE INDEX IF NOT EXISTS idx_downloads_design_created ON downloads(design_id, created_at);
CREATE INDEX IF NOT EXISTS idx_design_tags_tag_name ON design_tags(tag_name);
CREATE INDEX IF NOT EXISTS idx_designs_status_favorite ON designs(status, favorite_count DESC);
CREATE INDEX IF NOT EXISTS idx_designs_status_download ON designs(status, download_count DESC);
CREATE INDEX IF NOT EXISTS idx_design_images_display_order ON design_images(design_id, display_order ASC);
