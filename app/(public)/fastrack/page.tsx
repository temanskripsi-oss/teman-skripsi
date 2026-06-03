import type { Metadata } from 'next'
import ProductHero from '@/components/product/ProductHero'
import FAQ from '@/components/product/FAQ'
import { CheckCircle, Video, Users, FileText, Gift, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fast Track Sempro 30 Hari | Teman Skripsi',
  description: 'Dari judul ke proposal siap seminar dalam 30 hari. Program intensif online se-Indonesia.',
}

const faqs = [
  { q: 'Program ini cocok untuk jurusan apa?', a: 'Semua jurusan non-teknik — manajemen, ekonomi, hukum, psikologi, pendidikan, komunikasi, dan lainnya.' },
  { q: 'Apakah bisa diikuti sambil kuliah/kerja?', a: 'Bisa! Materi video bisa ditonton kapan saja. Sesi zoom coaching dijadwalkan di waktu yang fleksibel.' },
  { q: 'Bagaimana cara daftar?', a: 'Klik tombol Daftar Sekarang, lakukan pembayaran via Mayar.id, lalu admin akan konfirmasi dan buat akun dashboard kamu.' },
  { q: 'Apakah ada garansi?', a: 'Kami berkomitmen mendampingi kamu sampai proposal selesai selama masa aktif program.' },
  { q: 'Berapa peserta dalam satu batch?', a: 'Maksimal 20 orang per batch agar kualitas bimbingan tetap terjaga.' },
]

const features = [
  { icon: Video,       title: 'Video Learning Lengkap',  desc: 'Materi step by step yang bisa ditonton ulang kapan saja dan di mana saja' },
  { icon: Users,       title: 'Zoom Coaching Mingguan',  desc: 'Sesi live bersama mentor, tanya jawab langsung, review proposal kamu' },
  { icon: FileText,    title: 'Template Siap Pakai',     desc: 'Template proposal Bab 1-3, PPT Sempro, 100+ contoh judul ACC semua jurusan' },
  { icon: Gift,        title: 'Bonus Eksklusif',         desc: 'Research gap framework, prompt AI untuk skripsi, script konsultasi ke dosen' },
  { icon: CheckCircle, title: 'Dashboard Akses',         desc: 'Akses semua materi via dashboard pribadi selama masa aktif program' },
  { icon: Users,       title: 'Komunitas Alumni',        desc: 'Bergabung dengan grup alumni untuk networking dan berbagi pengalaman' },
]

export default function FastTrackPage() {
  return (
    <div className="bg-white">
      <ProductHero
        badge="Program Intensif 30 Hari"
        breadcrumb="Fast Track Sempro"
        headline="Dari Judul ke Proposal Siap Seminar — dalam 30 Hari"
        sub="Cocok untuk kamu yang baru mulai atau yang sudah nunda terlalu lama. Sistem terstruktur yang terbukti."
        price="Rp 500.000"
        paymentLink="#"
        trusts={['340+ Alumni', 'Online Se-Indonesia', 'Terbukti ACC', 'Mulai Kapan Saja']}
        accentColor="#16a34a"
        lightBg="#f0fdf4"
      />

      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Program ini untuk kamu yang...</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {['Baru mau mulai skripsi tapi bingung dari mana','Sudah punya judul tapi belum tahu cara kembangkan','Sering ditolak dosen dan tidak tahu kenapa','Butuh struktur dan sistem yang jelas','Mau hemat waktu dan langsung fokus yang penting','Bisa belajar online karena jauh dari kampus'].map((item, i) => (
              <div key={i} className="bg-[#f0fdf4] border border-green-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <CheckCircle size={16} className="text-[#16a34a] flex-shrink-0" />
                <p className="text-[#374151] text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#f4f8ff]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Yang kamu dapatkan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="p-2.5 bg-green-50 text-[#16a34a] rounded-xl w-fit mb-3"><Icon size={18} /></div>
                  <h3 className="font-bold text-[#1E1B4B] text-sm mb-1">{f.title}</h3>
                  <p className="text-[#9CA3AF] text-xs leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Kurikulum 30 Hari</h2>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { week:'Hari 1–3',   color:'#16a34a', bg:'#f0fdf4', title:'Orientasi & Menemukan Topik', desc:'Pengenalan program, cara kerja skripsi, teknik menemukan topik kuat dan relevan.' },
              { week:'Hari 4–10',  color:'#2232dd', bg:'#eff6ff', title:'Bab 1 — Pendahuluan',         desc:'Latar belakang, rumusan masalah, tujuan penelitian yang membuat dosen langsung setuju.' },
              { week:'Hari 11–18', color:'#7C6FCD', bg:'#f5f3ff', title:'Bab 2 — Kajian Pustaka',      desc:'Cara mencari jurnal yang tepat, kerangka teori, penelitian terdahulu yang kuat.' },
              { week:'Hari 19–27', color:'#0f766e', bg:'#f0fdfa', title:'Bab 3 — Metodologi',          desc:'Jenis penelitian, populasi sampel, instrumen, dan teknik analisis data.' },
              { week:'Hari 28–30', color:'#16a34a', bg:'#f0fdf4', title:'Finalisasi & Review',         desc:'Review keseluruhan proposal, sesi Q&A, persiapan seminar proposal.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex gap-4 items-start hover:shadow-md transition-all shadow-sm">
                <span className="flex-shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full whitespace-nowrap border" style={{ background: item.bg, color: item.color, borderColor: `${item.color}20` }}>
                  {item.week}
                </span>
                <div>
                  <p className="font-semibold text-[#1E1B4B] text-sm mb-0.5">{item.title}</p>
                  <p className="text-[#9CA3AF] text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqs} />

      <section className="py-16 px-4 bg-[#1E1B4B] relative overflow-hidden text-center">
        <div className="absolute inset-0 grid-bg-dark pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#16a34a] rounded-full blur-[140px] opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Siap mulai perjalananmu?</h2>
          <p className="text-white/50 mb-8">30 hari dari sekarang, proposal kamu bisa sudah ACC.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-2xl font-bold text-white">Rp 500.000</p>
            <a href="/daftar" className="group inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#1E1B4B] font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              Daftar Sekarang <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
