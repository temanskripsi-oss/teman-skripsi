import type { Metadata } from 'next'
import HeroProgram from '@/components/program/HeroProgram'
import QuickStats from '@/components/program/QuickStats'
import StickyNavTabs from '@/components/program/StickyNavTabs'
import StickyPricingCard from '@/components/program/StickyPricingCard'
import MentorSection from '@/components/program/MentorSection'
import FAQ from '@/components/product/FAQ'
import TestimonialSection from '@/components/product/TestimonialSection'
import { MapPin, Wifi, FileText, Video, Check, Gift, ArrowRight, Users, Clock, FlaskConical } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentoring Privat Sidang Akhir (Bab 4–5) | Teman Skripsi',
  description: 'Analisis data sampai sidang skripsi. 9 pertemuan privat, 3 bulan masa aktif.',
}

const ACCENT = '#0f766e'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'mentor', label: 'Mentor' },
  { id: 'testimoni', label: 'Testimoni' },
  { id: 'faq', label: 'FAQ' },
]

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
      <HeroProgram
        badge="Mentoring Privat · Sidang Akhir"
        breadcrumb="Mentoring Privat Sidang Akhir"
        headline="Udah Sempro? Sekarang Saatnya Selesaiin Bab 4-5 sampai ACC Sidang Akhir"
        sub="Data sudah ada, tapi bingung ngolahnya? Kami bantu dari analisis data, penulisan Bab 4-5, sampai kamu siap sidang akhir dan resmi ACC di depan dewan penguji."
        price="Rp 2.250.000"
        paymentLink="/daftar/penelitian"
        trusts={['9 Pertemuan Privat', '3 Bulan Masa Aktif', 'Simulasi Sidang', '1.200+ Alumni']}
        accentColor={ACCENT}
        lightBg="#f0fdfa"
        testimonial={{ quote: 'Simulasi sidang bener-bener ngubah confidence aku. Pertanyaan penguji udah aku antisipasi semua.', name: 'Fijira Pasya', university: 'Universitas Lampung' }}
        photo="/graduates/Hero Bimbingan penelitian.jpeg"
      />

      <QuickStats stats={[
        { display: '1-on-1', label: 'Privat' },
        { display: 'Zoom + Offline', label: 'Format Bimbingan' },
        { display: 'ACC Sidang Akhir', label: 'Target Program' },
        { value: 1200, suffix: '+', label: 'Alumni' },
      ]} />

      <StickyNavTabs tabs={tabs} accentColor={ACCENT} />

      <section className="py-16 px-4 bg-[#f4f8ff]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-10">
          <div className="flex flex-col gap-16">
            <div id="overview" className="scroll-mt-32">
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
              <div className="bg-white border border-[#0f766e]/15 rounded-xl px-5 py-3.5 flex items-center gap-3">
                <Video size={16} className="text-[#0f766e] flex-shrink-0" />
                <p className="text-[#374151] text-sm">Termasuk akses video E-Learning + semua template & freebies via dashboard</p>
              </div>

              {/* FREE FastTrack */}
              <div className="mt-10 bg-[#f0fdf4] rounded-2xl border border-green-100 p-6 sm:p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-[#16a34a] text-white text-sm font-bold px-5 py-2 rounded-full mb-5">
                    <Gift size={15} />
                    Bonus: FREE Akses Full Fast Track Sempro
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1E1B4B] mb-2">
                    Selain 9 pertemuan privat, kamu juga dapat:
                  </h3>
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
            </div>

            <div id="mentor" className="scroll-mt-32">
              <MentorSection accentColor={ACCENT} embedded />
            </div>

            <div id="testimoni" className="scroll-mt-32">
              <TestimonialSection accentColor={ACCENT} embedded testimonials={[
                { quote: 'Data SPSS gue yang berantakan akhirnya bisa diinterpretasi dengan benar. Mentor bantu step by step sampai Bab 4 dan 5 selesai dalam 2 bulan.', name: 'Bagas Saputra', university: 'Universitas Lampung', initials: 'BS', accentColor: ACCENT, lightBg: '#f0fdfa' },
                { quote: 'Mentor bantu aku ngolah data yang tadinya berantakan jadi hasil analisis yang rapi dan siap dibahas di Bab 4.', name: 'Fitria Sari', university: 'UBL Lampung', initials: 'FS', accentColor: ACCENT, lightBg: '#f0fdfa' },
                { quote: 'SmartPLS gue error mulu dan gue hampir nyerah. Tapi mentor sabar bantu debug dan akhirnya hasil analisis gue valid. Alhamdulillah lulus!', name: 'Andi Kurniawan', university: 'UMITRA Lampung', initials: 'AK', accentColor: ACCENT, lightBg: '#f0fdfa' },
              ]} />
            </div>

            <div id="faq" className="scroll-mt-32">
              <FAQ items={faqs} embedded />
            </div>
          </div>

          <div className="hidden lg:block">
            <StickyPricingCard
              icon={FlaskConical}
              name="Mentoring Privat Sidang Akhir"
              price="Rp 2.250.000"
              paymentLink="/daftar/penelitian"
              accentColor={ACCENT}
              trustCount="1.200+"
              trustNames={['Bagas Saputra', 'Fitria Sari', 'Andi Kurniawan']}
              facts={[
                { icon: Video, label: 'Metode', value: 'Online + Offline' },
                { icon: Clock, label: 'Durasi', value: '3 Bulan' },
                { icon: Users, label: 'Pertemuan', value: '9x Privat' },
              ]}
            />
          </div>
        </div>
      </section>

      <div className="lg:hidden sticky bottom-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Mentoring Privat Sidang Akhir</p>
          <p className="font-bold text-[#1E1B4B]">Rp 2.250.000</p>
        </div>
        <a href="/daftar/penelitian" className="flex-shrink-0 flex items-center gap-1.5 font-bold px-5 py-3 rounded-xl text-sm text-white cursor-pointer" style={{ background: ACCENT }}>
          Daftar <ArrowRight size={15} />
        </a>
      </div>

      <section className="py-16 px-4 bg-[#1E1B4B] relative overflow-hidden text-center">
        <div className="absolute inset-0 grid-bg-dark pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0f766e] rounded-full blur-[140px] opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Saatnya selesaikan skripsimu</h2>
          <p className="text-white/50 mb-8">Dari analisis data sampai sidang — kamu nggak sendirian.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-2xl font-bold text-white">Rp 2.250.000</p>
            <a href="/daftar/penelitian" className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1E1B4B] font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              Mulai Bimbingan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
