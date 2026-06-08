CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS soil_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sample_name TEXT NOT NULL,
  sieve_no_200 NUMERIC(5, 2) NOT NULL,
  sieve_no_4 NUMERIC(5, 2) NOT NULL,
  liquid_limit NUMERIC(5, 2) NOT NULL,
  plastic_limit NUMERIC(5, 2) NOT NULL,
  plasticity_index NUMERIC(5, 2) NOT NULL,
  soil_classification TEXT NOT NULL,
  treatment_recommendation TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_soil_reports_user_id ON soil_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_soil_reports_created_at ON soil_reports(created_at DESC);
