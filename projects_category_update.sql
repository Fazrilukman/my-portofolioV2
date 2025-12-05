-- SQL untuk menambahkan kolom Category pada tabel projects
-- Jalankan ini di Supabase SQL Editor

-- 1. Tambahkan kolom category ke tabel projects (jika belum ada)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Project';

-- 2. Update data yang sudah ada untuk set default category
UPDATE projects
SET category = 'Project'
WHERE category IS NULL;

-- 3. OPTIONAL: Buat constraint untuk memastikan category hanya boleh 'Project', 'Design', atau 'Editing'
-- Uncomment jika ingin menerapkan constraint
-- ALTER TABLE projects
-- ADD CONSTRAINT projects_category_check 
-- CHECK (category IN ('Project', 'Design', 'Editing'));

-- 4. Verifikasi perubahan
SELECT id, "Title", category FROM projects ORDER BY id;

-- SELESAI!
-- Kolom Category sudah ditambahkan dengan default value 'Project'
-- Sekarang Anda bisa:
-- 1. Membuka halaman Admin Projects
-- 2. Menambah/Edit project dan pilih kategori: Project, Design, atau Editing
-- 3. Filter project berdasarkan kategori di halaman Portfolio
