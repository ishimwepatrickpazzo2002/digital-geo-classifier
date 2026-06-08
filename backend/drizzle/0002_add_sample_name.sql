ALTER TABLE soil_reports
ADD COLUMN IF NOT EXISTS sample_name TEXT NOT NULL DEFAULT 'Unnamed Sample';
