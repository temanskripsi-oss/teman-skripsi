'use client'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, ArrowRight, Star, CheckCircle, X } from 'lucide-react'

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>
}

function LoginContent() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [showNotRegistered, setShowNotRegistered] = useState(false)
  const router       = useRouter()
  const searchParams = useSearchParams()
  const supabase     = createClient()

  useEffect(() => {
    if (searchParams.get('error') === 'not_registered') {
      setShowNotRegistered(true)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email atau password salah. Coba lagi.'); setLoading(false); return }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    const role = profile?.role
    router.push(role === 'admin' ? '/admin' : role === 'mentor' ? '/mentor' : '/dashboard')
    router.refresh()
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex">
      {showNotRegistered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative">
            <button onClick={() => setShowNotRegistered(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B] mb-2">Email Belum Terdaftar</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Akun kamu belum terdaftar di platform kami. Kamu perlu mendaftar paket <span className="font-semibold text-[#2232dd]">Fastrack</span> atau <span className="font-semibold text-[#2232dd]">Mentoring Privat</span> terlebih dahulu.
                </p>
              </div>
              <a
                href="/#produk"
                className="w-full bg-[#2232dd] hover:bg-[#1a28b8] text-white font-semibold py-3 rounded-xl text-sm transition-all text-center"
              >
                Daftar Sekarang
              </a>
              <button onClick={() => setShowNotRegistered(false)} className="text-gray-400 text-sm hover:text-gray-600 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E1B4B] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 grid-bg-dark pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#2232dd] rounded-full blur-[130px] opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 cursor-pointer">
            <Image src="/images/logo.png" alt="TemanSkripsi" width={36} height={36} className="flex-shrink-0 rounded-xl" />
            <span className="text-white font-bold text-xl tracking-tight">
              Teman<span className="text-[#9eff63]">Skripsi</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-1 mb-6">
            {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#f59e0b" className="text-[#f59e0b]" />)}
            <span className="text-white/50 text-sm ml-2">5.0 dari 1.200+ alumni</span>
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
          {[{v:'1.200+',l:'Alumni'},{v:'< 1 Bln',l:'Rekor Lulus'},{v:'5.0',l:'Rating'}].map((s,i) => (
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
            <Image src="/images/logo.png" alt="TemanSkripsi" width={36} height={36} className="flex-shrink-0 rounded-xl" />
            <span className="text-[#1E1B4B] font-bold text-xl">Teman<span className="text-[#2232dd]">Skripsi</span></span>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-bold text-[#1E1B4B] mb-1.5">Masuk ke akun</h1>
            <p className="text-[#9CA3AF] text-sm">Belum punya akun?{' '}
              <a href="https://wa.me/6289524785477" target="_blank" rel="noopener noreferrer" className="text-[#2232dd] hover:underline cursor-pointer">Hubungi kami</a>
            </p>
          </div>

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

            <button onClick={handleGoogleLogin} disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-3 rounded-xl transition-all text-sm font-medium text-[#374151] cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Masuk dengan Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
