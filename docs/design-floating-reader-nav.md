# Dokumen Desain: Floating Reader Navigation
## Halaman Baca Chapter — MangaKyy

Dokumen ini menjelaskan desain fitur navigasi mengambang (floating bar) untuk halaman baca chapter MangaKyy, menggantikan navigasi statis yang ada saat ini.

---

## 1. Ringkasan Pemahaman

- **Apa yang dibangun**: Floating bar atas dan bawah untuk navigasi halaman baca chapter, plus fitur auto-scroll dengan pengaturan kecepatan.
- **Mengapa**: Agar pengalaman membaca lebih imersif — pembaca tidak perlu scroll manual untuk navigasi, dan bisa membaca hands-free dengan auto-scroll.
- **Untuk siapa**: Pembaca manga di MangaKyy, baik di mobile (PWA) maupun desktop.
- **Batasan tampilan**: Konten hanya mengisi sebagian layar (max-width container), floating bar mengikuti lebar konten.
- **Bukan tujuan**: Tidak mengubah cara gambar chapter ditampilkan, tidak menambah fitur di luar navigasi dan auto-scroll (zoom, rotate, reading mode, dll).

---

## 2. Pendekatan yang Dipilih

**Hook Pusat + Komponen Terpisah**

Satu custom hook `useChapterReader` mengatur semua state dan logika. Komponen-komponen UI murni tampilan saja — terima data dari hook.

Dipilih karena:
- Cukup modular tanpa over-engineering
- Sesuai pola yang sudah dipakai di project (`useChapter` hook)
- Logika terpusat dan mudah di-test
- Komponen ringan dan mudah diubah tampilan

---

## 3. Struktur Komponen

### File Baru

```
src/features/chapter/
├── components/
│   ├── reader/
│   │   ├── FloatingTopBar.tsx        ← Bar atas (judul, chapter, kembali)
│   │   ├── FloatingBottomBar.tsx     ← Bar bawah (prev/next, play, kecepatan)
│   │   ├── SpeedSlider.tsx           ← Slider kecepatan + tombol selesai
│   │   └── ChapterEndSheet.tsx       ← Slide-up card akhir chapter
├── hooks/
│   ├── useChapterReader.ts           ← Hook pusat
```

### State yang Dikelola `useChapterReader`

| State | Tipe | Default | Fungsi |
|---|---|---|---|
| `isBarsVisible` | boolean | false | Floating bar muncul atau tidak |
| `isAutoScrolling` | boolean | false | Auto-scroll sedang jalan atau tidak |
| `scrollSpeed` | number | 1 | Kecepatan auto-scroll (0.1 – 2.0) |
| `isSpeedMode` | boolean | false | Bottom bar tampilkan slider atau normal |
| `isChapterEnd` | boolean | false | Sudah sampai bawah, tampilkan slide-up card |

### Fungsi yang Disediakan Hook

| Fungsi | Aksi |
|---|---|
| `handleTap()` | Toggle bar. Jika auto-scroll jalan → pause + munculkan bar |
| `handleScroll()` | Tutup bar jika terbuka |
| `handleHold()` | Tutup bar jika terbuka |
| `toggleAutoScroll()` | Play/pause auto-scroll |
| `setScrollSpeed(speed)` | Ubah kecepatan auto-scroll |
| `enterSpeedMode()` | Ganti bottom bar ke slider |
| `exitSpeedMode()` | Kembali ke bottom bar normal |

---

## 4. Tampilan Tiap Komponen

### 4.1 FloatingTopBar

```
┌─────────────────────────────────────────────┐
│  ← Kembali     Solo Leveling - Ch. 45       │
└─────────────────────────────────────────────┘
```

- **Posisi**: Fixed di atas, dalam batas lebar konten (`max-w-3xl`)
- **Isi**: Tombol kembali (ikon panah + teks) di kiri, judul manga + nomor chapter di kanan
- **Warna**: `bg-[#111]/90 backdrop-blur` — sesuai style existing
- **Animasi**: Slide dari atas (`y: -100 → y: 0`) menggunakan library Motion

### 4.2 FloatingBottomBar — Mode Normal

```
┌─────────────────────────────────────────────┐
│  ← Ch.44    ▶    ⚙    Ch.46 →   │
└─────────────────────────────────────────────┘
```

- **Posisi**: Fixed di bawah, dalam batas lebar konten
- **Isi**: Tombol prev chapter, tombol play/pause, tombol pengaturan kecepatan, tombol next chapter
- **Warna**: `bg-[#111]/90 backdrop-blur`
- **Animasi**: Slide dari bawah (`y: 100 → y: 0`)
- **Disabled**: Prev disabled di chapter 1, Next disabled di chapter terakhir

### 4.3 SpeedSlider (Menggantikan Isi Bottom Bar)

```
┌─────────────────────────────────────────────┐
│  0.1x ━━━━━━━━━━●━━━━━━━━━━ 2x   [Selesai] │
└─────────────────────────────────────────────┘
```

- **Muncul** saat tombol ⚙ Speed ditekan, menggantikan isi bottom bar
- **Isi**: Slider horizontal (range 0.1 – 2.0) + label kiri/kanan + tombol "Selesai"
- **Klik "Selesai"**: Kembali ke mode normal
- **Transisi**: Crossfade antara mode normal ↔ slider

### 4.4 ChapterEndSheet

```
                    ┌───────────────────────┐
                    │   ━━━  (handle bar)   │
                    │                       │
                    │   Chapter 45 Selesai  │
                    │                       │
                    │   [ Lanjut Ch. 46 → ] │
                    │   [     Kembali     ] │
                    └───────────────────────┘
```

- **Muncul** saat auto-scroll sampai bawah halaman
- **Posisi**: Slide naik dari bawah, semi-overlay
- **Isi**: Teks "Chapter X Selesai", tombol "Lanjut ke Ch. X+1", tombol "Kembali"
- **Chapter terakhir**: Teks → "Chapter Terakhir", tombol lanjut → "Kembali ke Detail Manga"
- **Style**: `bg-[#111]/90 backdrop-blur`, rounded atas

---

## 5. Alur Interaksi

```
Pembaca buka halaman chapter
        │
        ▼
Floating bar TERSEMBUNYI — tampilan bersih, hanya gambar manga
        │
    [TAP layar]
        │
        ▼
Floating bar MUNCUL (atas + bawah, animasi slide)
        │
        ├── [TAP lagi] → bar HILANG
        ├── [SCROLL] → bar HILANG
        ├── [HOLD/TAHAN] → bar HILANG
        ├── [Klik Prev/Next] → navigasi ke chapter lain
        ├── [Klik Play] → bar HILANG, auto-scroll MULAI
        │       │
        │   [TAP saat auto-scroll]
        │       │
        │       ▼
        │   Auto-scroll PAUSE + bar MUNCUL
        │
        └── [Klik ⚙ Speed] → bottom bar ganti ke SLIDER
                │
                ├── [Geser slider] → kecepatan berubah
                └── [Klik Selesai] → kembali ke bottom bar normal
```

---

## 6. Edge Cases

| Situasi | Perilaku |
|---|---|
| Chapter pertama, tekan prev | Tombol prev disabled |
| Chapter terakhir, tekan next | Tombol next disabled |
| Chapter terakhir + auto-scroll sampai bawah | Slide-up card: "Chapter Terakhir" + "Kembali ke Detail Manga" |
| Auto-scroll jalan lalu pengguna scroll manual | Auto-scroll pause, bar tetap tersembunyi |
| Ubah kecepatan saat auto-scroll pause | Kecepatan tersimpan, berlaku saat play ditekan lagi |
| Klik "Lanjut" di slide-up card | Navigasi ke chapter berikutnya, auto-scroll lanjut dengan kecepatan sama |
| Halaman pertama kali dibuka | Bar tersembunyi, auto-scroll tidak aktif, kecepatan default 1x |

---

## 7. Asumsi

- Kecepatan default auto-scroll: **1x**
- Range kecepatan: **0.1x – 2.0x**
- Auto-scroll berhenti jika tidak ada chapter selanjutnya
- Floating bar mengikuti lebar `max-w-3xl` (tidak full-width di desktop)
- Navigasi statis yang ada sekarang **dihapus** dan diganti sepenuhnya oleh floating bar
- **Tidak ada perubahan** pada logika data fetching, SEO meta tags, atau penyimpanan riwayat bacaan
- Visual mengikuti design language existing: warna, tipografi, tema, layout

---

## 8. Decision Log

### Keputusan 1: Perilaku di Akhir Chapter Saat Auto-Scroll
- **Dipilih**: Slide-up card dari bawah dengan konfirmasi "Lanjut ke chapter berikutnya"
- **Alternatif**: (1) Scroll berhenti saja, (2) Otomatis lanjut tanpa konfirmasi, (3) Modal popup di tengah layar, (4) Notifikasi di bottom bar
- **Alasan**: Tidak memaksa pengguna, memberikan kontrol, tampilan tidak menutupi seluruh layar

### Keputusan 2: Cara Kembali dari Mode Slider Kecepatan
- **Dipilih**: Tombol "Selesai" di samping slider
- **Alternatif**: (1) Otomatis kembali setelah timeout, (2) Tap di luar slider
- **Alasan**: Eksplisit dan tidak ambigu, pengguna tahu persis cara keluar

### Keputusan 3: Tap untuk Toggle Floating Bar
- **Dipilih**: Tap di mana saja pada layar (termasuk di atas gambar manga)
- **Alternatif**: Hanya tap di area kosong di luar gambar
- **Alasan**: Lebih natural dan konsisten, pengguna tidak perlu cari area kosong

### Keputusan 4: Perilaku Auto-Scroll Saat Tap
- **Dipilih**: Auto-scroll langsung pause + floating bar muncul
- **Alternatif**: (1) Auto-scroll tetap jalan, bar muncul di atasnya, (2) Auto-scroll tetap jalan, bar tidak muncul
- **Alasan**: Satu aksi (tap) = satu hasil yang jelas, tidak membingungkan

### Keputusan 5: Pendekatan Arsitektur
- **Dipilih**: Hook pusat (`useChapterReader`) + komponen UI terpisah
- **Alternatif**: (1) Context Provider, (2) Semua di satu komponen besar
- **Alasan**: Modular tanpa over-engineering, sesuai pola existing, mudah di-maintain
