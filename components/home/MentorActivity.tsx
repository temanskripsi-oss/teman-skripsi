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

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-14 rounded-3xl overflow-hidden">
          <div className="col-span-2 md:col-span-2 row-span-2 relative aspect-[4/3] bg-[#e8eeff]">
            <div className="absolute inset-0 flex items-center justify-center text-[#2232dd]/20 text-sm font-medium">
              Foto segera hadir
            </div>
          </div>
          <div className="relative aspect-square bg-[#f0fdf4]">
            <div className="absolute inset-0 flex items-center justify-center text-[#16a34a]/20 text-xs font-medium">Foto</div>
          </div>
          <div className="relative aspect-square bg-[#fdf4ff]">
            <div className="absolute inset-0 flex items-center justify-center text-[#7C6FCD]/20 text-xs font-medium">Foto</div>
          </div>
          <div className="col-span-2 md:col-span-3 relative h-52 bg-[#fff7ed]">
            <div className="absolute inset-0 flex items-center justify-center text-[#ea580c]/20 text-sm font-medium">
              Foto kegiatan bersama delegasi UiTM Malaysia
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
