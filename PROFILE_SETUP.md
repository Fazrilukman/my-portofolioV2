# 🎯 Profile Settings - Quick Guide

## Akses Menu Profile Settings

1. Login ke admin panel: `http://localhost:5175/admin/login`
2. Klik menu **"Profile Settings"** di sidebar
3. Atau akses langsung: `http://localhost:5175/admin/profile`

---

## 📋 Checklist Setup

### ✅ Step 1: Setup Database (WAJIB!)

Buka **Supabase SQL Editor** dan jalankan script ini:

```bash
# File: profile_settings.sql
# Lokasi: d:\MY PORTOFOLIO\MY PORTOFOLIO\profile_settings.sql
```

Copy semua isi file → Paste di SQL Editor → Klik **Run**

### ✅ Step 2: Verifikasi Tabel

Buka **Table Editor** di Supabase:
- Cari tabel `profile_settings`
- Pastikan ada 1 row dengan data default
- Cek RLS policies sudah aktif

### ✅ Step 3: Akses Admin Profile

1. Login admin
2. Klik **Profile Settings** di menu
3. Form akan load dengan data existing (atau default jika baru)

---

## 🎨 Apa Yang Bisa Diubah?

### 1️⃣ Foto Profil (Gambar 2)
```
Field: Photo URL
Contoh: /Photo.jpg atau https://i.imgur.com/abc.jpg
Tampil di: About page
```

### 2️⃣ Hero Section (Gambar 3)
```
- Title: "Frontend Developer"
- Subtitle: "Network & Telecom Student"  
- Tech Stack: React, Javascript, Node.js, Tailwind (max 6)
Tampil di: Home page hero
```

### 3️⃣ Social Icons Hero (Gambar 4)
```
- GitHub: https://github.com/username
- LinkedIn: https://linkedin.com/in/username
- Instagram: https://instagram.com/username
Tampil di: Home page social icons
```

### 4️⃣ About Section (Gambar 5)
```
- Nama: "Fazri Lukman Nurrohman"
- Deskripsi: Bio lengkap (3-4 paragraf)
- CV Link: https://drive.google.com/...
Tampil di: About page
```

### 5️⃣ Connect With Me (Gambar 6)
```
- LinkedIn Connect
- Instagram  
- YouTube
- GitHub
- TikTok
Tampil di: Contact section
```

---

## 💾 Cara Menyimpan

1. Isi/Edit field yang diinginkan
2. Scroll ke bawah
3. Klik **"Simpan Profile"** (tombol biru)
4. Tunggu notifikasi "Berhasil!"
5. Refresh frontend untuk lihat perubahan

---

## 🚀 Quick Test

Setelah setup database:

1. **Login admin** → fazrilukman / Fajrilukman123_
2. **Klik Profile Settings**
3. **Ubah Title** → "Web Developer"
4. **Klik Simpan**
5. **Buka halaman utama** → Lihat perubahan di hero section

---

## ⚡ Tips Penting

### ✅ DO:
- Gunakan URL lengkap (`https://...`)
- Test semua link sebelum save
- Gunakan foto resolusi tinggi (min 400x400px)
- Keep description 3-4 paragraf
- Tech stack 4-6 items optimal

### ❌ DON'T:
- Jangan gunakan link broken
- Jangan terlalu banyak tech stack (max 6)
- Jangan lupa `https://` di URL
- Jangan save tanpa preview foto

---

## 🔧 Troubleshooting

### "Data tidak tersimpan"
```
✅ Cek: Tabel profile_settings sudah dibuat?
✅ Cek: RLS policies aktif?
✅ Cek: .env file sudah benar?
✅ Cek: Browser console ada error?
```

### "Perubahan tidak muncul"
```
✅ Hard refresh: Ctrl + Shift + R
✅ Clear cache browser
✅ Cek inspect element > Network > XHR
```

### "Foto tidak muncul"
```
✅ Test URL di tab baru
✅ Cek CORS jika external image
✅ Gunakan /Photo.jpg untuk local
✅ Max size 500KB
```

---

## 📂 File Structure

```
src/
├── Pages/
│   └── AdminProfile.jsx       ← Halaman admin profile
├── components/
│   └── AdminLayout.jsx        ← Updated dengan menu Profile
└── App.jsx                    ← Route /admin/profile added

Root/
├── profile_settings.sql       ← SQL script untuk Supabase
├── PROFILE_SETTINGS_GUIDE.md  ← Dokumentasi lengkap
└── ADMIN_README.md            ← Admin panel guide
```

---

## 🎯 Next Steps

1. **Jalankan SQL script** di Supabase ✨
2. **Login admin** dan test Profile Settings
3. **Update foto profil** pertama kali
4. **Isi semua field** dengan data real
5. **Save dan preview** di frontend

---

## 📞 Need Help?

Baca dokumentasi lengkap:
- **PROFILE_SETTINGS_GUIDE.md** - Guide lengkap profile settings
- **ADMIN_README.md** - Admin panel documentation
- **profile_settings.sql** - Database schema & setup

---

**Happy Editing! 🎨**
