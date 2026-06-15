'use client'
import { useState } from 'react'
import { FlaskConical, CheckCircle, Loader2 } from 'lucide-react'

const INPUT = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#0f766e]/30 focus:border-[#0f766e] transition-all placeholder:text-gray-400'

const PRICE   = 2_250_000
const PRODUCT = 'mentoring-penelitian'

export default function DaftarPenelitianPage() {
  const [form, setForm]     = useState({ full_name: '', email: '', phone: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/mayar/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product: PRODUCT }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Terjadi kesalahan'); setLoading(false); return }
      window.location.href = data.paymentUrl
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#ccfbf1] border border-[#0f766e]/20 text-[#0f766e] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <FlaskConical size={13} /> Mentoring Privat Bab 4–5
          </div>
          <h1 className="text-3xl font-bold text-[#1E1B4B]">Daftar Mentoring<br />Bab 4–5</h1>
          <p className="text-[#9CA3AF] text-sm mt-2">Dari analisis data sampai sidang. Isi form untuk lanjut bayar.</p>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Ringkasan Order</p>
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1E1B4B] text-sm">Mentoring Privat Bab 4–5</p>
              <p className="text-[#9CA3AF] text-xs">9 pertemuan privat · 3 bulan masa aktif</p>
            </div>
            <p className="font-bold text-[#1E1B4B] flex-shrink-0">Rp {PRICE.toLocaleString('id-ID')}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center gap-3">
            <p className="text-sm font-semibold text-[#1E1B4B]">Total</p>
            <p className="text-lg font-bold text-[#0f766e] flex-shrink-0">Rp {PRICE.toLocaleString('id-ID')}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['9 Pertemuan Privat','9x Written Feedback','6x Online · 3x Offline','Akses Dashboard'].map(f => (
              <span key={f} className="flex items-center gap-1 text-[10px] text-[#0f766e] bg-[#ccfbf1] border border-[#0f766e]/20 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle size={10} /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Data Diri</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3">{error}</div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Nama Lengkap</label>
            <input required value={form.full_name} placeholder="Sesuai KTP/kartu mahasiswa"
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Email Aktif</label>
            <input required type="email" value={form.email} placeholder="email@kamu.com"
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={INPUT} />
            <p className="text-[#9CA3AF] text-[11px] mt-1">Email ini akan digunakan untuk login dashboard</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">No. WhatsApp</label>
            <input required value={form.phone} placeholder="08xxxxxxxxxx"
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={INPUT} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#0f766e] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#0d6660] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : `Lanjut Bayar — Rp ${PRICE.toLocaleString('id-ID')}`}
          </button>

          <p className="text-center text-[#9CA3AF] text-[11px]">
            Pembayaran diproses oleh Mayar · Aman & Terenkripsi
          </p>
        </form>
      </div>
    </div>
  )
}
