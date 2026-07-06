import { GraduationCap, Globe } from 'lucide-react'

export default function MentorSection({ accentColor = '#2232dd' }: { accentColor?: string }) {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1E1B4B]">Dibimbing langsung oleh mentor berpengalaman</h2>
        </div>
        <div className="bg-[#f4f8ff] rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{ background: accentColor }}>
            GR
          </div>
          <div>
            <p className="font-bold text-[#1E1B4B] text-lg">Gelar Rista</p>
            <p className="text-sm mb-3" style={{ color: accentColor }}>Mentor &amp; Co-Founder Teman Skripsi</p>
            <p className="text-[#6B6B8A] text-sm leading-relaxed mb-4">
              Sudah membimbing 340+ mahasiswa dari berbagai jurusan hingga lulus. Aktif sebagai narasumber di program akademik internasional, termasuk kolaborasi dengan UiTM Malaysia.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#6B6B8A] bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                <GraduationCap size={13} /> 340+ Mahasiswa Lulus
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#6B6B8A] bg-white border border-gray-200 px-3 py-1.5 rounded-full">
                <Globe size={13} /> Kolaborasi Akademik Internasional
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
