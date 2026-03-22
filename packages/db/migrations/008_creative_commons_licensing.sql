-- Migration 008: Add Creative Commons licensing to designs
-- Adds license_type column to designs table for CC license selection

-- Create enum for CC license types
DO $$ BEGIN
  CREATE TYPE cc_license_type AS ENUM (
    'CC0',
    'CC-BY-4.0',
    'CC-BY-SA-4.0',
    'CC-BY-NC-4.0',
    'CC-BY-NC-SA-4.0',
    'CC-BY-ND-4.0',
    'CC-BY-NC-ND-4.0'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add license columns to designs table
ALTER TABLE designs
  ADD COLUMN IF NOT EXISTS license_type cc_license_type DEFAULT 'CC-BY-4.0',
  ADD COLUMN IF NOT EXISTS license_url VARCHAR(255);

-- Set default license URL based on license_type for existing rows
UPDATE designs SET
  license_url = CASE license_type
    WHEN 'CC0' THEN 'https://creativecommons.org/publicdomain/zero/1.0/'
    WHEN 'CC-BY-4.0' THEN 'https://creativecommons.org/licenses/by/4.0/'
    WHEN 'CC-BY-SA-4.0' THEN 'https://creativecommons.org/licenses/by-sa/4.0/'
    WHEN 'CC-BY-NC-4.0' THEN 'https://creativecommons.org/licenses/by-nc/4.0/'
    WHEN 'CC-BY-NC-SA-4.0' THEN 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
    WHEN 'CC-BY-ND-4.0' THEN 'https://creativecommons.org/licenses/by-nd/4.0/'
    WHEN 'CC-BY-NC-ND-4.0' THEN 'https://creativecommons.org/licenses/by-nc-nd/4.0/'
  END
WHERE license_url IS NULL;

-- Add comment
COMMENT ON COLUMN designs.license_type IS 'Creative Commons license type selected by the creator';
COMMENT ON COLUMN designs.license_url IS 'URL to the full Creative Commons license deed';

-- Create index for filtering by license type
CREATE INDEX IF NOT EXISTS idx_designs_license_type ON designs(license_type);
