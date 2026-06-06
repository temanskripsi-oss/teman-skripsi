'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play, Star, Quote } from 'lucide-react'

const VIDEO_TESTIMONIALS = [
  {
    name: 'Heppy Salma',
    description: 'Alumni Mentoring Privat · Bab 4–5 · Sidang Akhir ACC',
    university: 'Polinela Lampung',
    quote: 'Bab 4 dan 5 itu yang paling bikin pusing — ngolah data, nulis pembahasan, takut salah. Sama TemanSkripsi semuanya jadi lebih jelas. Mentor nemenin dari awal sampai akhirnya sidang ACC. Alhamdulillah, nggak nyangka bisa secepet ini.',
    videoId: 'z8_bcAJV4hY',
    thumbnail: '/images/testimonial-heppy-salma.jpg',
  },
  {
    name: 'Alin Permatasari',
    description: 'Alumni Mentoring Privat · Sidang Akhir ACC',
    university: 'UIN Raden Intan Lampung',
    quote: 'Jujur gua udah pasrah. Hampir 2 tahun stuck di bab 3, ngerasa kayak udah mentok. Pas ikut Mentoring Privat TemanSkripsi, mentor gua nemenin step by step sampai akhirnya sidang ACC. Nggak nyangka bisa secepet ini.',
    videoId: '',
  },
  {
    name: 'Fijira Pasya',
    description: 'Alumni Mentoring Privat · Sidang Akhir ACC',
    university: 'Universitas Lampung',
    quote: 'Yang bikin beda itu mentornya sabar banget, nggak ngerasa dihakimi pas nanya hal yang sama berkali-kali. Bimbingan offline-nya juga ngebantu banget, bisa langsung tunjuk-tunjuk bagian yang bingung.',
    videoId: '',
  },
  {
    name: 'Nadila Kurnia Sari',
    description: 'Alumni Mentoring Privat · Sidang Akhir ACC',
    university: 'UIN Raden Intan Lampung',
    quote: 'Awalnya takut banget ikut mentoring karena takut mahal tapi nggak hasil. Ternyata dalam 6 minggu skripsi gua udah selesai dan langsung sidang. Worth it banget, nyesel kenapa nggak dari dulu.',
    videoId: '',
  },
]

const CARD_TESTIMONIALS = [
  {
    name: 'Reza Pratama',
    university: 'Universitas Lampung',
    quote: 'Awalnya udah hampir DO, nunda 2 tahun lebih. Setelah ikut mentoring, 3 bulan skripsi selesai dan langsung sidang. Beneran berasa punya teman yang nemenin perjalanan.',
    initials: 'RP',
  },
  {
    name: 'Sari Dewi',
    university: 'Universitas Bandar Lampung',
    quote: 'Fast Track 30 harinya gila efektif. Dari yang bingung mau nulis apa, dalam sebulan proposal udah ACC. Mentor sabar banget njelasinnya step by step.',
    initials: 'SD',
  },
  {
    name: 'Dimas Arya',
    university: 'Institut Teknologi Sumatera',
    quote: 'Yang paling beda mentornya beneran jadi temen, bukan kayak dosen yang bikin takut. Gua jadi lebih percaya diri tiap bimbingan sama dosen kampus.',
    initials: 'DA',
  },
  {
    name: 'Mitha Aulia',
    university: 'UIN Raden Intan Lampung',
    quote: 'Bab 1–3 selesai dalam 3 minggu. Yang biasanya makan waktu berbulan-bulan. Mentor TemanSkripsi beneran tahu cara bikin skripsi jadi tidak seseram yang gua bayangin.',
    initials: 'MA',
  },
  {
    name: 'Bagas Wicaksono',
    university: 'Universitas Gadjah Mada',
    quote: 'Ikut Fastrack dan dalam sebulan proposal gua udah di-ACC dosen. Materinya lengkap, mentornya responsif, dan sistemnya beneran bikin progres.',
    initials: 'BW',
  },
  {
    name: 'Lina Rahayu',
    university: 'Universitas Diponegoro',
    quote: 'Sempro ACC pertama kali tanpa revisi besar. Mentor gua kasih feedback yang sangat spesifik dan actionable. Highly recommend buat yang lagi stuck.',
    initials: 'LR',
  },
]

export default function VideoTestimonials() {
  const [activeVideo, setActiveVideo] = useState(0)
  const [playing, setPlaying]         = useState(false)
  const [cardPage, setCardPage]       = useState(0)

  const t = VIDEO_TESTIMONIALS[activeVideo]
  const cardsPerPage = 3
  const totalPages   = Math.ceil(CARD_TESTIMONIALS.length / cardsPerPage)
  const visibleCards = CARD_TESTIMONIALS.slice(cardPage * cardsPerPage, cardPage * cardsPerPage + cardsPerPage)

  const prevVideo = () => { setActiveVideo(i => (i - 1 + VIDEO_TESTIMONIALS.length) % VIDEO_TESTIMONIALS.length); setPlaying(false) }
  const nextVideo = () => { setActiveVideo(i => (i + 1) % VIDEO_TESTIMONIALS.length); setPlaying(false) }

  return (
    <section className="py-20 px-4 bg-[#f4f8ff]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#2232dd] text-xs font-bold uppercase tracking-widest mb-4 block">Kisah Sukses Alumni</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E1B4B] leading-tight">
            Mereka Dulu Nyangkut Skripsi.<br className="hidden md:block" />
            <span className="text-[#2232dd]">Sekarang Udah Wisuda.</span>
          </h2>
        </div>

        {/* Video + Quote */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-14">
          {/* Video */}
          <div className="w-full md:w-[46%] flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-[#1E1B4B] shadow-xl group cursor-pointer"
              onClick={() => t.videoId && setPlaying(true)}>
              {playing && t.videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${t.videoId}?autoplay=1&playsinline=1`}
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <>
                  {'thumbnail' in t && t.thumbnail ? (
                    <Image src={(t as typeof t & { thumbnail: string }).thumbnail} alt={t.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 46vw" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2232dd]/80 to-[#1E1B4B]" />
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={24} className="text-[#2232dd] ml-1" fill="#2232dd" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quote */}
          <div className="flex-1">
            <div className="text-5xl text-[#2232dd] font-serif leading-none mb-4 select-none">"</div>
            <span className="text-[#2232dd] text-xs font-bold uppercase tracking-widest mb-3 block">Alumni Kami</span>
            <h3 className="text-2xl font-bold text-[#1E1B4B] mb-1">{t.name}</h3>
            <p className="text-[#9CA3AF] text-sm mb-5">{t.description} · {t.university}</p>
            <p className="text-[#374151] text-base leading-relaxed mb-8">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <button onClick={prevVideo} className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-[#2232dd] hover:bg-[#eff6ff] flex items-center justify-center transition-all cursor-pointer">
                <ChevronLeft size={18} className="text-[#6B6B8A]" />
              </button>
              <button onClick={nextVideo} className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:border-[#2232dd] hover:bg-[#eff6ff] flex items-center justify-center transition-all cursor-pointer">
                <ChevronRight size={18} className="text-[#6B6B8A]" />
              </button>
              <span className="text-[#9CA3AF] text-xs ml-2">{activeVideo + 1} / {VIDEO_TESTIMONIALS.length}</span>
            </div>
          </div>
        </div>

        {/* Card Testimonials Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {visibleCards.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                <p className="text-[#374151] text-sm leading-relaxed flex-1">"{c.quote}"</p>
                <div className="border-t border-gray-50 pt-4">
                  <p className="text-[#2232dd] font-semibold text-sm">{c.name}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#f59e0b" className="text-[#f59e0b]" />)}
                  </div>
                </div>
                <Quote size={28} className="text-gray-100 self-end -mt-2" />
              </div>
            ))}
          </div>

          {/* Card nav + button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCardPage(p => Math.max(0, p - 1))}
                disabled={cardPage === 0}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-[#2232dd] hover:bg-[#eff6ff] flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft size={16} className="text-[#6B6B8A]" />
              </button>
              <button
                onClick={() => setCardPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={cardPage === totalPages - 1}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-[#2232dd] hover:bg-[#eff6ff] flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronRight size={16} className="text-[#6B6B8A]" />
              </button>
            </div>
            <a href="https://wa.me/6289524785477" target="_blank" rel="noopener noreferrer"
              className="bg-[#2232dd] hover:bg-[#1a28b8] text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all cursor-pointer">
              Lihat Semua Cerita Alumni
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
