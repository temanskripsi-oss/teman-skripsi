import Image from 'next/image'
import { Globe, BookOpen, Users, Presentation } from 'lucide-react'

const PHOTOS = [
  { src: '/images/malaysia/foto-1.jpeg', alt: 'Delegasi Unila di UiTM Malaysia' },
  { src: '/images/malaysia/foto-2.jpeg', alt: 'Collaborative Teaching Session' },
  { src: '/images/malaysia/foto-3.jpeg', alt: 'International Cross-Pollination Colloquium' },
  { src: '/images/malaysia/foto-4.jpeg', alt: 'Community Service Session' },
  { src: '/images/malaysia/foto-5.jpeg', alt: 'Foto bersama UiTM Malaysia' },
]

const HIGHLIGHTS = [
  {
    icon: Globe,
    label: 'Kunjungan Akademik Internasional',
    desc: 'Delegasi Magister Pendidikan IPA Universitas Lampung berkunjung ke UiTM Malaysia untuk memperkuat kolaborasi internasional.',
  },
  {
    icon: Presentation,
    label: 'Collaborative Teaching Session',
    desc: 'Gelar Rista mempresentasikan inovasi pembelajaran berbasis IoT kepada mahasiswa Fakultas Pendidikan UiTM Malaysia.',
  },
  {
    icon: BookOpen,
    label: 'International Cross-Pollination Colloquium',
    desc: 'Riset mahasiswa Unila dipresentasikan dan mendapat reviu akademik dari akademisi Indonesia dan Malaysia.',
  },
  {
    icon: Users,
    label: 'Community Service Session',
    desc: 'Berbagi inovasi pembelajaran Inquiry Learning Model kepada komunitas akademik internasional di UiTM Malaysia.',
  },
]

export default function MentorActivity() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#2232dd]/20 text-[#2232dd] text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
            <Globe size={13} /> Aktivitas Mentor Kami
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1E1B4B] mb-4 leading-tight">
            Mentor Kami Aktif di <span className="gradient-text-navy">Tingkat Internasional</span>
          </h2>
          <p className="text-[#9CA3AF] text-base max-w-2xl mx-auto leading-relaxed">
            Gelar Rista, mentor dan co-founder TemanSkripsi, tampil sebagai narasumber dalam program akademik internasional di UiTM Malaysia — Juni 2026.
          </p>
        </div>

        {/* Photo Grid — Editorial Style */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-14" style={{ gridTemplateRows: 'auto' }}>

          {/* Spotlight utama — besar di kiri */}
          <div className="col-span-2 md:col-span-2 relative rounded-2xl overflow-hidden" style={{ height: '420px' }}>
            <Image
              src="/images/malaysia/foto utama.jpeg"
              alt="Gelar Rista di UiTM Malaysia"
              fill
              className="object-cover object-center transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="text-white text-xs font-bold bg-[#2232dd] px-3 py-1.5 rounded-full">Collaborative Teaching Session</span>
            </div>
          </div>

          {/* Kolom kanan — 2 foto pendukung */}
          <div className="flex flex-col gap-3">
            <div className="relative rounded-2xl overflow-hidden flex-1" style={{ height: '202px' }}>
              <Image
                src="/images/malaysia/foto pendukung 1.jpeg"
                alt="Sesi akademik di UiTM Malaysia"
                fill
                className="object-cover object-center transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="relative rounded-2xl overflow-hidden flex-1" style={{ height: '202px' }}>
              <Image
                src="/images/malaysia/foto pendukung 2.jpeg"
                alt="Presentasi riset internasional"
                fill
                className="object-cover object-center transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          {/* Banner bawah — foto bersama full width */}
          <div className="col-span-2 md:col-span-3 relative rounded-2xl overflow-hidden" style={{ height: '320px' }}>
            <Image
              src="/images/malaysia/foto bersama.jpeg"
              alt="Foto bersama delegasi Universitas Lampung dan UiTM Malaysia"
              fill
              className="object-cover object-center transition-transform duration-500 hover:scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="text-white font-bold text-base md:text-lg leading-tight">Delegasi Universitas Lampung × UiTM Malaysia</p>
                <p className="text-white/70 text-xs mt-1">International Academic Collaborative Programme · 9 Juni 2026</p>
              </div>
              <span className="flex-shrink-0 text-white text-[10px] font-bold bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-full">
                Malaysia 🇲🇾
              </span>
            </div>
          </div>

        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map((h, i) => {
            const Icon = h.icon
            return (
              <div key={i} className="bg-[#f4f8ff] rounded-2xl p-5 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#2232dd]" />
                </div>
                <p className="font-bold text-[#1E1B4B] text-sm mb-1.5">{h.label}</p>
                <p className="text-[#9CA3AF] text-xs leading-relaxed">{h.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Quote */}
        <div className="mt-12 bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] rounded-3xl p-8 text-center text-white">
          <p className="text-lg font-medium leading-relaxed max-w-3xl mx-auto">
            "Melalui kegiatan ini, kami tidak hanya berbagi hasil penelitian, tetapi juga membangun ruang kolaborasi dan pertukaran pengalaman akademik yang dapat mendorong pengembangan pendidikan sains di tingkat global."
          </p>
          <p className="mt-4 text-white/70 text-sm font-semibold">— Gelar Rista, M.Pd. · Mentor & Co-founder TemanSkripsi</p>
        </div>

      </div>
    </section>
  )
}
