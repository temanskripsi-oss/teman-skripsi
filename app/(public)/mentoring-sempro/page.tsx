import type { Metadata } from 'next'
import HeroProgram from '@/components/program/HeroProgram'
import QuickStats from '@/components/program/QuickStats'
import StickyNavTabs from '@/components/program/StickyNavTabs'
import StickyPricingCard from '@/components/program/StickyPricingCard'
import FAQ from '@/components/product/FAQ'
import TestimonialSection from '@/components/product/TestimonialSection'
import { MapPin, Wifi, FileText, Video, Check, Gift, ArrowRight, Users, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentoring Privat Sempro | Teman Skripsi',
  description: 'Bimbingan 1-on-1 dari judul sampai proposal ACC. 9 pertemuan, 3 bulan masa aktif.',
}

const ACCENT = '#2232dd'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'testimoni', label: 'Testimoni' },
  { id: 'faq', label: 'FAQ' },
]

const faqs = [
  { q: 'Apakah bisa full online?', a: 'Untuk klien di luar Bandar Lampung, semua 9 pertemuan bisa dilakukan secara online via Zoom.' },
  { q: 'Bagaimana jadwal offline-nya?', a: 'Untuk klien di Bandar Lampung, 3 pertemuan offline dilakukan di lokasi yang disepakati bersama mentor.' },
  { q: 'Apa yang terjadi kalau belum selesai dalam 3 bulan?', a: 'Tim kami akan evaluasi progres dan memberikan solusi terbaik sesuai kondisi.' },
  { q: 'Siapa mentornya?', a: 'Mentor kami adalah alumni berprestasi yang sudah membantu 1.200+ mahasiswa lulus.' },
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
      <HeroProgram
        badge="Mentoring Privat · Sempro"
        breadcrumb="Mentoring Privat Sempro"
        headline="Bimbingan Privat dari Judul sampai ACC Seminar Proposal"
        sub="Bukan cuma ngajarin — kami menemani. Dari yang bingung judul sampai ACC seminar proposal, step by step bareng mentor kamu."
        price="Rp 2.000.000"
        paymentLink="/daftar/sempro"
        trusts={['9 Pertemuan Privat', '3 Bulan Masa Aktif', 'Offline + Online', '1.200+ Alumni']}
        accentColor={ACCENT}
        lightBg="#eff6ff"
        testimonial={{ quote: 'Mentor sabar banget nemenin revisi sampai proposal aku benar-benar siap.', name: 'Ela Joevira', university: 'UIN Raden Intan Lampung' }}
        photo="/graduates/Hero Bimbingan bab 1-3.jpeg"
      />

      <QuickStats stats={[
        { display: '1-on-1', label: 'Privat' },
        { display: 'Zoom + Offline', label: 'Format Bimbingan' },
        { display: 'ACC Sempro', label: 'Target Program' },
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
              <div className="bg-white border border-[#2232dd]/15 rounded-xl px-5 py-3.5 flex items-center gap-3">
                <Video size={16} className="text-[#2232dd] flex-shrink-0" />
                <p className="text-[#374151] text-sm">Termasuk akses video E-Learning + semua template & freebies via dashboard</p>
              </div>

              {/* FREE FastTrack included */}
              <div className="mt-10 bg-[#f0fdf4] rounded-2xl border border-green-100 p-6 sm:p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-[#16a34a] text-white text-sm font-bold px-5 py-2 rounded-full mb-5">
                    <Gift size={15} />
                    Bonus: FREE Akses Full Fast Track Sempro
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1E1B4B] mb-2">
                    Selain 9 pertemuan privat, kamu juga dapat:
                  </h3>
                  <p className="text-[#6B6B8A] text-sm">Senilai Rp 1.000.000 — GRATIS untuk kamu</p>
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

            <div id="testimoni" className="scroll-mt-32">
              <TestimonialSection accentColor={ACCENT} embedded testimonials={[
                { quote: 'Dari judul yang ditolak 3 kali, akhirnya ACC juga berkat bimbingan privat ini. Sesi offline-nya bikin aku lebih paham dibanding baca sendiri.', name: 'Mega Pratiwi', university: 'Universitas Lampung', initials: 'MP', accentColor: ACCENT, lightBg: '#eff6ff' },
                { quote: 'Bimbingan offline-nya sangat membantu, bisa tanya langsung dan dapat feedback real-time. Proposal gue selesai jauh lebih cepat dari yang gue kira.', name: 'Dimas Arya', university: 'UMITRA Lampung', initials: 'DA', accentColor: ACCENT, lightBg: '#eff6ff' },
                { quote: 'Mentor ngerti banget cara njelasin ke mahasiswa yang awam penelitian. Tiap sesi selalu ada progress yang nyata. Sangat worth it!', name: 'Nadia Putri', university: 'IBI Darmajaya', initials: 'NP', accentColor: ACCENT, lightBg: '#eff6ff' },
              ]} />
            </div>

            <div id="faq" className="scroll-mt-32">
              <FAQ items={faqs} embedded />
            </div>
          </div>

          <div className="hidden lg:block">
            <StickyPricingCard
              icon={Users}
              name="Mentoring Privat Sempro"
              price="Rp 2.000.000"
              paymentLink="/daftar/sempro"
              accentColor={ACCENT}
              trustCount="1.200+"
              trustNames={['Mega Pratiwi', 'Dimas Arya', 'Nadia Putri']}
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
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Mentoring Privat Sempro</p>
          <p className="font-bold text-[#1E1B4B]">Rp 2.000.000</p>
        </div>
        <a href="/daftar/sempro" className="flex-shrink-0 flex items-center gap-1.5 font-bold px-5 py-3 rounded-xl text-sm text-white cursor-pointer" style={{ background: ACCENT }}>
          Daftar <ArrowRight size={15} />
        </a>
      </div>

      <section className="py-16 px-4 bg-[#1E1B4B] relative overflow-hidden text-center">
        <div className="absolute inset-0 grid-bg-dark pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2232dd] rounded-full blur-[140px] opacity-15 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Mulai bimbingan personalmu</h2>
          <p className="text-white/50 mb-8">Tempat terbatas. Daftar sekarang sebelum slot penuh.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-2xl font-bold text-white">Rp 2.000.000</p>
            <a href="/daftar/sempro" className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1E1B4B] font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              Mulai Bimbingan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
