# MangaKyy - Platform Pembaca Manga

## 📖 Deskripsi

**MangaKyy** adalah aplikasi web modern untuk membaca dan menjelajahi koleksi manga dengan antarmuka yang responsif dan user-friendly. Aplikasi ini menyediakan pengalaman membaca manga yang optimal dengan berbagai fitur seperti pencarian, filter genre, dan rekomendasi yang dipersonalisasi.

## 🛠️ Tech Stack

### Frontend
- **React 19** - Library UI dengan fitur terbaru
- **TypeScript** - Type-safe JavaScript untuk development yang lebih robust
- **Vite** - Build tool dan dev server yang cepat
- **TanStack Router** - Router modern dengan type-safe routing
- **TanStack React Query** - Data fetching dan caching yang powerful
- **tRPC** - End-to-end typesafe API dengan TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **Nitro** - Fullstack framework untuk backend
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Icon library
- **Motion** - Animation library
- **Axios** - HTTP client

### Development Tools
- **ESLint** - Code linting dengan TanStack config
- **Prettier** - Code formatter
- **Vitest** - Unit testing framework
- **React Testing Library** - Testing utilities untuk React

## ✨ Fitur-Fitur Utama

### 1. **Jelajahi Manga**
   - Tampilkan daftar manga dengan infinite scroll
   - Pencarian manga berdasarkan judul
   - Filter berdasarkan genre manga
   - Layout switcher (grid/list)

### 2. **Manga Detail**
   - Informasi lengkap manga (judul, cover, deskripsi, rating)
   - Statistik manga (status, total chapter, dll)
   - Tag/genre yang terkait
   - Rekomendasi manga serupa

### 3. **Manajemen Chapter**
   - Navigasi antar chapter dengan pagination
   - Riwayat pembacaan (chapter history)
   - Dropdown selector untuk quick navigation
   - Pagination controls yang intuitif

### 4. **Genre Filter**
   - Dropdown filter genre yang interaktif
   - Section pencarian genre
   - Menampilkan genre yang dipilih
   - Toggle multiple genres

### 5. **Koleksi & Kategori**
   - **Home** - Beranda dengan konten unggulan
   - **Popular** - Manga paling popular
   - **Latest** - Update manga terbaru
   - **Update** - Tracking manga updates
   - **Explore** - Penjelajahan manga lengkap

### 6. **SEO Optimization**
   - Generate sitemap.xml dinamis
   - robots.txt configuration
   - Meta tags optimization

### 7. **Carousel & Layout**
   - Carousel sections untuk featured content
   - Multiple card layouts (regular, large)
   - Skeleton loading untuk UX lebih baik

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js >= 16
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd mangakyy/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables** (jika diperlukan)
   ```bash
   cp .env.example .env.local
   # Edit .env.local dengan konfigurasi Anda
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```
   
   Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Struktur Project

```
src/
├── api/                    # API integration layer
│   ├── server/            # Server-side API handlers
│   ├── service/           # API services (Shinigami)
│   └── trpc/              # tRPC routers
├── features/              # Feature modules
│   ├── chapter/           # Chapter reading feature
│   ├── genre/             # Genre filtering feature
│   └── manga/             # Manga listing & details
├── integrations/          # Third-party integrations
│   ├── tanstack-query/    # React Query setup
│   └── trpc/              # tRPC client configuration
├── lib/                   # Utility libraries
├── routes/                # TanStack Router pages
├── shared/                # Shared components & utilities
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── http/              # HTTP client setup
│   ├── interfaces/        # TypeScript interfaces
│   ├── schemas/           # Zod schemas
│   ├── shadcn/            # Shadcn UI components
│   └── utils/             # Helper functions
└── styles.css             # Global styles
```

## 💻 Scripts Pengembangan

### Development
```bash
# Jalankan dev server dengan hot reload
npm run dev
```

### Building
```bash
# Build untuk production
npm run build

# Preview hasil build
npm run preview
```

### Code Quality
```bash
# Run linting
npm run lint

# Check formatting dengan Prettier
npm run format

# Fix linting dan formatting issues
npm run check
```

### Testing
```bash
# Run unit tests
npm run test
```

## 🔧 Konfigurasi

### Vite Configuration
- Custom import alias menggunakan `#/*` untuk path `src/*`
- TanStack Router devtools terintegrasi
- Tailwind CSS dengan build tools terbaru
- Nitro backend integration

### TypeScript Configuration
- Strict mode enabled
- Path mapping untuk imports yang lebih clean
- Module resolution dengan ES modules

### Tailwind CSS
- Menggunakan Tailwind CSS v4 dengan Vite plugin
- Custom components dan utilities di `src/shared/shadcn/`
- Tailwind merge untuk class conflict resolution

## 🌐 API Integration

### tRPC Setup
- **Base Router**: `src/integrations/trpc/router.ts`
- **React Integration**: `src/integrations/trpc/react.ts`
- **Client Init**: `src/integrations/trpc/init.ts`

### Routes tRPC
- `chapter` - Chapter endpoints
- `genre` - Genre endpoints
- `manga` - Manga endpoints

### HTTP Client
- Axios instance di `src/shared/http/apiClient.ts`
- Header configuration di `src/shared/http/headerApi.ts`
- Base URL management otomatis

## 📊 Data Fetching

Aplikasi menggunakan **TanStack React Query** untuk:
- Caching data yang efficient
- Automatic refetching
- Optimistic updates
- Error handling
- Loading states

Custom hooks untuk data fetching:
- `chapterQuery.ts` - Chapter data fetching
- `MangaQuery.ts` - Manga data fetching
- `useSelectGenre.ts` - Genre selection logic

## 🎨 UI Components

### Shadcn Components
- Button
- Input
- Label
- Badge
- Separator

### Custom Components
- Navigation (Navbar, SmallNavbar, Footer)
- Cards (MangaCard, ChapterCard, DetailCard, dll)
- Pagination
- Selector
- Carousel sections
- Skeleton loaders

## 🔐 Validasi

Menggunakan **Zod** untuk schema validation:
- `src/shared/schemas/shinigami.scema.ts` - Shinigami API validation
- Type-safe form validation
- Runtime data validation

## 🚢 Deployment

### Build untuk Production
```bash
npm run build
```

Output akan berada di folder `dist/`

### Platform Deployment
Aplikasi dapat di-deploy ke:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Docker containers
- VPS/Dedicated servers

**Persyaratan minimal:**
- Node.js 16+
- npm atau package manager lain

## 📱 Responsiveness

Aplikasi fully responsive dengan:
- Mobile-first design approach
- Breakpoints: sm, md, lg, xl
- Flexible navigation (SmallNavbar untuk mobile)
- Touch-friendly interactive elements

## 🎯 Best Practices

- ✅ TypeScript strict mode
- ✅ Component-driven development
- ✅ Custom hooks untuk reusable logic
- ✅ Efficient caching dengan React Query
- ✅ SEO optimization
- ✅ Performance monitoring dengan devtools
- ✅ Code formatting dengan Prettier
- ✅ Linting dengan ESLint

## 🔄 Development Workflow

1. **Feature Development**
   ```bash
   npm run dev
   # Edit di src/
   # Hot reload otomatis
   ```

2. **Code Quality Check**
   ```bash
   npm run lint      # Check linting issues
   npm run format    # Check formatting issues
   npm run check     # Fix both issues
   ```

3. **Testing**
   ```bash
   npm run test
   ```

4. **Build & Deploy**
   ```bash
   npm run build
   # Test production build
   npm run preview
   ```

## 📚 Resource Links

- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [React Query Documentation](https://tanstack.com/query/latest)
- [tRPC Documentation](https://trpc.io)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Zod Documentation](https://zod.dev)
- [Vite Documentation](https://vitejs.dev)

## 🐛 Troubleshooting

### Dev server tidak berjalan
```bash
# Clear node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build error
```bash
# Clear build cache
rm -rf dist/
npm run build
```

### Import path error
```bash
# Verify tsconfig.json path mapping
# Paths harus sesuai dengan vite config
```

## 📝 Environment Variables

Contoh `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=MangaKyy
```

## 👨‍💻 Kontribusi

Untuk berkontribusi:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 Lisensi

Project ini berlisensi di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Support

Untuk pertanyaan atau issue, silakan buat GitHub issue atau hubungi tim development.

---

**Last Updated**: March 2026  
**Version**: 1.0.0
