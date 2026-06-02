'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Lock, CheckCircle } from 'lucide-react'

export default function UpdatePasswordPage() {
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)
  const supabase = createClient()
  const router   = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password minimal 8 karakter'); return }
    if (password !== confirm) { setError('Konfirmasi password tidak cocok'); return }
    setLoading(true); setError('')

    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }

    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f8ff] px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center">
            <GraduationCap size={17} className="text-white" />
          </div>
          <span className="text-[#1E1B4B] font-bold text-xl">Teman<span className="text-[#2232dd]">Skripsi</span></span>
        </div>

        <div className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-500" />
              </div>
              <p className="text-[#1E1B4B] font-bold text-lg mb-2">Password berhasil diubah!</p>
              <p className="text-[#9CA3AF] text-sm">Mengarahkan ke dashboard...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1E1B4B] mb-1">Buat Password Baru</h1>
                <p className="text-[#9CA3AF] text-sm">Masukkan password baru untuk akunmu.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[#374151] text-xs font-semibold mb-2 uppercase tracking-wider">Password Baru</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 karakter" required minLength={8}
                      className="w-full bg-[#f4f8ff] border border-gray-200 focus:border-[#2232dd] focus:bg-white text-[#1E1B4B] placeholder-[#C4C4C4] rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#374151] text-xs font-semibold mb-2 uppercase tracking-wider">Konfirmasi Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Ulangi password" required
                      className="w-full bg-[#f4f8ff] border border-gray-200 focus:border-[#2232dd] focus:bg-white text-[#1E1B4B] placeholder-[#C4C4C4] rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all" />
                  </div>
                </div>

                {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl">{error}</p>}

                <button type="submit" disabled={loading}
                  className="bg-[#2232dd] hover:bg-[#1a28b8] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all cursor-pointer">
                  {loading ? 'Menyimpan...' : 'Simpan Password'}
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link href="/login" className="text-[#9CA3AF] text-xs hover:text-[#2232dd] transition-colors">
                  Kembali ke halaman login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
