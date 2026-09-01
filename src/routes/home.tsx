import { getPopularManga, getRecommendationManga, getUpdateManga } from '@/api/server/manga'
import HomePage from '@/pages/home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
  component: HomePage,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Home-Mangakyy',
      },
      {
        name: 'description',
        content:
          'Mangakyy adalah platform untuk membaca manga, manhwa, dan manhua gratis dengan update cepat dan koleksi lengkap. Temukan berbagai genre seperti action, romance, fantasy, dan banyak lagi dengan kualitas terbaik.',
      },
      {
        name: 'keywords',
        content:
          'manga, manhwa, manhua, baca manga online, manga gratis, manhwa gratis, manhua gratis, komik online, mangakyy',
      },
      {
        name: 'author',
        content: 'Mangakyy',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },

      // Open Graph (buat preview Discord, Facebook, dll)
      {
        property: 'og:title',
        content: 'Home - Mangakyy',
      },
      {
        property: 'og:description',
        content:
          'Baca manga, manhwa, dan manhua gratis dengan update terbaru dan koleksi lengkap hanya di Mangakyy.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: 'Mangakyy',
      },
      {
        property: 'og:image',
        content: '/mangakyy-logo.png',
      },
      {
        property: 'og:url',
        content: 'https://mangakyy.my.id/home',
      },

      // Twitter card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'Mangakyy - Baca Manga, Manhwa, dan Manhua Gratis',
      },
      {
        name: 'twitter:description',
        content:
          'Platform baca manga, manhwa, dan manhua gratis dengan update cepat dan kualitas terbaik.',
      },
      {
        name: 'twitter:image',
        content: '/mangakyy-logo.png',
      },
      {
        name: 'twitter:url',
        content: 'https://mangakyy.my.id/home',
      },
    ],
  }),
  loader: async () => {
    const recommendation = await getRecommendationManga({
      data: { format: 'manga' },
    })
    return {
      recommendation,
      popular: await getPopularManga({ data: { type: 'all_time' } }),
      update: await getUpdateManga({ data: { type: 'project' } }),
    }
  },
})
