-- SQL untuk mengatasi RLS error pada tabel certificates
-- Jalankan di Supabase SQL Editor

-- PILIH SALAH SATU:

-- ========================================
-- OPSI 1: DISABLE RLS (PALING MUDAH)
-- ========================================
-- Copy dan jalankan HANYA baris ini:

ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;

-- ========================================
-- OPSI 2: ENABLE RLS DENGAN POLICY OPEN
-- ========================================
-- Atau copy dan jalankan SEMUA baris berikut ini (dari DROP sampai ENABLE):

DROP POLICY IF EXISTS "Enable all for certificates" ON public.certificates;

CREATE POLICY "Enable all for certificates" 
ON public.certificates 
FOR ALL 
TO public
USING (true) 
WITH CHECK (true);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- ========================================
-- VERIFIKASI
-- ========================================
-- Setelah menjalankan salah satu opsi di atas, jalankan query ini untuk cek:

SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'certificates';

-- Jika rowsecurity = false, berarti RLS sudah disabled (Opsi 1)
-- Jika rowsecurity = true, berarti RLS enabled dengan policy (Opsi 2)
