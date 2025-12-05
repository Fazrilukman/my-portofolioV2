-- SQL UPDATED untuk profile_settings dengan default values yang benar
-- Jalankan ini di Supabase SQL Editor

-- 1. Drop table lama jika ingin reset (HATI-HATI: ini akan hapus semua data!)
-- DROP TABLE IF EXISTS profile_settings CASCADE;

-- 2. Buat tabel profile_settings dengan default values yang sudah diperbaiki
CREATE TABLE IF NOT EXISTS profile_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  photo_url TEXT DEFAULT '/Photo.jpg',
  title TEXT DEFAULT 'Frontend Developer',
  subtitle TEXT DEFAULT 'Web Developer|Design|Video & Photo Editing|UI/UX Design',
  tech_stack TEXT[] DEFAULT ARRAY['React', 'Javascript', 'Node.js', 'Tailwind'],
  github_url TEXT DEFAULT 'https://github.com/Fazrilukman',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/fazrilukman/',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/fazrilukman_/?hl=id',
  name TEXT DEFAULT 'Fazri Lukman Nurrohman',
  description TEXT DEFAULT 'Seorang lulusan Teknik Jaringan Komputer dan Telekomunikasi yang memiliki ketertarikan besar dalam pengembangan Front-End. Saya berfokus pada menciptakan pengalaman digital yang menarik dan selalu berusaha memberikan solusi terbaik dalam setiap proyek yang saya kerjakan.',
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

-- 3. Insert/Update data default (hanya 1 row)
INSERT INTO profile_settings (id) VALUES (1)
ON CONFLICT (id) DO UPDATE SET
  photo_url = COALESCE(profile_settings.photo_url, '/Photo.jpg'),
  title = COALESCE(profile_settings.title, 'Frontend Developer'),
  subtitle = COALESCE(profile_settings.subtitle, 'Web Developer|Design|Video & Photo Editing|UI/UX Design'),
  tech_stack = COALESCE(profile_settings.tech_stack, ARRAY['React', 'Javascript', 'Node.js', 'Tailwind']),
  github_url = COALESCE(profile_settings.github_url, 'https://github.com/Fazrilukman'),
  linkedin_url = COALESCE(profile_settings.linkedin_url, 'https://www.linkedin.com/in/fazrilukman/'),
  instagram_url = COALESCE(profile_settings.instagram_url, 'https://www.instagram.com/fazrilukman_/?hl=id'),
  name = COALESCE(profile_settings.name, 'Fazri Lukman Nurrohman'),
  description = COALESCE(profile_settings.description, 'Seorang lulusan Teknik Jaringan Komputer dan Telekomunikasi yang memiliki ketertarikan besar dalam pengembangan Front-End.'),
  cv_link = COALESCE(profile_settings.cv_link, 'https://drive.google.com/drive/folders/1BOm51Grsabb3zj6Xk27K-iRwI1zITcpo'),
  linkedin_connect = COALESCE(profile_settings.linkedin_connect, 'https://www.linkedin.com/in/fazrilukman/'),
  instagram_connect = COALESCE(profile_settings.instagram_connect, 'https://www.instagram.com/fazrilukman_/?hl=id'),
  youtube_connect = COALESCE(profile_settings.youtube_connect, 'https://www.youtube.com/@fazrilukman'),
  github_connect = COALESCE(profile_settings.github_connect, 'https://github.com/Fazrilukman'),
  tiktok_connect = COALESCE(profile_settings.tiktok_connect, 'https://www.tiktok.com/@fazrilukman');

-- 4. Enable RLS (Row Level Security)
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies jika ada
DROP POLICY IF EXISTS "Allow public read access to profile_settings" ON profile_settings;
DROP POLICY IF EXISTS "Allow public update access to profile_settings" ON profile_settings;
DROP POLICY IF EXISTS "Allow public insert access to profile_settings" ON profile_settings;

-- 6. Buat policy untuk SELECT (public bisa read)
CREATE POLICY "Allow public read access to profile_settings"
ON profile_settings
FOR SELECT
TO public
USING (true);

-- 7. Buat policy untuk UPDATE (public bisa update - untuk admin)
CREATE POLICY "Allow public update access to profile_settings"
ON profile_settings
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 8. Buat policy untuk INSERT (jika diperlukan)
CREATE POLICY "Allow public insert access to profile_settings"
ON profile_settings
FOR INSERT
TO public
WITH CHECK (id = 1);

-- 9. Buat function untuk auto-update updated_at
CREATE OR REPLACE FUNCTION update_profile_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Drop trigger lama jika ada
DROP TRIGGER IF EXISTS profile_settings_updated_at ON profile_settings;

-- 11. Buat trigger untuk auto-update updated_at
CREATE TRIGGER profile_settings_updated_at
BEFORE UPDATE ON profile_settings
FOR EACH ROW
EXECUTE FUNCTION update_profile_settings_updated_at();

-- 12. OPTIONAL: Buat Storage Bucket untuk upload gambar
-- Jalankan di Supabase Dashboard > Storage > New bucket
-- Atau jalankan SQL berikut:

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- 13. OPTIONAL: Policy untuk Storage Bucket
CREATE POLICY "Public can view profile images"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'profile-images' );

CREATE POLICY "Anyone can upload profile images"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'profile-images' );

CREATE POLICY "Anyone can update their profile images"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'profile-images' );

CREATE POLICY "Anyone can delete profile images"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'profile-images' );

-- SELESAI! 
-- Sekarang coba:
-- 1. Buka http://localhost:5175/admin/profile
-- 2. Upload foto menggunakan tombol "Upload Foto"
-- 3. Atau masukkan URL foto
-- 4. Update semua field
-- 5. Klik Save Changes
-- 6. Cek homepage untuk melihat perubahan
