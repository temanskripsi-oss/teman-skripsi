import type { Metadata } from 'next'
import ProductHero from '@/components/product/ProductHero'
import FAQ from '@/components/product/FAQ'
import { MapPin, Wifi, FileText, Video, Check, Gift, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentoring Privat Bab 4–5 | Teman Skripsi',
  description: 'Analisis data sampai sidang skripsi. 9 pertemuan personal, 3 bulan masa aktif.',
}

const faqs = [
  { q: 'Apakah perlu sudah punya data sebelum mulai?', a: 'Idealnya sudah punya data atau sedang dalam proses pengumpulan. Mentor akan membantu dari analisis hingga interpretasi.' },
  { q: 'Software analisis apa yang didukung?', a: 'SPSS, SmartPLS, Amos, Excel, dan tools lainnya sesuai metodologi penelitianmu.' },
  { q: 'Apakah termasuk persiapan sidang?', a: 'Ya! Pertemuan terakhir khusus untuk simulasi sidang, latihan menjawab pertanyaan penguji.' },
  { q: 'Harus sudah sempro dulu?', a: 'Tidak harus. Yang penting proposal sudah ACC dan kamu siap masuk ke tahap penelitian.' },
  { q: 'Berapa lama dari Bab 4 sampai sidang?', a: 'Dengan bimbingan intensif, rata-rata 2–3 bulan. Beberapa alumni berhasil dalam 6 minggu.' },
]

const includedFastTrack = [
  'Video learning Fast Track Sempro (30+ materi)',
  'Template proposal Bab 1, 2, 3',
  'Template PPT Sempro profesional',
  '100+ contoh judul ACC semua jurusan',
  'Research gap framework eksklusif',
  'Prompt AI khusus untuk skripsi',
  'Script konsultasi ke dosen pembimbing',
  'Database 300+ jurnal skripsi terpercaya',
]

export default function MentoringPenelitianPage() {
  return (
    <div className="bg-white">
      <ProductHero
        badge="Analisis Data sampai Sidang"
        breadcrumb="Mentoring Privat Bab 4–5"
        headline="Udah Sempro? Sekarang Saatnya Kelar — Bab 4, 5, dan Sidang"
        sub="Data sudah ada, tapi bingung ngolahnya? Kami bantu dari analisis sampai kamu berdiri percaya diri di depan dewan penguji."
        price="Rp 2.250.000"
        paymentLink="#"
        trusts={['9 Pertemuan Personal', '3 Bulan Masa Aktif', 'Simulasi Sidang', '340+ Alumni']}
        accentColor="#0f766e"
        lightBg="#f0fdfa"
      />

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Format bimbingan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { icon: Wifi,     title:'6x Online',          sub:'Via Zoom, fleksibel',           color:'#0f766e', bg:'#f0fdfa' },
              { icon: MapPin,   title:'3x Offline',         sub:'Tatap muka Bandar Lampung',      color:'#7C6FCD', bg:'#f5f3ff' },
              { icon: FileText, title:'9x Written Feedback', sub:'Catatan & PR tiap bimbingan',   color:'#2232dd', bg:'#eff6ff' },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: f.bg, color: f.color }}>
                    <Icon size={22} />
                  </div>
                  <p className="text-xl font-bold text-[#1E1B4B] mb-1">{f.title}</p>
                  <p className="text-[#9CA3AF] text-sm">{f.sub}</p>
                </div>
              )
            })}
          </div>
          <div className="bg-[#f0fdfa] border border-[#0f766e]/15 rounded-xl px-5 py-3.5 flex items-center gap-3">
            <Video size={16} className="text-[#0f766e] flex-shrink-0" />
            <p className="text-[#374151] text-sm">Termasuk akses video learning + semua template & freebies via dashboard</p>
          </div>
        </div>
      </section>

      {/* FREE FastTrack */}
      <section className="py-16 px-4 bg-[#f0fdf4]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#16a34a] text-white text-sm font-bold px-5 py-2 rounded-full mb-5">
              <Gift size={15} />
              Bonus: FREE Akses Full Fast Track Sempro
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1B4B] mb-2">
              Selain 9 pertemuan privat, kamu juga dapat:
            </h2>
            <p className="text-[#6B6B8A] text-sm">Senilai Rp 500.000 — GRATIS untuk kamu</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {includedFastTrack.map((item, i) => (
              <div key={i} className="bg-white border border-green-100 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                <Check size={15} className="text-[#16a34a] flex-shrink-0" />
                <p className="text-[#374151] text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#f4f8ff]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Jadwal bimbingan</h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm bg-white">
              <thead>
                <tr className="bg-[#f0fdfa] border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left text-[#6B6B8A] font-semibold text-xs uppercase tracking-wider">Pertemuan</th>
                  <th className="px-5 py-3.5 text-left text-[#6B6B8A] font-semibold text-xs uppercase tracking-wider">Format</th>
                  <th className="px-5 py-3.5 text-left text-[#6B6B8A] font-semibold text-xs uppercase tracking-wider">Materi</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { no:'1', materi:'Review proposal, persiapan pengumpulan data' },
                  { no:'2', materi:'Analisis data awal, pemilihan tools yang tepat' },
                  { no:'3', materi:'Interpretasi hasil analisis, penulisan Bab 4' },
                  { no:'4', materi:'Review Bab 4, mulai penulisan Bab 5' },
                  { no:'5', materi:'Finalisasi Bab 5, kesimpulan & saran' },
                  { no:'6', materi:'Simulasi sidang, latihan Q&A dewan penguji' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-3.5 text-[#0f766e] font-semibold text-xs">Pertemuan {row.no}</td>
                    <td className="px-5 py-3.5 text-[#9CA3AF] text-xs">Offline/Online</td>
                    <td className="px-5 py-3.5 text-[#374151] text-xs">{row.materi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FAQ items={faqs} />

      <section className="py-16 px-4 bg-[#1E1B4B] relative overflow-hidden text-center">
        <div className="absolute inset-0 grid-bg-dark pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0f766e] rounded-full blur-[140px] opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Saatnya selesaikan skripsimu</h2>
          <p className="text-white/50 mb-8">Dari analisis data sampai sidang — kamu nggak sendirian.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-2xl font-bold text-white">Rp 2.250.000</p>
            <a href="#" className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1E1B4B] font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              Mulai Bimbingan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
