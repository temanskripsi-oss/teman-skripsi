'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, CheckCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'Apakah bimbingan bisa dilakukan secara offline?',
    a: 'Ya! TemanSkripsi adalah satu-satunya layanan bimbingan skripsi di Bandar Lampung yang menyediakan sesi tatap muka langsung. Kamu bisa bertemu mentor secara offline untuk berdiskusi, review dokumen, dan konsultasi secara real-time.',
  },
  {
    q: 'Berapa lama waktu yang dibutuhkan untuk menyelesaikan skripsi?',
    a: 'Tergantung paket yang kamu pilih. Fastrack dirancang untuk menyelesaikan skripsi dalam 30 hari. Untuk Mentoring Sempro dan Penelitian, rata-rata alumni kami ACC dalam 4–8 minggu. Kecepatan juga tergantung konsistensi kamu dalam mengerjakan revisi.',
  },
  {
    q: 'Apakah mentor siap membantu kapan saja?',
    a: 'Mentor kami tersedia setiap hari melalui dashboard untuk pertanyaan singkat dan konsultasi cepat. Untuk sesi bimbingan mendalam, kamu bisa jadwalkan langsung di dashboard sesuai kesepakatan. Kami pastikan tidak ada pertanyaan yang tidak terjawab.',
  },
  {
    q: 'Apakah cocok untuk semua jurusan?',
    a: 'Mayoritas alumni kami berasal dari jurusan sosial, ekonomi, pendidikan, hukum, dan kesehatan. Namun mentor kami memiliki background yang beragam dan siap mendampingi berbagai topik penelitian. Konsultasikan dulu topik skripsimu secara gratis sebelum mendaftar.',
  },
  {
    q: 'Bagaimana sistem pembayarannya?',
    a: 'Pembayaran dilakukan langsung di website kami. Setelah pembayaran berhasil, kamu otomatis mendapatkan akses ke dashboard client — termasuk materi, jadwal, tugas, dan komunikasi dengan mentor. Tidak perlu konfirmasi manual, semua langsung aktif.',
  },
  {
    q: 'Apakah ada garansi hasil?',
    a: 'Kami berkomitmen mendampingi kamu sampai ACC atau sidang. Jika dalam periode program belum mencapai target, kami akan lanjutkan bimbingan tanpa biaya tambahan. Kepuasan dan keberhasilan kamu adalah prioritas kami.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start">

          {/* Left — accordion */}
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E1B4B] leading-tight mb-10">
              Kenapa Pilih<br />
              <span className="text-[#2232dd]">TemanSkripsi?</span>
            </h2>

            <div className="flex flex-col divide-y divide-gray-100">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <CheckCircle
                        size={18}
                        className={`flex-shrink-0 transition-colors ${open === i ? 'text-[#2232dd]' : 'text-[#2232dd]/40'}`}
                      />
                      <span className={`text-sm font-semibold transition-colors ${open === i ? 'text-[#1E1B4B]' : 'text-[#374151] group-hover:text-[#1E1B4B]'}`}>
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`flex-shrink-0 text-[#9CA3AF] transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open === i && (
                    <p className="text-[#6B6B8A] text-sm leading-relaxed pb-4 pl-7">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div className="w-full md:w-[44%] flex-shrink-0">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-[#1E1B4B] to-[#2232dd]">
              <Image
                src="/images/faq-mentor.jpeg"
                alt="Sesi bimbingan TemanSkripsi"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 44vw"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
