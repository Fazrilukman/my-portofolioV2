# Profile Settings - Admin Panel

## 🎨 Fitur Profile Settings

Menu **Profile Settings** (`/admin/profile`) memungkinkan Anda mengelola semua informasi profil portfolio secara terpusat.

---

## 📸 1. Foto Profil (Gambar 2)

**Fungsi:** Mengatur foto profil yang ditampilkan di halaman About

### Cara Menggunakan:
1. Masukkan URL foto (contoh: `https://i.imgur.com/abc123.jpg`)
2. Atau gunakan path lokal: `/Photo.jpg`
3. Preview foto akan muncul otomatis
4. Klik **Simpan Profile** untuk menyimpan

**Tips:**
- Ukuran optimal: 400x400px atau 800x800px
- Format: JPG atau PNG
- Maksimal: 500KB untuk performa terbaik

---

## 🎯 2. Hero Section (Gambar 3)

**Fungsi:** Mengatur tampilan hero/landing section

### Field yang Bisa Diatur:

#### a. Title
- **Contoh:** "Frontend Developer"
- **Tampil di:** Halaman utama, bagian hero
- **Warna:** Gradient purple-blue

#### b. Subtitle  
- **Contoh:** "Network & Telecom Student"
- **Tampil di:** Di bawah title
- **Efek:** Typewriter animation

#### c. Tech Stack (Max 6 items)
- **Contoh:** React, Javascript, Node.js, Tailwind
- **Tampil di:** Badges di bawah subtitle
- **Cara:** Isi setiap field, klik "+ Tambah" untuk menambah
- **Hapus:** Klik tombol ✕ untuk menghapus item

---

## 🔗 3. Social Media Links (Gambar 4)

**Fungsi:** Icon social media di hero section

### Link yang Bisa Diatur:
- ✅ **GitHub** - Icon GitHub
- ✅ **LinkedIn** - Icon LinkedIn
- ✅ **Instagram** - Icon Instagram

**Format URL:**
```
GitHub: https://github.com/username
LinkedIn: https://linkedin.com/in/username
Instagram: https://instagram.com/username
```

**Efek:** Hover effect dengan glow purple-blue

---

## 👤 4. About Section (Gambar 5)

**Fungsi:** Informasi di halaman About

### Field yang Bisa Diatur:

#### a. Nama Lengkap
- **Tampil di:** "Hello, I'm [Nama Anda]"
- **Contoh:** Fazri Lukman Nurrohman

#### b. Deskripsi
- **Tampil di:** Paragraf tentang Anda
- **Maksimal:** 3-4 paragraf
- **Tips:** Ceritakan background, keahlian, dan passion Anda

#### c. CV Link
- **Format:** URL Google Drive, Dropbox, atau hosting lainnya
- **Contoh:** `https://drive.google.com/file/d/...`
- **Tampil di:** Tombol "Download CV"

---

## 📱 5. Connect With Me (Gambar 6)

**Fungsi:** Social media links di contact section

### Platform yang Tersedia:
1. **LinkedIn** - Let's Connect on LinkedIn
2. **Instagram** - @username
3. **YouTube** - @channel
4. **GitHub** - @username  
5. **TikTok** - @username

**Format URL:**
```
LinkedIn: https://linkedin.com/in/username
Instagram: https://instagram.com/username
YouTube: https://youtube.com/@channelname
GitHub: https://github.com/username
TikTok: https://tiktok.com/@username
```

**Tampilan:** Card dengan icon dan hover effect

---

## 💾 Menyimpan Perubahan

1. Isi semua field yang ingin diubah
2. Scroll ke bawah
3. Klik tombol **"Simpan Profile"**
4. Tunggu notifikasi sukses
5. Perubahan langsung terlihat di frontend

---

## 🗄️ Database Structure

### Tabel: `profile_settings`

```sql
CREATE TABLE profile_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  photo_url TEXT,
  title TEXT,
  subtitle TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  linkedin_url TEXT,
  instagram_url TEXT,
  name TEXT,
  description TEXT,
  cv_link TEXT,
  linkedin_connect TEXT,
  instagram_connect TEXT,
  youtube_connect TEXT,
  github_connect TEXT,
  tiktok_connect TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Note:** Hanya 1 row yang bisa ada di tabel ini (enforced by constraint)

---

## 🔧 Setup Supabase

### 1. Jalankan SQL Script

Buka Supabase SQL Editor dan jalankan:

```sql
-- Copy semua isi file profile_settings.sql
-- Paste di SQL Editor
-- Klik "Run"
```

### 2. Verifikasi Tabel

Cek di Table Editor bahwa tabel `profile_settings` sudah dibuat dengan 1 row default.

### 3. Test RLS Policies

Pastikan policies sudah aktif:
- ✅ Allow public read access
- ✅ Allow public update access
- ✅ Allow public insert access

---

## 🎨 Preview Perubahan

### Dimana Perubahan Terlihat?

1. **photo_url** → About page (foto profile bulat)
2. **title & subtitle** → Home page hero section
3. **tech_stack** → Home page badges
4. **github/linkedin/instagram_url** → Home page social icons
5. **name & description** → About page intro
6. **cv_link** → About page button "Download CV"
7. **Connect links** → Contact/About page "Connect With Me"

---

## ⚠️ Troubleshooting

### Perubahan tidak muncul
- **Solusi:** Hard refresh (Ctrl+Shift+R atau Cmd+Shift+R)
- **Cek:** Browser console untuk error

### Gambar tidak muncul
- **Pastikan:** URL valid dan accessible
- **Test:** Buka URL di tab baru
- **Alternatif:** Gunakan path lokal `/Photo.jpg`

### Data tidak tersimpan
- **Cek:** Koneksi Supabase di `.env`
- **Cek:** RLS policies sudah aktif
- **Cek:** Browser console untuk error message

---

## 📝 Best Practices

### Foto Profil
- ✅ Gunakan foto profesional
- ✅ Background netral atau blur
- ✅ Resolusi tinggi (min 400x400px)
- ✅ Format JPG/PNG

### Deskripsi
- ✅ Jelas dan ringkas
- ✅ Highlight keahlian utama
- ✅ Tambahkan personality
- ✅ Max 3-4 paragraf

### Links
- ✅ Gunakan URL lengkap dengan `https://`
- ✅ Test semua link sebelum save
- ✅ Pastikan profile social media public/accessible

### Tech Stack
- ✅ List 4-6 teknologi utama
- ✅ Sesuaikan dengan project portfolio
- ✅ Gunakan nama official (React, not React.js)

---

## 🎯 Workflow Recommended

1. **Pertama kali setup:**
   - Isi semua field
   - Upload foto profil
   - Test semua link
   - Save dan preview

2. **Update berkala:**
   - Update deskripsi sesuai perkembangan
   - Tambah tech stack baru
   - Update CV link
   - Refresh social media links

3. **Sebelum publish:**
   - Double check semua info
   - Test di mobile dan desktop
   - Pastikan semua link work
   - Check typo dan grammar

---

**File:** `AdminProfile.jsx`  
**Route:** `/admin/profile`  
**SQL Script:** `profile_settings.sql`  
**Last Updated:** December 2025
