# Dokumen Desain: Redesign Homepage (Carousel & Update Section)
## Halaman Utama (Beranda) — MangaKyy

Dokumen ini mendefinisikan rancangan perbaikan tampilan dan interaksi pada halaman Beranda MangaKyy berdasarkan hasil brainstorming dan referensi desain pengguna.

---

## 1. Ringkasan Kebutuhan (Understanding Summary)

- **Apa yang dibangun/diubah**:
  1. **Hero Carousel (`CarouselSection`)**:
     - Membatasi data maksimum 10 judul komik.
     - Menambahkan kemampuan gestur geser (*drag/swipe* kiri-kanan) di mobile dan desktop.
     - Menghapus teks redundan tipe komik (*"Manhwa/Manga/Manhua"*) di detail overlay karena sudah diwakili oleh bendera negara.
     - Menghapus tombol close `X` pada detail overlay (bisa ditutup dengan klik area lain).
     - Menyesuaikan ukuran font detail/sinopsis agar tidak terlalu kecil dan nyaman dibaca di layar telepon genggam (*mobile friendly*).
     - **Catatan**: Struktur visual dan gaya kartu carousel eksisting tetap dipertahankan seperti aslinya, tidak diubah di luar poin-poin yang diminta.
  2. **Update Section & Card (`LatestSection` & `LatestCard`)**:
     - Menambahkan tombol pengalih (*tab switcher*) **Project** vs **Mirror** pada bagian header.
     - Membersihkan elemen visual berlebih (*anti AI-slop & anti-overgradient*): menghapus badge dot status, tahun pada cover, rating bintang, jumlah views/bookmark, genre pills, sinopsis panjang, serta border glow/shimmer yang berlebihan.
     - Merestrukturisasi tampilan `LatestCard` sesuai referensi gambar: Cover di sisi kiri, di sisi kanan menampilkan Judul komik di bagian atas dan **3 baris tombol shortcut chapter terbaru** (nomor chapter di kiri, waktu rilis di kanan).
     - Klik baris chapter langsung mengarah ke `/chapter/:chapterId`, sedangkan klik cover/judul mengarah ke `/detail/:mangaId`.
- **Mengapa**: Memberikan kemudahan navigasi 1-klik ke chapter yang baru diperbarui, meningkatkan keterbacaan, dan menghilangkan *visual noise* yang tidak relevan.
- **Untuk siapa**: Pembaca manga MangaKyy di perangkat mobile dan desktop.
- **Bukan tujuan**: Tidak merombak layout besar beranda (tetap 2 kolom: Rekomendasi/Populer di kiri, Update di kanan), dan tidak mengubah skema API backend.

---

## 2. Kebutuhan Non-Fungsional & Asumsi

1. **Performa Gestur**: Gestur drag horizontal memanfaatkan fitur native `motion/react` dengan toleransi drag (`dragElastic={0.2}`) dan ambang batas offset/velocity agar interaksi tetap responsif (60 FPS) tanpa bentrok dengan event klik kartu.
2. **Client Caching (Zero Reload)**: Pengalihan tab Project ↔ Mirror di aside memanfaatkan TanStack Query `useGetUpdateManga` dengan caching otomatis di browser, sehingga perpindahan tab terjadi secara instan tanpa reload halaman atau delay jaringan setelah di-cache.
3. **Estetika Gelap Bersih (Subtle Surfaces)**: Warna latar kartu menggunakan slate/zinc gelap solid yang tenang (`bg-[#0f141f]` / `bg-[#131722]`) dengan border lembut (`border-white/5`), menghindari gradien menyala atau efek glow berlebih.
4. **Fallback Chapter Dinamis**: Jika sebuah judul pada data API memiliki kurang dari 3 chapter (misal hanya 1 atau 2), komponen merender chapter yang tersedia secara dinamis tanpa merusak susunan kartu.

---

## 3. Decision Log

### Keputusan 1: Interaksi Carousel
- **Dipilih**: Motion drag horizontal (`drag="x"`) dengan constraint dan threshold swipe.
- **Alternatif**: Hanya tombol panah panah (lama), atau mengganti total dengan slider library baru.
- **Alasan**: Menjaga integritas visual card deck 3D yang unik tanpa merusak styling kartu, sambil memberikan interaksi gestur alami di mobile.

### Keputusan 2: Layout dan Aksi Shortcut Chapter
- **Dipilih**: Compact vertical stack 3 baris chapter (nomor chapter di kiri + waktu rilis di kanan).
- **Alternatif**: Grid horizontal pills atau modal popup.
- **Alasan**: Sesuai dengan referensi gambar dari pengguna, memberikan area sentuh yang nyaman dan langsung mengantar pembaca ke halaman baca dalam 1 kali sentuh.

### Keputusan 3: Penataan Gaya & Eliminasi Elemen Dekoratif
- **Dipilih**: Menghapus rating, views, bookmark, sinopsis, tag genre, badge tahun, dot hijau, dan efek glow gradien berlebih.
- **Alternatif**: Mempertahankan beberapa badge kecil.
- **Alasan**: Fokus pada fungsi pembaruan rilis chapter, membuat tampilan samping padat dan bebas distraksi (*AI slop*).

### Keputusan 4: Mekanisme Tab Switcher Project vs Mirror
- **Dipilih**: Local state + TanStack Query hook `useGetUpdateManga`.
- **Alternatif**: URL search query params (`/?update=mirror`).
- **Alasan**: Mencegah re-run route loader utama yang dapat memicu refetch section lain (Rekomendasi & Populer), serta memberikan transisi instan bagi pengguna.

### Keputusan 5: Optimasi Performa Carousel (PageSpeed Insights)
- **Dipilih**: Menghapus animasi dinamis CSS `filter: brightness()` pada kartu carousel dan menggantinya dengan layer opacity GPU (`transform-gpu`). Menambahkan `fetchPriority="high"` dan `loading="eager"` pada poster aktif LCP.
- **Alasan**: Mengeliminasi software repainting di mobile browser dan menaikkan skor Lighthouse/PageSpeed.

### Keputusan 6: Layout Kartu Genre Preview
- **Dipilih**: Clean Card murni yang menonjolkan Cover dan Judul tanpa rank badge `#1, #2` atau dekorasi span berlebih, dengan pill genre horizontal scrollable.
- **Alasan**: Sesuai arahan pengguna agar katalog tetap bersih, elegan, dan fokus pada konten bacaan.

---

## 4. Rincian Desain Komponen

### 4.1 CarouselSection (`src/features/manga/components/sections/CarouselSection.tsx`)
- **Data limit**: `const list = (items || recommendations || []).slice(0, 10);`
- **Gestur**:
  ```tsx
  <motion.div
    drag="x"
    dragConstraints={{ left: 0, right: 0 }}
    dragElastic={0.2}
    onDragEnd={(_, info) => {
      if (info.offset.x < -40 || info.velocity.x < -300) handleNext();
      else if (info.offset.x > 40 || info.velocity.x > 300) handlePrev();
    }}
    // ...
  >
  ```
- **Detail Overlay**:
  - Hapus: `<span className="...">{displayComicType(comic.country_id)}</span>`
  - Hapus: `<button onClick={() => setIsDetailOpen(false)}><X ... /></button>`
  - Ukuran teks judul: `text-base sm:text-lg font-bold`
  - Ukuran teks sinopsis: `text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-4 sm:line-clamp-5`
  - Gaya kartu carousel selebihnya tetap sesuai eksisting.

### 4.2 LatestSection (`src/features/manga/components/sections/LatestSection.tsx`)
- **Header**:
  - Judul: "Update Terbaru"
  - Tab Switcher:
    - Tombol `Project` dan `Mirror` dalam bentuk pill container (`bg-white/5 p-1 rounded-lg border border-white/5`).
    - Tab aktif menggunakan `bg-primary text-white shadow-sm`.
- **Data handling**: Menggunakan hook `useGetUpdateManga` untuk query data sesuai tipe yang aktif, dengan fallback ke skeleton saat fetching.
- **List**: Menampilkan 5 kartu komik teratas dari tipe yang dipilih.

### 4.3 LatestCard (`src/features/manga/components/cards/LatestCard.tsx`)
- **Struktur Kartu**:
  ```tsx
  <div className="flex gap-3 bg-[#0f141f] border border-white/5 rounded-xl p-3">
    {/* Cover Kiri */}
    <img
      src={cover}
      alt={title}
      onClick={() => navigate({ to: '/detail/$mangaId', params: { mangaId } })}
      className="w-20 aspect-[3/4.2] rounded-lg object-cover cursor-pointer hover:opacity-90 transition shrink-0"
    />

    {/* Konten Kanan */}
    <div className="flex flex-col flex-1 min-w-0 justify-between">
      {/* Judul Komik */}
      <h3
        onClick={() => navigate({ to: '/detail/$mangaId', params: { mangaId } })}
        className="font-bold text-sm text-white line-clamp-1 hover:text-primary transition cursor-pointer"
      >
        {title}
      </h3>

      {/* 3 Shortcut Chapter */}
      <div className="flex flex-col gap-1.5 mt-2">
        {chapters.slice(0, 3).map((ch) => (
          <button
            key={ch.chapter_id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: '/chapter/$chapterId', params: { chapterId: ch.chapter_id } });
            }}
            className="w-full bg-[#182030]/80 hover:bg-primary/20 border border-white/5 hover:border-primary/40 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs transition cursor-pointer"
          >
            <span className="font-semibold text-slate-200">Ch. {ch.chapter_number}</span>
            <span className="text-[11px] text-slate-400">{formatRelativeTime(ch.created_at)}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
  ```

### 4.4 GenreSection (`src/features/manga/components/sections/GenreSection.tsx`) & GenreComicCard
- **Genre Pills**: Baris horizontal genre populer (*Action, Romance, Fantasy, Comedy, Isekai, Adventure, dll.*) dengan scroll halus `overflow-x-auto`.
- **Query**: TanStack Query `useQuery` via `trpcClient.manga.getComicByGenres.query({ genres: [selectedGenre], pageSize: 12 })` dengan cache 5 menit.
- **Responsive Grid**:
  - Layar sangat kecil (< sm): `grid-cols-2`
  - Layar sm: `sm:grid-cols-3`
  - Layar md: `md:grid-cols-4`
  - Layar lg: `lg:grid-cols-5`
  - Layar besar (xl+): `xl:grid-cols-6` (menghindari ukuran kartu terlalu besar di monitor lebar)
- **Card Design**:
  - Cover dominan dengan sudut membulat `rounded-xl aspect-[3/4.2]`.
  - Informasi halus pada gambar: Rating bintang di sudut kanan atas dan chapter `Ch. XX` di sudut kiri bawah.
  - Judul di bawah cover: `text-xs sm:text-sm font-semibold line-clamp-2 text-white group-hover:text-primary transition-colors`.
  - Tanpa nomor ranking `#1, #2` atau dekorasi span berlebih sesuai preferensi pengguna.

