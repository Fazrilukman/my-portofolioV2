-- SQL untuk membuat tabel profile_settings di Supabase

-- 1. Buat tabel profile_settings
CREATE TABLE IF NOT EXISTS profile_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  photo_url TEXT DEFAULT '/Photo.jpg',
  title TEXT DEFAULT 'Frontend Developer',
  subtitle TEXT DEFAULT 'Network & Telecom Student',
  tech_stack TEXT[] DEFAULT ARRAY['React', 'Javascript', 'Node.js', 'Tailwind'],
  github_url TEXT DEFAULT 'https://github.com/Fazrilukman',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/fazrilukman/',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/fazrilukman_/?hl=id',
  name TEXT DEFAULT 'Fazri Lukman Nurrohman',
  description TEXT DEFAULT 'Seorang lulusan Teknik Jaringan Komputer dan Telekomunikasi yang memiliki ketertarikan besar dalam pengembangan Front-End.',
  cv_link TEXT DEFAULT 'https://drive.google.com/drive/folders/1BOm51Grsabb3zj6Xk27K-iRwI1zITcpo',
  linkedin_connect TEXT DEFAULT 'https://www.linkedin.com/in/fazrilukman/',
  instagram_connect TEXT DEFAULT 'https://www.instagram.com/fazrilukman_/?hl=id',
  youtube_connect TEXT DEFAULT 'https://www.youtube.com/@fazrilukman',
  github_connect TEXT DEFAULT 'https://github.com/Fazrilukman',
  tiktok_connect TEXT DEFAULT 'https://www.tiktok.com/@fazrilukman',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row_check CHECK (id = 1)
);

-- 2. Insert data default (hanya 1 row)
INSERT INTO profile_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS (Row Level Security)
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

-- 4. Buat policy untuk SELECT (public bisa read)
CREATE POLICY "Allow public read access to profile_settings"
ON profile_settings
FOR SELECT
TO public
USING (true);

-- 5. Buat policy untuk UPDATE (admin bisa update)
CREATE POLICY "Allow public update access to profile_settings"
ON profile_settings
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 6. Buat policy untuk INSERT (jika diperlukan)
CREATE POLICY "Allow public insert access to profile_settings"
ON profile_settings
FOR INSERT
TO public
WITH CHECK (id = 1);

-- 7. Buat function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_profile_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Buat trigger untuk auto-update updated_at
CREATE TRIGGER profile_settings_updated_at
BEFORE UPDATE ON profile_settings
FOR EACH ROW
EXECUTE FUNCTION update_profile_settings_updated_at();
