import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import type { TRPCRouter } from '@/integrations/trpc/router'
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import Navbar from '@/shared/components/layouts/navbar'
import { Activity } from 'react'
import SmallNavbar from '@/shared/components/layouts/SmallNavbar'
import Footer from '@/shared/components/layouts/footer'

interface MyRouterContext {
  queryClient: QueryClient

  trpc: TRPCOptionsProxy<TRPCRouter>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Mangakyy - Baca Manga, Manhwa, dan Manhua Gratis & Terupdate",
      },
      {
        name: "description",
        content:
          "Mangakyy adalah platform untuk membaca manga, manhwa, dan manhua gratis dengan update cepat dan koleksi lengkap. Temukan berbagai genre seperti action, romance, fantasy, dan banyak lagi dengan kualitas terbaik.",
      },
      {
        name: "keywords",
        content:
          "manga, manhwa, manhua, baca manga online, manga gratis, manhwa gratis, manhua gratis, komik online, mangakyy",
      },
      {
        name: "author",
        content: "Mangakyy",
      },
      {
        name: "robots",
        content: "index, follow",
      },

      // Open Graph (buat preview Discord, Facebook, dll)
      {
        property: "og:title",
        content: "Mangakyy - Baca Manga, Manhwa, dan Manhua Gratis",
      },
      {
        property: "og:description",
        content:
          "Baca manga, manhwa, dan manhua gratis dengan update terbaru dan koleksi lengkap hanya di Mangakyy.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: "Mangakyy",
      },
      {
        property: "og:image",
        content: "/mangakyy-logo.png"
      },
      {
        property: "og:url",
        content: "https://mangakyy.com",
      },

      // Twitter card
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Mangakyy - Baca Manga, Manhwa, dan Manhua Gratis",
      },
      {
        name: "twitter:description",
        content:
          "Platform baca manga, manhwa, dan manhua gratis dengan update cepat dan kualitas terbaik.",
      },
      {
        name: "twitter:image",
        content: "/mangakyy-logo.png"
      },
      {
        name: "twitter:url",
        content: "https://mangakyy.com",
      }
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-black/95 min-h-screen pb-16 md:pb-0">
        <Navbar />
        <TanStackQueryProvider>
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </TanStackQueryProvider>
        <Footer />
        <SmallNavbar />
        <Scripts />
      </body>
    </html>
  )
}
