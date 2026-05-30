'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Mail, Lock, ArrowRight, Star, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email atau password salah. Coba lagi.'); setLoading(false) }
    else { router.push('/dashboard'); router.refresh() }
  }

  const handleMagicLink = async () => {
    if (!email) { setError('Masukkan email kamu terlebih dahulu.'); return }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setError('Gagal kirim magic link. Coba lagi.')
    else { setMagicSent(true); setError('') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E1B4B] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 grid-bg-dark pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#2232dd] rounded-full blur-[130px] opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center">
              <GraduationCap size={17} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Teman<span className="text-[#9eff63]">Skripsi</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-1 mb-6">
            {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#f59e0b" className="text-[#f59e0b]" />)}
            <span className="text-white/50 text-sm ml-2">5.0 dari 340+ alumni</span>
          </div>
          <h2 className="text-5xl font-bold text-white leading-tight mb-4">
            Selamat datang<br />
            <span className="text-[#9eff63]">kembali.</span>
          </h2>
          <p className="text-white/45 text-base leading-relaxed max-w-xs">
            Lanjutkan perjalanan skripsimu. Dashboard dan materi bimbinganmu sudah menunggu.
          </p>
          <div className="flex flex-col gap-2.5 mt-8">
            {['Akses video materi kapan saja','Download template & freebies','Lihat jadwal bimbinganmu'].map((t,i) => (
              <div key={i} className="flex items-center gap-2.5 text-white/60 text-sm">
                <CheckCircle size={14} className="text-[#9eff63]" /> {t}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[{v:'340+',l:'Alumni'},{v:'< 1 Bln',l:'Rekor Lulus'},{v:'5.0',l:'Rating'}].map((s,i) => (
            <div key={i} className="bg-white/8 border border-white/10 rounded-xl p-3 text-center">
              <p className="text-[#9eff63] font-bold text-lg leading-none mb-0.5">{s.v}</p>
              <p className="text-white/35 text-[11px]">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#f4f8ff] relative">
        <div className="absolute inset-0 grid-bg-light pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <div className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center">
              <GraduationCap size={17} className="text-white" />
            </div>
            <span className="text-[#1E1B4B] font-bold text-xl">Teman<span className="text-[#2232dd]">Skripsi</span></span>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-bold text-[#1E1B4B] mb-1.5">Masuk ke akun</h1>
            <p className="text-[#9CA3AF] text-sm">Belum punya akun?{' '}
              <a href="https://wa.me/62" target="_blank" rel="noopener noreferrer" className="text-[#2232dd] hover:underline cursor-pointer">Hubungi kami</a>
            </p>
          </div>

          {magicSent ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-green-100 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-[#16a34a]" />
              </div>
              <p className="text-[#1E1B4B] font-bold text-lg mb-2">Magic link terkirim!</p>
              <p className="text-[#9CA3AF] text-sm">Cek inbox atau folder spam emailmu.</p>
              <button onClick={() => setMagicSent(false)} className="mt-5 text-[#2232dd] text-sm hover:underline cursor-pointer">
                Kembali ke login
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
              <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-5">
                <div>
                  <label className="block text-[#374151] text-xs font-semibold mb-2 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="email@kamu.com" required
                      className="w-full bg-[#f4f8ff] border border-gray-200 focus:border-[#2232dd] focus:bg-white text-[#1E1B4B] placeholder-[#C4C4C4] rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#374151] text-xs font-semibold mb-2 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full bg-[#f4f8ff] border border-gray-200 focus:border-[#2232dd] focus:bg-white text-[#1E1B4B] placeholder-[#C4C4C4] rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all" />
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">{error}</p>}

                <button type="submit" disabled={loading}
                  className="group flex items-center justify-center gap-2 bg-[#2232dd] hover:bg-[#1a28b8] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2232dd]/20 cursor-pointer">
                  {loading ? 'Masuk...' : (<>Masuk <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></>)}
                </button>
              </form>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-[#9CA3AF] text-xs">atau</span></div>
              </div>

              <button onClick={handleMagicLink} disabled={loading}
                className="w-full border border-gray-200 hover:border-[#2232dd]/30 text-[#6B6B8A] hover:text-[#2232dd] py-3 rounded-xl transition-all text-sm font-medium cursor-pointer">
                Kirim Magic Link ke Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
