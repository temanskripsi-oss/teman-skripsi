import type { Metadata } from 'next'
import ProductHero from '@/components/product/ProductHero'
import FAQ from '@/components/product/FAQ'
import { MapPin, Wifi, FileText, Video, Check, Gift, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentoring Privat Sempro | Teman Skripsi',
  description: 'Bimbingan 1-on-1 dari judul sampai proposal ACC. 9 pertemuan, 3 bulan masa aktif.',
}

const faqs = [
  { q: 'Apakah bisa full online?', a: 'Untuk klien di luar Bandar Lampung, semua 9 pertemuan bisa dilakukan secara online via Zoom.' },
  { q: 'Bagaimana jadwal offline-nya?', a: 'Untuk klien di Bandar Lampung, 3 pertemuan offline dilakukan di lokasi yang disepakati bersama mentor.' },
  { q: 'Apa yang terjadi kalau belum selesai dalam 3 bulan?', a: 'Tim kami akan evaluasi progres dan memberikan solusi terbaik sesuai kondisi.' },
  { q: 'Siapa mentornya?', a: 'Mentor kami adalah alumni berprestasi yang sudah membantu 340+ mahasiswa lulus.' },
  { q: 'Boleh ganti topik di tengah program?', a: 'Boleh, selama masih dalam masa aktif 3 bulan dan progres dapat dikejar.' },
]

const includedFastTrack = [
  'Video learning Fast Track Sempro (30+ materi)',
  'Template proposal Bab 1, 2, 3',
  'Template PPT Sempro profesional',
  '100+ contoh judul ACC semua jurusan',
  'Research gap framework eksklusif',
  'Prompt AI khusus untuk skripsi',
  'Script konsultasi ke dosen pembimbing',
  'Checklist ACC judul & proposal',
]

export default function MentoringSemproPage() {
  return (
    <div className="bg-white">
      <ProductHero
        badge="Bimbingan 1-on-1 Personal"
        breadcrumb="Mentoring Privat Sempro"
        headline="Bimbingan Privat dari Judul sampai Proposal ACC"
        sub="Bukan cuma ngajarin — kami menemani. Dari yang bingung judul sampai proposal ACC, step by step bareng mentor kamu."
        price="Rp 2.000.000"
        paymentLink="/daftar/sempro"
        trusts={['9 Pertemuan Privat', '3 Bulan Masa Aktif', 'Offline + Online', '340+ Alumni']}
        accentColor="#2232dd"
        lightBg="#eff6ff"
      />

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Format bimbingan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {[
              { icon: Wifi,     title:'6x Online',          sub:'Via Zoom, fleksibel',           color:'#2232dd', bg:'#eff6ff' },
              { icon: MapPin,   title:'3x Offline',         sub:'Tatap muka Bandar Lampung',      color:'#7C6FCD', bg:'#f5f3ff' },
              { icon: FileText, title:'9x Written Feedback', sub:'Catatan & PR tiap bimbingan',   color:'#0f766e', bg:'#f0fdfa' },
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
          <div className="bg-[#eff6ff] border border-[#2232dd]/15 rounded-xl px-5 py-3.5 flex items-center gap-3">
            <Video size={16} className="text-[#2232dd] flex-shrink-0" />
            <p className="text-[#374151] text-sm">Termasuk akses video learning + semua template & freebies via dashboard</p>
          </div>
        </div>
      </section>

      {/* FREE FastTrack included */}
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
                <tr className="bg-[#eff6ff] border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left text-[#6B6B8A] font-semibold text-xs uppercase tracking-wider">Pertemuan</th>
                  <th className="px-5 py-3.5 text-left text-[#6B6B8A] font-semibold text-xs uppercase tracking-wider">Format</th>
                  <th className="px-5 py-3.5 text-left text-[#6B6B8A] font-semibold text-xs uppercase tracking-wider">Materi</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { no:'1', materi:'Orientasi, diskusi topik, penentuan judul' },
                  { no:'2', materi:'Review & finalisasi judul, mulai Bab 1' },
                  { no:'3', materi:'Review Bab 1, mulai Bab 2 kajian pustaka' },
                  { no:'4', materi:'Review Bab 2, mulai Bab 3 metodologi' },
                  { no:'5', materi:'Review Bab 3, finalisasi proposal' },
                  { no:'6', materi:'Review akhir, persiapan sempro' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-3.5 text-[#2232dd] font-semibold text-xs">Pertemuan {row.no}</td>
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
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2232dd] rounded-full blur-[140px] opacity-15 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Mulai bimbingan personalmu</h2>
          <p className="text-white/50 mb-8">Tempat terbatas. Daftar sekarang sebelum slot penuh.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-2xl font-bold text-white">Rp 2.000.000</p>
            <a href="#" className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1E1B4B] font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              Mulai Bimbingan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
