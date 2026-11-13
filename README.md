<p align="center">
  <a href="https://mangakyy.my.id" target="_blank">
    <img src="https://mangakyy.my.id/mangakyy-logo.png" width="220" alt="MangaKyy Logo" />
  </a>
</p>

<h1 align="center">MangaKyy 📖</h1>

<p align="center">
  <strong>Platform Baca Manga, Manhwa & Manhua Modern, Gratis, Tercepat, dan Bebas Iklan</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-blue.svg?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TanStack_Router-1.170-emerald.svg" alt="TanStack Router" />
  <img src="https://img.shields.io/badge/TanStack_Query-5.66-coral.svg" alt="TanStack Query" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwind-css" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Package_Manager-Bun-f472b6.svg?logo=bun" alt="Bun" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
</p>

---

## 🎭 Maskot Resmi MangaKyy

MangaKyy memiliki maskot interaktif yang menemani pembaca di setiap bagian aplikasi dengan animasi *circular progress ring*:

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <img src="public/mascots/welcome.png" width="150" alt="Welcome Mascot" /><br />
        <strong>✨ Welcome Mascot</strong><br />
        <sub>Menyambut pembaca baru dengan animasi progress 0%–100%</sub>
      </td>
      <td align="center" width="33%">
        <img src="public/mascots/loading.png" width="150" alt="Loading Mascot" /><br />
        <strong>⏳ Loading Mascot</strong><br />
        <sub>Indikator transisi antar-halaman yang halus & responsif</sub>
      </td>
      <td align="center" width="33%">
        <img src="public/mascots/error.png" width="150" alt="Error Mascot" /><br />
        <strong>⚠️ Error Mascot</strong><br />
        <sub>Penanganan error 404 & 500 dengan tombol pemulihan cepat</sub>
      </td>
    </tr>
  </table>
</div>

---

## 📖 Tentang MangaKyy

**MangaKyy** adalah platform web modern generasi berikutnya untuk membaca dan menjelajahi ribuan judul manga, manhwa, dan manhua berbahasa Indonesia. Dibangun menggunakan arsitektur **TanStack Start**, **React 19**, dan **Bun**, MangaKyy dirancang dengan fokus utama pada performa tinggi (60fps), antarmuka gelap yang nyaman di mata, responsivitas mobile-first, dan optimasi SEO menyeluruh.

---

## 🚀 Fitur-Fitur Unggulan

### 1. 🎭 Mascot-Driven UI Experience
- **Welcome Screen Interaktif**: Tampil saat sesi awal dibuka, dilengkapi bundaran progress SVG melingkar di sekeliling maskot dengan status dinamis dan opsi lewati (*Skip/ESC*). Dilengkapi proteksi *Crawler & Lighthouse bypass* agar skor SEO dan Core Web Vitals tetap 100%.
- **Page Transition Loader**: Overlay transparan dengan bundaran progress memutar lembut yang mengitari maskot loading pada saat transisi rute SPA.
- **Branded Error Pages (404 & 500)**: Penanganan halaman tidak ditemukan (404) dan kendala server (500) bertema maskot error dengan status HTTP asli (anti soft-404) dan tombol aksi langsung ke Beranda/Explore.

### 2. ⚡ Preservasi State & URL Query Parameters
- Semua filter pencarian, genre, tipe (`mirror` / `project`), dan pagination tersimpan secara otomatis di URL search parameters.
- Navigasi tombol **Back** browser secara instan mempertahankan nomor halaman dan kriteria filter sebelumnya tanpa reset ke halaman awal atau refetching berulang.

### 3. 📖 Manga Detail & Immersive Hero Banner
- Desain *Amati-Tiru-Modifikasi* modern dengan poster cover portrait, banner blur ambient, dan logo watermark MangaKyy yang terakselerasi GPU.
- Tombol navigasi bulat melingkar (**Kembali** dan **Home**) di pojok kanan-kiri banner hero yang selalu dapat diakses.
- **Chapter List Switcher**: Mode grid 3 kolom pada layar desktop dengan gambar thumbnail preview chapter, dan mode list rapi yang terkunci otomatis di perangkat mobile.

### 4. 👓 Chapter Reader Berfitur Lengkap
- **Floating Top Bar**: Menampilkan judul komik terpusat dengan tombol kembali ke Detail dan Beranda. Di layar ponsel, teks disembunyikan otomatis untuk memaksimalkan ruang baca.
- **Floating Bottom Bar**: Dilengkapi **Interactive Scroll Progress Bar (0%–100%)** yang dapat diklik untuk melompat ke posisi scroll tertentu, diapit tombol *Auto-Scroll* dan *Pengaturan*.

### 5. 🔍 Filter & Pencarian Lanjutan
- Filter multi-genre cerdas dengan mode *Inclusion* dan *Exclusion*.
- Auto-scroll horizontal terpusat pada chip genre terpilih.
- Pencarian judul dengan sistem *debounce* (400ms) untuk mencegah lag input saat mengetik.

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Deskripsi |
|---|---|---|
| **Runtime & PM** | [Bun](https://bun.sh) (v1.4+) | JavaScript runtime & ultra-fast package manager |
| **Framework** | [React 19](https://react.dev) | Library antarmuka komponen modern |
| **Fullstack Meta**| [TanStack Start](https://tanstack.com/start) & [Nitro](https://nitro.unjs.io) | SSR, server functions, dan Nitro production engine |
| **Routing** | [TanStack Router](https://tanstack.com/router) | Type-safe routing dengan search params validation |
| **Data Fetching** | [TanStack React Query](https://tanstack.com/query) & [tRPC](https://trpc.io) | Caching handal, optimistic updates, dan typesafe API |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) & [Shadcn UI](https://ui.shadcn.com) | Utility-first CSS dengan desain sistem modern |
| **Animasi** | [Motion (Framer Motion)](https://motion.dev) | Animasi GPU-accelerated halus tanpa penurunan FPS |
| **Pengujian** | [Vitest](https://vitest.dev) | Unit testing runner secepat kilat |

---

## ⚡ Memulai Pengembangan (Local Setup)

### Prasyarat
- [Bun](https://bun.sh) (v1.2 atau lebih baru)

### Langkah Instalasi

1. **Clone repository:**
   ```bash
   git clone https://github.com/KyyTzy09/mangakyy.git
   cd mangakyy/frontend
   ```

2. **Install dependencies dengan Bun:**
   ```bash
   bun install
   ```

3. **Konfigurasi Environment Variables:**
   ```bash
   cp .env.example .env
   # Sesuaikan VITE_API_BASE_URL jika diperlukan
   ```

4. **Jalankan Development Server:**
   ```bash
   bun run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

---

## 💻 Script Perintah (Bun Scripts)

| Perintah | Deskripsi |
|---|---|
| `bun run dev` | Menjalankan server pengembangan lokal (port 3000) |
| `bun run build` | Melakukan kompilasi bundle client & Nitro server untuk production |
| `bun run preview` | Meninjau hasil build production secara lokal |
| `bun test` / `bun run test` | Menjalankan unit tests dengan Vitest |
| `bun run lint` | Memeriksa kualitas kode dengan ESLint |
| `bun run format` | Memeriksa format kode dengan Prettier |
| `bun run check` | Memperbaiki format kode & linting secara otomatis |

---

## 📁 Struktur Direktori

```
frontend/
├── public/
│   ├── mascots/             # Aset maskot resmi (WebP & PNG)
│   │   ├── welcome.webp     # Maskot sambutan awal
│   │   ├── loading.webp     # Maskot indikator pemuatan
│   │   └── error.webp       # Maskot penanganan error
│   ├── mangakyy-logo.png    # Logo utama MangaKyy
│   └── favicon.ico
├── src/
│   ├── api/                 # Server functions & tRPC handlers
│   ├── features/            # Modul fitur fungsional
│   │   ├── chapter/         # Reader, cards, floating bars & pagination
│   │   ├── explore/         # Pencarian genre & filter multivariat
│   │   └── manga/           # Carousel, switcher layout & card manga
│   ├── pages/               # Tampilan halaman utama
│   │   ├── home/            # Beranda & rekomendasi
│   │   ├── detail/          # Detail manga & chapter list
│   │   ├── explore/         # Penjelajahan katalog komik
│   │   ├── popular/         # Daftar manga terpopuler
│   │   ├── update/          # Pembaruan chapter terbaru
│   │   └── error/           # Halaman 404 & 500 error boundary
│   ├── routes/              # TanStack Router file-based routes
│   │   ├── __root.tsx       # Root shell, devtools, maskot loader & welcome
│   │   ├── detail.$mangaId.tsx
│   │   └── chapter.$chapterId.tsx
│   ├── shared/              # Komponen & utilitas global
│   │   ├── components/      # MascotProgressRing, ErrorDisplay, Layouts
│   │   ├── interfaces/      # TypeScript definitions
│   │   └── utils/           # Helper fungsi, SEO, format tanggal & angka
│   ├── router.tsx           # Inisialisasi router TanStack
│   └── styles.css           # Konfigurasi Tailwind CSS v4 & theme tokens
├── bun.lock                 # Lockfile resmi Bun
├── package.json
└── vite.config.ts
```

---

## 🌐 SEO & Aksesibilitas

MangaKyy dibangun dengan prinsip SEO ramah mesin pencari:
- **Metadata Dinamis**: Setiap halaman komik menyertakan judul teroptimasi, deskripsi, Open Graph, dan Twitter Cards lengkap.
- **Structured Data**: Schema.org JSON-LD tipe `WebSite`, `Organization`, dan `Book` otomatis disematkan pada setiap judul.
- **Sitemap & Robots**: `sitemap.xml` dan `robots.txt` digenerate secara dinamis.
- **Anti-Penalty Shield**: Maskot sambutan otomatis dinonaktifkan saat diakses oleh *Googlebot*, *Bingbot*, maupun audit *Google Lighthouse*, memastikan skor performa dan Core Web Vitals tidak terganggu.

---

## 👨‍💻 Kontribusi & Lisensi

Proyek ini berada di bawah lisensi [MIT License](LICENSE).  
Dibuat dengan ❤️ oleh tim pengembang MangaKyy.
