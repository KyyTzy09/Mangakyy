import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BookOpen, ChevronRight, Clock, Flame, Heart, Library, Sparkles, Star, Zap } from 'lucide-react'
import { motion } from 'motion/react'

export const Route = createFileRoute('/')({
  component: App
})

function App() {
  const navigate = useNavigate()

  const features = [
    {
      icon: BookOpen,
      title: "Koleksi Besar",
      desc: "Ribuan manga, manhwa, dan manhua tersedia dalam satu tempat."
    },
    {
      icon: Zap,
      title: "Update Cepat",
      desc: "Chapter terbaru selalu hadir secepat mungkin."
    },
    {
      icon: Heart,
      title: "Favorit & Bookmark",
      desc: "Simpan komik favorit agar tidak kehilangan progress."
    },
    {
      icon: Clock,
      title: "Baca Kapan Saja",
      desc: "Akses dari HP atau laptop tanpa batas."
    }
  ]

  const genres = [
    { name: "Action", icon: Flame },
    { name: "Romance", icon: Heart },
    { name: "Fantasy", icon: Sparkles },
    { name: "Comedy", icon: Star },
    { name: "Mystery", icon: Library },
    { name: "Slice of Life", icon: BookOpen }
  ]

  const stats = [
    { value: "12K+", label: "Judul Manga" },
    { value: "60K+", label: "Chapter" },
    { value: "100K+", label: "Readers" },
    { value: "Daily", label: "Update" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-20">

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">

        {/* glow background */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute w-[500px] h-[500px] bg-primary/20 blur-3xl rounded-full -top-20 -left-20"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-3xl rounded-full bottom-0 right-0"
          />
        </div>

        <div className="relative z-10 max-w-5xl text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 border border-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold">
                MangaKyy Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Temukan Dunia Manga
              <br />
              <span className="text-primary">
                di MangaKyy
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              Platform membaca manga, manhwa, dan manhua dengan ribuan koleksi
              dan update chapter terbaru setiap hari.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate({ to: "/home" })}
                className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl font-semibold flex items-center gap-2"
              >
                Mulai Membaca
                <ChevronRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate({ to: "/explore" })}
                className="px-8 py-4 border border-gray-700 rounded-xl hover:bg-gray-800"
              >
                Explore Komik
              </motion.button>

            </div>
          </motion.div>


          {/* stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">

            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-gray-900/60 border border-gray-800 rounded-xl p-6"
              >
                <div className="text-3xl font-bold text-primary">
                  {s.value}
                </div>
                <div className="text-sm text-gray-400">
                  {s.label}
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>



      {/* FEATURES */}
      <section className="py-24 px-6 min-h-screen">

        <div className="max-w-6xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-16">
            Kenapa MangaKyy?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-gray-800 bg-gray-900/60 hover:bg-gray-800 transition"
              >

                <f.icon className="w-10 h-10 text-primary mb-4" />

                <h3 className="font-bold text-lg mb-2">
                  {f.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {f.desc}
                </p>

              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* GENRE */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-900/30">
        <div className="container mx-auto max-w-7xl">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Genre Populer
            </h2>
            <p className="text-gray-400">
              Temukan manga dari berbagai genre favorit
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {genres.map((genre, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  navigate({
                    to: "/explore",
                    search: { genre: genre.name.toLowerCase() },
                  })
                }
                className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 rounded-xl p-6 transition-all font-semibold text-white flex items-center justify-center gap-2"
              >
                <genre.icon className="w-5 h-5" />
                {genre.name}
              </motion.button>
            ))}
          </div>

        </div>
      </section>



      {/* CTA */}
      <section className="py-24 px-6">

        <div className="max-w-3xl mx-auto text-center bg-gray-900 border border-gray-800 rounded-3xl p-12">

          <Star className="w-14 h-14 text-yellow-400 mx-auto mb-6" />

          <h2 className="text-4xl font-bold mb-4">
            Mulai Petualangan Membaca
          </h2>

          <p className="text-gray-400 mb-8">
            Temukan manga favoritmu dan nikmati ribuan chapter gratis di MangaKyy.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate({ to: "/home" })}
            className="px-10 py-4 bg-primary rounded-xl font-semibold flex items-center gap-2 mx-auto"
          >
            Buka MangaKyy
            <ChevronRight className="w-5 h-5" />
          </motion.button>

        </div>

      </section>

    </div>
  )
}

