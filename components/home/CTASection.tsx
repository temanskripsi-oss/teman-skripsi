import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 px-4 bg-[#1E1B4B] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg-dark pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2232dd] rounded-full blur-[150px] opacity-20" />
        <div className="absolute left-1/4 bottom-0 w-72 h-72 bg-[#9eff63] rounded-full blur-[120px] opacity-[0.07]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="inline-block bg-white/10 border border-white/15 text-white/70 text-xs font-semibold px-4 py-1.5 rounded-full mb-7 uppercase tracking-widest">
          Mulai Sekarang
        </span>
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-5 leading-[0.95] tracking-tight">
          Jangan tunda lagi.<br />
          <span className="gradient-text-electric">Mulai hari ini.</span>
        </h2>
        <p className="text-white/50 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Setiap hari yang kamu tunda adalah hari yang bisa kamu pakai untuk wisuda.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#produk"
            className="group inline-flex items-center gap-2.5 bg-white hover:bg-gray-50 text-[#1E1B4B] font-bold px-10 py-4 rounded-2xl text-lg transition-all duration-250 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-0.5 cursor-pointer">
            Daftar Sekarang
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="https://wa.me/6289524785477" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/70 hover:text-white px-8 py-4 rounded-2xl text-base font-medium transition-all duration-250 cursor-pointer">
            Konsultasi Dulu
          </a>
        </div>
        <p className="text-white/25 text-sm mt-8">Sudah membantu 340+ mahasiswa se-Indonesia</p>
      </div>
    </section>
  )
}
