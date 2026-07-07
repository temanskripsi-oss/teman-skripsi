export default function HowItWorks() {
  const steps = [
    { num: '01', color: '#2232dd', bg: '#eff6ff', title: 'Pilih program yang sesuai', desc: 'Fast Track untuk yang baru mulai, Mentoring Privat untuk pendampingan 1-on-1 yang intensif dan personal.' },
    { num: '02', color: '#7C6FCD', bg: '#f5f3ff', title: 'Bimbingan personal bersama mentor', desc: 'Didampingi step by step dari judul sampai selesai oleh mentor yang sudah bantu 1.200+ mahasiswa.' },
    { num: '03', color: '#16a34a', bg: '#f0fdf4', title: 'Selesai dan wisuda tepat waktu', desc: '1.200+ alumni sudah membuktikannya. Ada yang dari hampir DO jadi lulus dalam waktu kurang dari 1 bulan.' },
  ]

  return (
    <section id="cara-kerja" className="py-20 px-4 bg-[#f4f8ff] relative scroll-mt-24">
      <div className="absolute inset-0 grid-bg-light pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#2232dd]/10 border border-[#2232dd]/20 text-[#2232dd] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Cara Kerja
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1E1B4B] leading-tight">
            Semudah <span className="text-[#2232dd]">3 langkah</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden">
              <div className="absolute top-5 right-5 text-8xl font-black leading-none select-none opacity-[0.06]" style={{ color: s.color }}>
                {s.num}
              </div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold mb-5" style={{ background: s.bg, color: s.color }}>
                {i + 1}
              </div>
              <h3 className="text-lg font-bold text-[#1E1B4B] mb-2 leading-snug">{s.title}</h3>
              <p className="text-[#6B6B8A] text-sm leading-relaxed">{s.desc}</p>
              <div className="mt-5 h-1 rounded-full w-10" style={{ background: s.color }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
