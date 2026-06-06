import Image from 'next/image'
import { MapPin } from 'lucide-react'

export default function OfflineHighlight() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2232dd] bg-[#eff6ff] border border-[#2232dd]/20 px-3 py-1.5 rounded-full mb-4">
            <MapPin size={11} /> Bandar Lampung, Lampung
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E1B4B]">
            Satu-satunya Bimbingan Skripsi<br className="hidden md:block" /> yang Bisa Tatap Muka
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-0 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          {/* Photo */}
          <div className="relative w-full md:w-2/5 min-h-[280px] md:min-h-[360px] bg-gradient-to-br from-[#1E1B4B] to-[#2232dd] flex items-center justify-center">
            <Image
              src="/images/offline-mentoring.jpg"
              alt="Sesi mentoring offline TemanSkripsi di Bandar Lampung"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1E1B4B]/20" />
            {/* Placeholder saat foto belum ada */}
            <div className="relative z-10 text-center px-6">
              <MapPin size={40} className="text-white/30 mx-auto mb-3" />
              <p className="text-white/40 text-sm font-medium">Foto segera hadir</p>
            </div>
          </div>

          {/* Quote */}
          <div className="flex-1 bg-[#eff6ff] p-8 md:p-12 flex flex-col justify-center">
            <p className="text-[#1E1B4B] text-lg md:text-xl leading-relaxed mb-6">
              "Skripsi bukan cuma soal nulis — kadang kamu butuh{' '}
              <span className="font-bold">duduk bareng mentor, nunjuk langsung ke laptopmu,</span>{' '}
              dan bahas satu-satu sampai beneran paham. Di TemanSkripsi,{' '}
              <span className="font-bold text-[#2232dd]">itu bisa kamu lakuin secara offline di Bandar Lampung.</span>"
            </p>
            <div>
              <p className="font-bold text-[#1E1B4B] text-sm">Bimbingan Offline TemanSkripsi</p>
              <p className="text-[#6B6B8A] text-sm mt-0.5">Bandar Lampung, Lampung · Tatap Muka Langsung dengan Mentor</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                'Konsultasi tatap muka langsung',
                'Review dokumen real-time',
                'Jadwal fleksibel',
                'Khusus area Bandar Lampung, Lampung',
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 text-xs font-semibold text-[#2232dd] bg-white border border-[#2232dd]/20 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2232dd]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
