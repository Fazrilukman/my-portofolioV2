# Panduan Mengganti Gambar Lanyard

## 📁 Lokasi File Gambar

Letakkan file gambar Anda di folder `public/`:

```
MY PORTOFOLIO/
  public/
    lanyard-front.png  ← Gambar depan kartu
    lanyard-back.png   ← Gambar belakang kartu
```

## 🖼️ Spesifikasi Gambar

### Ukuran Rekomendasi:
- **Rasio**: 2:3 (contoh: 800x1200px, 1000x1500px)
- **Format**: PNG (dengan transparansi) atau JPG
- **Ukuran file**: Maksimal 500KB untuk performa optimal

### Contoh Ukuran:
- Mobile: 600x900px
- Desktop: 800x1200px
- High Resolution: 1000x1500px

## 🎨 Cara Mengganti Gambar

### 1. Siapkan Gambar Anda
Buat atau edit gambar dengan rasio 2:3:
- Depan kartu: Design ID card, badge, atau kartu nama
- Belakang kartu: Logo, informasi, atau design alternatif

### 2. Simpan ke Folder Public
```bash
# Salin gambar ke folder public
copy gambar-depan.png "d:\MY PORTOFOLIO\MY PORTOFOLIO\public\lanyard-front.png"
copy gambar-belakang.png "d:\MY PORTOFOLIO\MY PORTOFOLIO\public\lanyard-back.png"
```

### 3. Refresh Browser
Setelah gambar disimpan, refresh browser Anda. Gambar akan otomatis muncul di kartu lanyard!

## 🔧 Kustomisasi Lanjutan

### Mengubah Nama File Gambar
Edit file `src/components/Lanyard.jsx`, cari baris:

```jsx
frontTexture = useTexture('/lanyard-front.png');
backTexture = useTexture('/lanyard-back.png');
```

Ganti dengan nama file Anda:
```jsx
frontTexture = useTexture('/nama-file-depan.png');
backTexture = useTexture('/nama-file-belakang.png');
```

### Menggunakan Hanya Gambar Depan
Jika hanya ingin gambar depan, set backTexture ke null:
```jsx
frontTexture = useTexture('/lanyard-front.png');
backTexture = null; // Belakang tetap pakai warna solid
```

### Mengubah Fallback Color
Jika gambar tidak ada, warna default akan muncul. Ubah di:
```jsx
color={frontTexture ? "#ffffff" : "#1a1a2e"}  // Warna saat no texture
emissive={frontTexture ? "#000000" : "#6366f1"} // Warna glow
```

## 💡 Tips Design

1. **Gunakan background transparan** (PNG) untuk hasil terbaik
2. **Tambahkan padding** 5-10% di semua sisi gambar
3. **Hindari teks terlalu kecil** - minimal 14pt
4. **Gunakan kontras warna** yang baik untuk readability
5. **Test di mobile** - pastikan gambar terlihat jelas di layar kecil

## 🎯 Contoh Template

### Design ID Card:
```
╔══════════════════════╗
║   [Logo/Photo]       ║
║                      ║
║   Nama Lengkap       ║
║   Jabatan/Role       ║
║                      ║
║   [Barcode/QR]       ║
╚══════════════════════╝
```

### Tools Design:
- Figma
- Canva
- Adobe Photoshop
- GIMP (gratis)

## ⚠️ Troubleshooting

### Gambar tidak muncul?
1. Pastikan file ada di folder `public/`
2. Cek nama file sesuai (case-sensitive)
3. Cek format file (PNG/JPG)
4. Hard refresh browser (Ctrl + Shift + R)

### Gambar terlalu blur?
- Gunakan resolusi lebih tinggi (min 800x1200px)
- Pastikan gambar original tajam

### Gambar terpotong?
- Pastikan rasio 2:3
- Tambahkan padding di design Anda

## 📸 Hasil

Setelah menambahkan gambar:
- ✅ Gambar depan akan tampil di bagian depan kartu
- ✅ Gambar belakang tampil saat kartu diputar
- ✅ Kartu tetap memiliki efek 3D, animasi, dan lighting
- ✅ Fallback ke warna solid jika gambar tidak tersedia
