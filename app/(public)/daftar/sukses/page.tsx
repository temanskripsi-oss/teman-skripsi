import { CheckCircle, Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function SuksesPage() {
  return (
    <div className="min-h-screen bg-[#f4f8ff] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-[#16a34a]" />
          </div>

          <h1 className="text-2xl font-bold text-[#1E1B4B] mb-2">Pembayaran Berhasil!</h1>
          <p className="text-[#9CA3AF] text-sm leading-relaxed mb-8">
            Selamat bergabung di Fastrack Sempro! Akunmu sedang disiapkan — cek email kamu dalam beberapa menit.
          </p>

          <div className="flex flex-col gap-3 text-left mb-8">
            <div className="flex items-start gap-3 bg-[#f4f8ff] rounded-xl p-4 border border-[#2232dd]/10">
              <Mail size={18} className="text-[#2232dd] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#1E1B4B]">Cek Email Kamu</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Kami kirimkan link untuk set password akun dashboardmu.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#f4f8ff] rounded-xl p-4 border border-[#2232dd]/10">
              <MessageCircle size={18} className="text-[#2232dd] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#1E1B4B]">Gabung Grup WhatsApp</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Admin akan menghubungi kamu via WhatsApp dengan info batch.</p>
              </div>
            </div>
          </div>

          <Link href="/login"
            className="block w-full bg-[#2232dd] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1a28b8] transition-colors text-center">
            Masuk ke Dashboard
          </Link>
          <Link href="/" className="block mt-3 text-[#9CA3AF] text-sm hover:text-[#1E1B4B] transition-colors">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
