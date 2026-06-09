import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#27272c] border-t border-white/6 py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/images/logo.png" alt="TemanSkripsi" width={32} height={32} className="flex-shrink-0 rounded-xl" />
              <span className="text-white font-bold text-lg tracking-tight">
                Teman<span className="text-[#9eff63]">Skripsi</span>
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Teman Skripsi hadir untuk membuktikan bahwa skripsi tidak harus ribet dan sulit. Kami percaya setiap mahasiswa berhak lulus tepat waktu dan misi kami yaitu membantu 1.000.000 mahasiswa Indonesia wisuda dengan cara yang mudah, terarah, dan penuh kebahagiaan.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://wa.me/6289524785477" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer">
                <Phone size={15} /> WhatsApp
              </a>
              <a href="mailto:arezakurniawan17@gmail.com"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer">
                <Mail size={15} /> Email Support
              </a>
            </div>
          </div>

          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Program</p>
            <div className="flex flex-col gap-2.5">
              {[
                ['/fastrack', 'Fast Track Sempro'],
                ['/mentoring-sempro', 'Mentoring Sempro'],
                ['/mentoring-penelitian', 'Mentoring Bab 4–5'],
              ].map(([href, label]) => (
                <Link key={href} href={href}
                  className="text-white/40 hover:text-white text-sm transition-colors cursor-pointer">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">Navigasi</p>
            <div className="flex flex-col gap-2.5">
              {[
                ['/#produk', 'Produk'],
                ['/#testimoni', 'Alumni'],
                ['/dashboard', 'Dashboard Client'],
                ['/login', 'Masuk'],
              ].map(([href, label]) => (
                <Link key={href} href={href}
                  className="text-white/40 hover:text-white text-sm transition-colors cursor-pointer">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">© {new Date().getFullYear()} Teman Skripsi. All rights reserved.</p>
          <p className="text-white/20 text-xs">Bandar Lampung, Indonesia</p>
        </div>
      </div>
    </footer>
  )
}
