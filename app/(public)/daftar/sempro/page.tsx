'use client'
import { useState } from 'react'
import { Users, CheckCircle, Loader2, CreditCard, Building2 } from 'lucide-react'
import { PAYMENT_METHODS } from '@/lib/duitku'

const INPUT = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all placeholder:text-gray-400'

const PRICE   = 2_000_000
const PRODUCT = 'mentoring-sempro'

export default function DaftarSemproPage() {
  const [form, setForm]     = useState({ full_name: '', email: '', phone: '' })
  const [method, setMethod] = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!method) { setError('Pilih metode pembayaran terlebih dahulu'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/duitku/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, payment_method: method, product: PRODUCT }),
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
    <div className="min-h-screen bg-[#f4f8ff] py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#2232dd]/20 text-[#2232dd] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Users size={13} /> Mentoring Privat
          </div>
          <h1 className="text-3xl font-bold text-[#1E1B4B]">Daftar Mentoring Sempro</h1>
          <p className="text-[#9CA3AF] text-sm mt-2">Bimbingan 1-on-1 dari judul sampai proposal ACC. Isi form untuk lanjut bayar.</p>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Ringkasan Order</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-[#1E1B4B] text-sm">Mentoring Privat Sempro</p>
              <p className="text-[#9CA3AF] text-xs">9 pertemuan privat · 3 bulan masa aktif</p>
            </div>
            <p className="font-bold text-[#1E1B4B]">Rp {PRICE.toLocaleString('id-ID')}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
            <p className="text-sm font-semibold text-[#1E1B4B]">Total</p>
            <p className="text-lg font-bold text-[#2232dd]">Rp {PRICE.toLocaleString('id-ID')}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['9 Pertemuan Privat','9x Written Feedback','6x Online · 3x Offline','Akses Dashboard'].map(f => (
              <span key={f} className="flex items-center gap-1 text-[10px] text-[#2232dd] bg-[#eff6ff] border border-[#2232dd]/20 px-2.5 py-1 rounded-full font-medium">
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

          {/* Payment Method */}
          <div>
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Metode Pembayaran</p>
            <div className="grid grid-cols-1 gap-2">
              {PAYMENT_METHODS.map(m => (
                <button key={m.code} type="button" onClick={() => setMethod(m.code)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all cursor-pointer ${
                    method === m.code
                      ? 'border-[#2232dd] bg-[#eff6ff] shadow-sm'
                      : 'border-gray-200 hover:border-[#2232dd]/40 hover:bg-[#f4f8ff]'
                  }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${method === m.code ? 'bg-[#2232dd] text-white' : 'bg-gray-100 text-[#6B6B8A]'}`}>
                    {m.code === 'QRIS' ? <CreditCard size={14} /> : <Building2 size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1E1B4B]">{m.label}</p>
                    <p className="text-xs text-[#9CA3AF]">{m.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${method === m.code ? 'border-[#2232dd] bg-[#2232dd]' : 'border-gray-300'}`}>
                    {method === m.code && <div className="w-full h-full rounded-full bg-white scale-[0.4] block" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#2232dd] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#1a28b8] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : `Lanjut Bayar — Rp ${PRICE.toLocaleString('id-ID')}`}
          </button>

          <p className="text-center text-[#9CA3AF] text-[11px]">
            Pembayaran diproses oleh Duitku · Aman & Terenkripsi
          </p>
        </form>
      </div>
    </div>
  )
}
