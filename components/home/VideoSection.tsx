'use client'
import { useState } from 'react'
import { Play, X } from 'lucide-react'

export default function VideoSection() {
  const [playing, setPlaying] = useState(false)
  return (
    <section className="py-20 px-4 bg-[#f4f8ff] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg-light pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block bg-[#2232dd]/10 border border-[#2232dd]/20 text-[#2232dd] text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Tentang Kami
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1E1B4B] mb-4 leading-tight">
            Kenali <span className="gradient-text-navy">Teman Skripsi</span>
          </h2>
          <p className="text-[#6B6B8A] max-w-lg mx-auto">
            Tonton cerita kami dan kenapa 340+ mahasiswa percayakan skripsinya kepada kami.
          </p>
        </div>

        <div onClick={() => setPlaying(true)}
          className="relative rounded-3xl overflow-hidden cursor-pointer group border border-[#2232dd]/15 hover:border-[#2232dd]/35 hover:shadow-2xl hover:shadow-[#2232dd]/10 transition-all duration-300 bg-white shadow-lg shadow-black/6">
          <div className="w-full aspect-video bg-gradient-to-br from-[#1E1B4B] via-[#2232dd]/60 to-[#7C6FCD]/40 relative">
            <div className="absolute inset-0 grid-bg-dark opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[100px] sm:text-[160px] font-black text-white/[0.04] select-none pointer-events-none">TS</span>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-black/40 group-hover:scale-110 transition-transform duration-300">
                <Play size={28} fill="#2232dd" className="text-[#2232dd] ml-1" />
              </div>
              <p className="text-white/70 text-sm font-medium">Tonton Company Profile · 3 menit</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white font-semibold text-sm">Teman Skripsi — Gerakan Wisuda Indonesia</p>
              <p className="text-white/50 text-xs">Company Profile 2024</p>
            </div>
          </div>
        </div>

        {playing && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPlaying(false)}>
            <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPlaying(false)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white flex items-center gap-2 text-sm cursor-pointer transition-colors">
                <X size={16} /> Tutup
              </button>
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-[#1E1B4B] border border-white/10 flex items-center justify-center">
                <p className="text-white/30 text-sm">Link video YouTube/Vimeo ditambahkan di sini</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { v:'340+',   l:'Mahasiswa dibantu wisuda',     c:'#2232dd' },
            { v:'< 1 bln', l:'Rekor tercepat lulus',        c:'#16a34a' },
            { v:'3 thn',  l:'Pengalaman mendampingi',       c:'#7C6FCD' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 text-center border border-gray-100 shadow-sm">
              <p className="text-2xl sm:text-3xl font-bold mb-1 tracking-tight" style={{ color: s.c }}>{s.v}</p>
              <p className="text-[#9CA3AF] text-xs sm:text-sm">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
