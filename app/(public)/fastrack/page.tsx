import type { Metadata } from 'next'
import HeroProgram from '@/components/program/HeroProgram'
import QuickStats from '@/components/program/QuickStats'
import StickyNavTabs from '@/components/program/StickyNavTabs'
import StickyPricingCard from '@/components/program/StickyPricingCard'
import BenefitList from '@/components/program/BenefitList'
import TimelineHybrid, { type TimelinePhase } from '@/components/program/TimelineHybrid'
import FAQ from '@/components/product/FAQ'
import TestimonialSection from '@/components/product/TestimonialSection'
import { ArrowRight, Video, Clock, Users, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fast Track Sempro 30 Hari | Teman Skripsi',
  description: 'Dari judul ke proposal siap seminar dalam 30 hari. Program intensif online se-Indonesia.',
}

const ACCENT = '#16a34a'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'testimoni', label: 'Testimoni' },
  { id: 'faq', label: 'FAQ' },
]

const faqs = [
  { q: 'Program ini cocok untuk jurusan apa?', a: 'Semua jurusan non-teknik — manajemen, ekonomi, hukum, psikologi, pendidikan, komunikasi, dan lainnya.' },
  { q: 'Apakah bisa diikuti sambil kuliah/kerja?', a: 'Bisa! Materi video bisa ditonton kapan saja. Sesi zoom coaching dijadwalkan di waktu yang fleksibel.' },
  { q: 'Bagaimana cara daftar?', a: 'Klik tombol Daftar Sekarang, lakukan pembayaran via QRIS, lalu admin akan konfirmasi dan buat akun dashboard kamu.' },
  { q: 'Apakah ada garansi?', a: 'Kami berkomitmen mendampingi kamu sampai proposal selesai selama masa aktif program.' },
  { q: 'Berapa peserta dalam satu batch?', a: 'Maksimal 50 orang per batch agar kualitas bimbingan tetap terjaga.' },
]

const benefits = [
  { text: 'Video E-Learning lengkap' },
  { text: '3× Zoom coaching online' },
  { text: '4× Written feedback mentor' },
  { text: 'Template proposal Bab 1–3 & PPT Sempro' },
  { text: 'Bonus eksklusif: framework, prompt AI & script' },
  { text: 'Akses grup komunitas alumni' },
  { text: '1× Pertemuan tatap muka offline di Bandar Lampung', exclusive: true },
]

const phases: TimelinePhase[] = [
  { dividerLabel: 'Fase Awal', days: '1–4', title: 'Orientasi & pemahaman materi', desc: 'Akses video panduan, kenali alur riset, diskusi langsung ke mentor.', tags: ['Video materi', 'Tanya jawab'], color: '#7C6FCD', bg: '#f5f3ff' },
  { dividerLabel: 'Fase Penulisan', days: '5–8', title: 'Bab 1 — tulis, kumpul, review zoom', desc: 'Tulis Bab 1 dengan panduan mentor. Hari 7–8: written submission + sesi zoom.', tags: ['Written', 'Zoom review'], color: '#4DD9C0', bg: '#f0fdfa' },
  { days: '9–15', title: 'Bab 2 — tulis, kumpul, review zoom', desc: 'Susun tinjauan literatur. Hari 14–15: written submission + zoom review.', tags: ['Written', 'Zoom review'], color: '#4DD9C0', bg: '#f0fdfa' },
  { days: '16–22', title: 'Bab 3 — tulis, kumpul, review zoom', desc: 'Rancang metodologi penelitian. Hari 21–22: written + zoom review.', tags: ['Written', 'Zoom review'], color: '#7C6FCD', bg: '#f5f3ff' },
  { dividerLabel: 'Fase Finalisasi', days: '23–24', title: 'Revisi menyeluruh Bab 1, 2, dan 3', desc: 'Perbaiki semua bab berdasarkan akumulasi feedback. Proposal jadi kohesif.', tags: ['Review menyeluruh'], color: '#2232dd', bg: '#eff6ff' },
  { days: '25–26', title: 'Arahan konten & pembuatan slide sempro', desc: 'Terima panduan struktur dari mentor, buat slide yang ringkas dan meyakinkan.', tags: ['Written arahan', 'Slide PPT'], color: '#2232dd', bg: '#eff6ff' },
  { days: '27–31', title: 'Pertemuan tatap muka & finalisasi', desc: 'Review akhir offline, simulasi presentasi, persiapan mental sebelum sempro.', tags: ['Tatap muka', 'Simulasi'], color: '#3D3DB4', bg: '#F0EEFF', offline: true },
]

export default function FastTrackPage() {
  return (
    <div className="bg-white">
      <HeroProgram
        badge="Fast Track · 30 Hari"
        breadcrumb="Fast Track Sempro"
        headline="Dari Judul ke Proposal Siap Seminar cuma 30 Hari"
        sub="Bulan ini, investasi Fast Track Sempro turun jadi Rp500rb dari harga normal Rp1jt — kuota dibatasi 50 orang agar pendampingan mentor tetap maksimal untuk setiap peserta."
        price="Rp 500.000"
        originalPrice="Rp 1.000.000"
        discountBadge="Diskon 50%"
        priceNote="Diskon berlaku 1–25 Juli 2026. Tanggal 26–31 kembali ke harga normal, jika kuota masih tersedia."
        paymentLink="/daftar"
        trusts={['1.200+ Alumni', 'Online Se-Indonesia', 'Terbukti ACC', 'Mulai Kapan Saja']}
        accentColor={ACCENT}
        lightBg="#f0fdf4"
        testimonial={{ quote: 'Dalam 30 hari proposal aku ACC! Materinya terstruktur banget.', name: 'Diah Anggraini', university: 'UIN Raden Intan Lampung' }}
        photo="/graduates/Hero Fastrack.jpg"
      />

      <QuickStats stats={[
        { value: 30, label: 'Hari Program' },
        { value: 3, suffix: '×', label: 'Zoom Coaching' },
        { value: 3, label: 'Bab Selesai' },
        { value: 1, suffix: '×', label: 'Pertemuan Offline' },
      ]} />

      <StickyNavTabs tabs={tabs} accentColor={ACCENT} />

      <section className="py-16 px-4 bg-[#f4f8ff]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-10">
          {/* Konten utama */}
          <div className="flex flex-col gap-16">
            <div id="overview" className="scroll-mt-32">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Program ini untuk kamu yang...</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-16">
                {['Baru mau mulai skripsi tapi bingung dari mana','Sudah punya judul tapi belum tahu cara kembangkan','Sering ditolak dosen dan tidak tahu kenapa','Butuh struktur dan sistem yang jelas','Mau hemat waktu dan langsung fokus yang penting','Bisa belajar online karena jauh dari kampus'].map((item, i) => (
                  <div key={i} className="bg-white border border-green-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                    <ArrowRight size={14} className="text-[#16a34a] flex-shrink-0" />
                    <p className="text-[#374151] text-sm">{item}</p>
                  </div>
                ))}
              </div>

              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Yang kamu dapatkan</h2>
              </div>
              <BenefitList items={benefits} accentColor={ACCENT} />
            </div>

            <div id="timeline" className="scroll-mt-32">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Timeline 30 Hari</h2>
              </div>
              <TimelineHybrid phases={phases} />
            </div>

            <div id="testimoni" className="scroll-mt-32">
              <TestimonialSection accentColor={ACCENT} embedded testimonials={[
                { quote: 'Mentornya fast response banget tiap kali aku nanya. Video materinya juga gampang dipahami walau baru pertama kali nulis proposal. Highly recommended buat yang mau cepat selesai sempro.', name: 'Aulia Rahma', university: 'Universitas Lampung', initials: 'AR', accentColor: ACCENT, lightBg: '#f0fdf4' },
                { quote: 'Awalnya bingung mau mulai dari mana, tapi setelah ikut FastTrack semuanya jadi jelas. Judul di-ACC dosen di pertemuan kedua!', name: 'Rizky Maulana', university: 'UMITRA Lampung', initials: 'RM', accentColor: ACCENT, lightBg: '#f0fdf4' },
                { quote: 'Template dan materi videonya lengkap banget. Gue yang tadinya nol bisa nulis Bab 1–3 dalam 3 minggu. Worth every penny!', name: 'Sinta Dewi', university: 'UBL Lampung', initials: 'SD', accentColor: ACCENT, lightBg: '#f0fdf4' },
              ]} />
            </div>

            <div id="faq" className="scroll-mt-32">
              <FAQ items={faqs} embedded />
            </div>
          </div>

          {/* Sticky pricing sidebar */}
          <div className="hidden lg:block">
            <StickyPricingCard
              icon={Zap}
              name="Fast Track Sempro"
              price="Rp 500.000"
              originalPrice="Rp 1.000.000"
              discountBadge="Diskon 50%"
              paymentLink="/daftar"
              accentColor={ACCENT}
              trustCount="1.200+"
              trustNames={['Aulia Rahma', 'Rizky Maulana', 'Sinta Dewi']}
              facts={[
                { icon: Video, label: 'Metode', value: 'Online' },
                { icon: Clock, label: 'Durasi', value: '30 Hari' },
                { icon: Users, label: 'Kuota', value: 'Maks 50/batch' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA bar */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Fast Track Sempro</p>
          <div className="flex items-center gap-1.5">
            <span className="text-[#9CA3AF] text-xs line-through">Rp 1.000.000</span>
            <p className="font-bold text-[#1E1B4B]">Rp 500.000</p>
          </div>
        </div>
        <a href="/daftar" className="flex-shrink-0 flex items-center gap-1.5 font-bold px-5 py-3 rounded-xl text-sm text-white cursor-pointer" style={{ background: ACCENT }}>
          Daftar <ArrowRight size={15} />
        </a>
      </div>

      <section className="py-16 px-4 bg-[#1E1B4B] relative overflow-hidden text-center">
        <div className="absolute inset-0 grid-bg-dark pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#16a34a] rounded-full blur-[140px] opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Siap mulai perjalananmu?</h2>
          <p className="text-white/50 mb-8">Diskon 50% berlaku sampai 25 Juli — kuota terbatas untuk 50 orang.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-white/40 text-lg line-through">Rp 1.000.000</span>
              <p className="text-2xl font-bold text-white">Rp 500.000</p>
            </div>
            <a href="/daftar" className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1E1B4B] font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              Daftar Sekarang <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
