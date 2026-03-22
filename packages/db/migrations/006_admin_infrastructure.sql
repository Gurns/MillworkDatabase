-- Add admin role and site_settings table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin'));
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS banned_reason TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;

-- Site settings (key-value store for admin-configurable content)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Admin audit log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- 'user', 'design', 'setting', etc.
  target_id VARCHAR(255),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_admin ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_created ON admin_audit_log(created_at DESC);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit log" ON admin_audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert audit log" ON admin_audit_log FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Update RLS: Admins can manage ALL users
CREATE POLICY "Admins can update any user" ON users FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Admins can view/edit/delete ALL designs regardless of status
CREATE POLICY "Admins can view all designs" ON designs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all designs" ON designs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete all designs" ON designs FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Admins can manage all images and files
CREATE POLICY "Admins can manage all images" ON design_images FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage all files" ON design_files FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Admins can manage categories and styles (currently read-only for all)
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage styles" ON styles FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Default site settings
INSERT INTO site_settings (key, value, description) VALUES
  ('homepage_hero_title', '"Architectural Millwork, Shared by the Community"', 'Hero section main heading'),
  ('homepage_hero_subtitle', '"Browse thousands of millwork profiles — crown molding, baseboards, door casings, stair parts, mantels, and more."', 'Hero section subtitle'),
  ('homepage_cta_text', '"Share your millwork designs with the world"', 'Call-to-action section heading'),
  ('featured_design_ids', '[]', 'Array of design IDs to feature on homepage'),
  ('sort_default', '"newest"', 'Default sort order for browse page (newest, popular, trending)'),
  ('items_per_page', '24', 'Number of items per page in browse views'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('maintenance_message', '"We are performing scheduled maintenance. Please check back soon."', 'Message shown during maintenance'),
  ('announcement_banner', 'null', 'Announcement banner text (null = hidden)'),
  ('announcement_banner_type', '"info"', 'Banner type: info, warning, success')
ON CONFLICT (key) DO NOTHING;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM users WHERE id = p_user_id AND role = 'admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Admin stats function
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_designs BIGINT,
  published_designs BIGINT,
  draft_designs BIGINT,
  total_downloads BIGINT,
  total_favorites BIGINT,
  total_comments BIGINT,
  users_this_week BIGINT,
  designs_this_week BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM users)::BIGINT,
    (SELECT COUNT(*) FROM designs)::BIGINT,
    (SELECT COUNT(*) FROM designs WHERE status = 'published')::BIGINT,
    (SELECT COUNT(*) FROM designs WHERE status = 'draft')::BIGINT,
    (SELECT COUNT(*) FROM downloads)::BIGINT,
    (SELECT COUNT(*) FROM favorites)::BIGINT,
    (SELECT COUNT(*) FROM comments)::BIGINT,
    (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days')::BIGINT,
    (SELECT COUNT(*) FROM designs WHERE created_at > NOW() - INTERVAL '7 days')::BIGINT;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
