-- ============================================================
-- MillworkDatabase.com — Initial Schema
-- Migration 001: Core tables, types, and relationships
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE design_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE file_type AS ENUM ('stl', 'step', 'obj', 'ply', 'f3d', 'fusion360', 'other');

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url VARCHAR(500),
  is_cnc_provider BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);

-- ============================================================
-- CATEGORIES (hierarchical)
-- ============================================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon_name VARCHAR(50),
  parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_category_id);

-- ============================================================
-- STYLES (architectural styles)
-- ============================================================

CREATE TABLE public.styles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_styles_slug ON styles(slug);

-- ============================================================
-- DESIGNS (core resource)
-- ============================================================

CREATE TABLE public.designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(250) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,

  -- Pricing (deferred — all free initially)
  is_free BOOLEAN DEFAULT TRUE,
  price_cents INTEGER CHECK (price_cents IS NULL OR price_cents >= 100),

  -- Dimensions & metadata
  dimensions_json JSONB,
  material VARCHAR(100),
  difficulty_level difficulty_level,
  estimated_build_hours INTEGER,

  -- Primary image (denormalized for gallery performance)
  primary_image_url VARCHAR(500),

  -- Remix tracking
  is_remix BOOLEAN DEFAULT FALSE,
  forked_from_id UUID REFERENCES designs(id) ON DELETE SET NULL,

  -- Denormalized counters (updated via triggers)
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,

  -- Status & publish
  status design_status DEFAULT 'draft',
  published_at TIMESTAMPTZ,

  -- Full-text search vector
  search_vector TSVECTOR,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_designs_creator_id ON designs(creator_id);
CREATE INDEX idx_designs_status ON designs(status);
CREATE INDEX idx_designs_published_at ON designs(published_at DESC NULLS LAST);
CREATE INDEX idx_designs_view_count ON designs(view_count DESC);
CREATE INDEX idx_designs_download_count ON designs(download_count DESC);
CREATE INDEX idx_designs_favorite_count ON designs(favorite_count DESC);
CREATE INDEX idx_designs_is_free ON designs(is_free);
CREATE INDEX idx_designs_slug ON designs(slug);
CREATE INDEX idx_designs_forked_from ON designs(forked_from_id) WHERE forked_from_id IS NOT NULL;
CREATE INDEX idx_designs_search_vector ON designs USING gin(search_vector);
CREATE INDEX idx_designs_title_trgm ON designs USING gin(title gin_trgm_ops);

-- ============================================================
-- DESIGN ↔ CATEGORY junction
-- ============================================================

CREATE TABLE public.design_categories (
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (design_id, category_id)
);

CREATE INDEX idx_design_categories_category ON design_categories(category_id);

-- ============================================================
-- DESIGN ↔ STYLE junction
-- ============================================================

CREATE TABLE public.design_styles (
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  style_id UUID NOT NULL REFERENCES styles(id) ON DELETE CASCADE,
  PRIMARY KEY (design_id, style_id)
);

CREATE INDEX idx_design_styles_style ON design_styles(style_id);

-- ============================================================
-- DESIGN IMAGES
-- ============================================================

CREATE TABLE public.design_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_design_images_design ON design_images(design_id);

-- ============================================================
-- DESIGN FILES (3D models, CAD files)
-- ============================================================

CREATE TABLE public.design_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type file_type NOT NULL,
  file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_design_files_design ON design_files(design_id);

-- ============================================================
-- DESIGN TAGS (auto-generated and manual)
-- ============================================================

CREATE TABLE public.design_tags (
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  tag_name VARCHAR(100) NOT NULL,
  tag_type VARCHAR(10) DEFAULT 'manual' CHECK (tag_type IN ('auto', 'manual')),
  confidence DECIMAL(3,2),
  PRIMARY KEY (design_id, tag_name)
);

CREATE INDEX idx_design_tags_name ON design_tags(tag_name);

-- ============================================================
-- FAVORITES
-- ============================================================

CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, design_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_design ON favorites(design_id);

-- ============================================================
-- COLLECTIONS
-- ============================================================

CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  design_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collections_creator ON collections(creator_id);

-- ============================================================
-- COLLECTION ↔ DESIGN junction
-- ============================================================

CREATE TABLE public.collection_designs (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, design_id)
);

-- ============================================================
-- COMMENTS (threaded)
-- ============================================================

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 5000),
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_design ON comments(design_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;

-- ============================================================
-- DOWNLOADS (tracking)
-- ============================================================

CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  file_type VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_downloads_design ON downloads(design_id);
CREATE INDEX idx_downloads_user ON downloads(user_id);

-- ============================================================
-- PURCHASES (deferred — for paid designs)
-- ============================================================

CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount_cents INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, design_id)
);

CREATE INDEX idx_purchases_user ON purchases(user_id);

-- ============================================================
-- GAMIFICATION: User Stats
-- ============================================================

CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  designs_created INTEGER DEFAULT 0,
  total_downloads_received INTEGER DEFAULT 0,
  favorites_received INTEGER DEFAULT 0,
  comments_made INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GAMIFICATION: Badges
-- ============================================================

CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  criteria_type VARCHAR(50) NOT NULL,
  criteria_threshold INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.user_badges (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- ============================================================
-- CNC PROVIDERS
-- ============================================================

CREATE TABLE public.cnc_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(200) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  website_url VARCHAR(500),
  contact_email VARCHAR(255),
  capabilities JSONB,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cnc_providers_user ON cnc_providers(user_id);
CREATE INDEX idx_cnc_providers_active ON cnc_providers(is_active) WHERE is_active = TRUE;

-- ============================================================
-- CNC REVIEWS
-- ============================================================

CREATE TABLE public.cnc_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES cnc_providers(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cnc_reviews_provider ON cnc_reviews(provider_id);
