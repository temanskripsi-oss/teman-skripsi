'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, LogOut, RefreshCw, TrendingUp, DollarSign, Medal } from 'lucide-react'

interface LeaderboardEntry {
  sales_email: string
  sales_name: string
  codes: string[]
  total_sales: number
  total_commission: number
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  myEmail: string
  myName: string
  pendingCommission: number
}

const MEDAL = ['🥇', '🥈', '🥉']
const PODIUM_BG = [
  'bg-gradient-to-b from-yellow-50 to-yellow-100 border-yellow-200',
  'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200',
  'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-200',
]
const PODIUM_TEXT = ['text-yellow-600', 'text-gray-500', 'text-orange-500']

export default function LeaderboardPage() {
  const router = useRouter()
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/leaderboard')
    if (res.status === 401) { router.push('/leaderboard/login'); return }
    const json = await res.json()
    setData(json)
    setLastUpdated(new Date())
    setLoading(false)
  }, [router])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const logout = async () => {
    await fetch('/api/affiliate-login', { method: 'DELETE' })
    router.push('/leaderboard/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] to-[#2232dd] flex items-center justify-center">
        <div className="text-white text-center">
          <RefreshCw size={28} className="animate-spin mx-auto mb-3 opacity-60" />
          <p className="text-sm opacity-60">Memuat leaderboard...</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { leaderboard, myEmail, myName, pendingCommission } = data
  const myRank = leaderboard.findIndex(e => e.sales_email === myEmail) + 1
  const myData = leaderboard.find(e => e.sales_email === myEmail)
  const aboveMe = myRank > 1 ? leaderboard[myRank - 2] : null
  const gapToNext = aboveMe ? aboveMe.total_sales - (myData?.total_sales ?? 0) : 0

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#2232dd] to-[#1E1B4B]">
      {/* Header */}
      <div className="px-4 pt-28 pb-6 text-center relative">
        <button onClick={logout} className="absolute right-4 top-4 flex items-center gap-1.5 text-white/40 hover:text-white/80 text-xs transition-colors">
          <LogOut size={13} /> Keluar
        </button>
        <h1 className="text-2xl font-bold text-white">🏆 Leaderboard Sales</h1>
        <p className="text-white/40 text-xs mt-1">
          Teman Skripsi · Update otomatis tiap 30 detik
          {lastUpdated && ` · ${lastUpdated.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-12">

        {/* Card Performa Saya */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 mb-6">
          <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-2">Performa Kamu</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-lg">{myName}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-white/60 text-xs flex items-center gap-1">
                  <TrendingUp size={11} /> Rank #{myRank} dari {leaderboard.length}
                </span>
                <span className="text-white/60 text-xs flex items-center gap-1">
                  <Trophy size={11} /> {myData?.total_sales ?? 0} Closing
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-yellow-300 font-bold text-lg">{myRank <= 3 ? MEDAL[myRank - 1] : `#${myRank}`}</p>
            </div>
          </div>
          {pendingCommission > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-white/50 text-xs flex items-center gap-1"><DollarSign size={11} /> Komisi Pending</span>
              <span className="text-yellow-300 font-bold text-sm">Rp {pendingCommission.toLocaleString('id-ID')}</span>
            </div>
          )}
          {aboveMe && gapToNext > 0 && (
            <div className="mt-2 bg-white/10 rounded-xl px-3 py-2">
              <p className="text-white/60 text-xs">💪 Butuh <span className="text-white font-bold">{gapToNext} closing lagi</span> untuk salip <span className="text-white font-bold">{aboveMe.sales_name.split(' ')[0]}</span>!</p>
            </div>
          )}
        </div>

        {/* Podium Top 3 */}
        {top3.length > 0 && (
          <div className="mb-6">
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider text-center mb-4">Top 3</p>
            <div className="flex items-end justify-center gap-3">
              {/* Render order: 2nd, 1st, 3rd */}
              {[1, 0, 2].map(i => {
                const entry = top3[i]
                if (!entry) return <div key={i} className="flex-1" />
                const isMe = entry.sales_email === myEmail
                return (
                  <div key={i} className={`flex-1 flex flex-col items-center ${i === 0 ? 'order-2' : i === 1 ? 'order-1' : 'order-3'}`}>
                    <p className="text-2xl mb-1">{MEDAL[i]}</p>
                    <div className={`w-full border rounded-2xl p-3 text-center flex flex-col justify-center overflow-hidden ${PODIUM_BG[i]} ${isMe ? 'ring-2 ring-white/60' : ''}`}
                      style={{ height: i === 0 ? '120px' : i === 1 ? '100px' : '85px' }}>
                      <p className={`font-bold text-sm text-[#1E1B4B] truncate ${isMe ? 'underline decoration-dotted' : ''}`}>
                        {entry.sales_name.split(' ')[0]}{isMe ? ' (Kamu)' : ''}
                      </p>
                      <p className={`text-xs font-semibold mt-0.5 truncate ${PODIUM_TEXT[i]}`}>{entry.codes.join(' · ')}</p>
                      <p className="text-2xl font-bold text-[#1E1B4B] mt-1">{entry.total_sales}</p>
                      <p className="text-[10px] text-[#9CA3AF]">closing</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tabel Lengkap */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#1E1B4B] text-sm flex items-center gap-2">
              <Medal size={15} className="text-[#2232dd]" /> Semua Sales
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {leaderboard.map((entry, idx) => {
              const isMe = entry.sales_email === myEmail
              return (
                <div key={entry.sales_email}
                  className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${isMe ? 'bg-[#eff6ff]' : 'hover:bg-gray-50'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${idx < 3 ? 'bg-[#1E1B4B] text-white' : 'bg-gray-100 text-[#9CA3AF]'}`}>
                    {idx < 3 ? MEDAL[idx] : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${isMe ? 'text-[#2232dd]' : 'text-[#1E1B4B]'}`}>
                      {entry.sales_name}{isMe ? ' 👈' : ''}
                    </p>
                    <p className="text-[#9CA3AF] text-xs">{entry.codes.join(' · ')}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-[#1E1B4B] text-sm">{entry.total_sales} closing</p>
                    <p className="text-[#9CA3AF] text-xs">Rp {(entry.total_commission / 1000).toFixed(0)}rb</p>
                  </div>
                </div>
              )
            })}
            {leaderboard.length === 0 && (
              <p className="text-center text-[#9CA3AF] text-sm py-10">Belum ada data closing.</p>
            )}
          </div>
        </div>

        {/* Rest of ranks (4+) sudah included in tabel di atas */}
        {rest.length > 0 && (
          <p className="text-center text-white/30 text-xs mt-4">
            {leaderboard.length} sales aktif · Update tiap 30 detik
          </p>
        )}
      </div>
    </div>
  )
}
