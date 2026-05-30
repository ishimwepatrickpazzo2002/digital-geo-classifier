/*
  # Digital Geo Classifier Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `created_at` (timestamptz)
    - `soil_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `sample_name` (text)
      - `percent_passing_200` (numeric)
      - `percent_passing_4` (numeric)
      - `liquid_limit` (numeric)
      - `plastic_limit` (numeric)
      - `plasticity_index` (numeric, computed)
      - `soil_class` (text)
      - `soil_description` (text)
      - `plasticity_level` (text)
      - `confidence` (numeric)
      - `treatment` (text)
      - `notes` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS soil_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  sample_name text NOT NULL DEFAULT 'Unnamed Sample',
  percent_passing_200 numeric NOT NULL,
  percent_passing_4 numeric NOT NULL,
  liquid_limit numeric,
  plastic_limit numeric,
  plasticity_index numeric,
  soil_class text NOT NULL DEFAULT '',
  soil_description text NOT NULL DEFAULT '',
  plasticity_level text NOT NULL DEFAULT '',
  confidence numeric NOT NULL DEFAULT 0,
  treatment text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE soil_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses"
  ON soil_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON soil_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON soil_analyses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON soil_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
