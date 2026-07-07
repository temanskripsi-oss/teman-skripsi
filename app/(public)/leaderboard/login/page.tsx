'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, Trophy } from 'lucide-react'

const INPUT = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all placeholder:text-gray-400'

export default function LeaderboardLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/affiliate-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push('/leaderboard')
      router.refresh()
    } catch {
      setError('Gagal terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] to-[#2232dd] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Trophy size={28} className="text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Leaderboard Sales</h1>
          <p className="text-white/50 text-sm mt-1">Login dengan akun sales team kamu</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3 mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Email</label>
              <input required type="email" value={form.email} placeholder="email@kamu.com" className={INPUT}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Password</label>
              <input required type="password" value={form.password} placeholder="••••••••" className={INPUT}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#2232dd] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1a28b8] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 mt-1">
              {loading ? <><Loader2 size={15} className="animate-spin" /> Masuk...</> : 'Masuk ke Leaderboard'}
            </button>
          </form>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
            <Image src="/images/logo.png" alt="Teman Skripsi" width={24} height={24} className="rounded-lg opacity-40" />
          </div>
        </div>
      </div>
    </div>
  )
}
