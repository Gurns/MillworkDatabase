-- ============================================================
-- MillworkDatabase.com — Supabase Storage Buckets
-- Migration 004: Storage configuration
-- Run via Supabase dashboard or CLI
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('design-images', 'design-images', true, 10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  ),
  ('design-models', 'design-models', false, 52428800, -- 50MB
    NULL -- Allow all file types for 3D models
  ),
  ('user-avatars', 'user-avatars', true, 5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  );

-- ============================================================
-- STORAGE POLICIES: design-images (public bucket)
-- ============================================================

CREATE POLICY "Anyone can view design images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'design-images');

CREATE POLICY "Authenticated users can upload design images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'design-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own design images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'design-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own design images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'design-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- STORAGE POLICIES: design-models (private bucket)
-- ============================================================

CREATE POLICY "Authenticated users can upload models"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'design-models'
    AND auth.role() = 'authenticated'
  );

-- Download access controlled via signed URLs in API routes
-- (service role generates signed URLs for authorized users)

CREATE POLICY "Users can manage own model files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'design-models'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- STORAGE POLICIES: user-avatars (public bucket)
-- ============================================================

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
