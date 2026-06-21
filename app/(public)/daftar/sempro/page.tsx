'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Users, CheckCircle, Loader2, MessageCircle, Copy, Check } from 'lucide-react'

const INPUT = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all placeholder:text-gray-400'

const PRICE   = 2_000_000
const PRODUCT = 'mentoring-sempro'
const ADMIN_WA = '6289524785477'

export default function DaftarSemproPage() {
  const [form, setForm]     = useState({ full_name: '', email: '', phone: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product: PRODUCT }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Terjadi kesalahan'); setLoading(false); return }
      setSubmitted(true)
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const copyNominal = () => {
    navigator.clipboard.writeText(String(PRICE))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const waMessage = encodeURIComponent(
    `Halo admin, saya sudah transfer QRIS untuk Mentoring Privat Sempro.\n\nNama: ${form.full_name}\nEmail: ${form.email}\nNominal: Rp ${PRICE.toLocaleString('id-ID')}\n\n*Mohon konfirmasi pembayarannya ya. Terima kasih!*`
  )

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f4f8ff] py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#2232dd]/20 text-[#2232dd] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              <Users size={13} /> Mentoring Privat
            </div>
            <h1 className="text-2xl font-bold text-[#1E1B4B]">Selesaikan Pembayaran</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Scan QRIS di bawah, lalu konfirmasi ke admin</p>
          </div>

          {/* Nominal */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Nominal Transfer</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-[#2232dd]">Rp {PRICE.toLocaleString('id-ID')}</p>
              <button onClick={copyNominal} className="flex items-center gap-1.5 text-xs font-semibold text-[#2232dd] bg-[#eff6ff] border border-[#2232dd]/20 px-3 py-2 rounded-lg hover:bg-[#dbeafe] transition-colors">
                {copied ? <><Check size={12} /> Disalin!</> : <><Copy size={12} /> Salin</>}
              </button>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1">Mentoring Privat Sempro · 9 pertemuan</p>
          </div>

          {/* QRIS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 flex flex-col items-center">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4 self-start">Scan QRIS</p>
            <Image
              src="/images/Qris Code.JPG"
              alt="QRIS Teman Skripsi"
              width={280}
              height={280}
              className="rounded-xl border border-gray-100"
            />
            <p className="text-xs text-[#9CA3AF] mt-3 text-center">Buka aplikasi m-banking atau e-wallet → Pilih Scan QR</p>
          </div>

          {/* Instruksi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Langkah Selanjutnya</p>
            <ol className="flex flex-col gap-3">
              {[
                'Scan QRIS di atas & transfer nominal yang tertera',
                'Screenshot bukti pembayaran',
                'Kirim bukti ke WhatsApp admin di bawah',
                'Admin akan aktivasi akses dashboard kamu',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#2232dd] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-[#1E1B4B]">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* WA Button */}
          <a
            href={`https://wa.me/${ADMIN_WA}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#16a34a] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#15803d] transition-colors"
          >
            <MessageCircle size={16} /> Konfirmasi via WhatsApp Admin
          </a>
          <p className="text-center text-[#9CA3AF] text-[11px] mt-3">
            Akses dashboard aktif setelah pembayaran diverifikasi admin
          </p>
        </div>
      </div>
    )
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
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#1E1B4B] text-sm">Mentoring Privat Sempro</p>
              <p className="text-[#9CA3AF] text-xs">9 pertemuan privat · 3 bulan masa aktif</p>
            </div>
            <p className="font-bold text-[#1E1B4B] flex-shrink-0">Rp {PRICE.toLocaleString('id-ID')}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center gap-3">
            <p className="text-sm font-semibold text-[#1E1B4B]">Total</p>
            <p className="text-lg font-bold text-[#2232dd] flex-shrink-0">Rp {PRICE.toLocaleString('id-ID')}</p>
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

          <button type="submit" disabled={loading}
            className="w-full bg-[#2232dd] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#1a28b8] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : `Lanjut Bayar — Rp ${PRICE.toLocaleString('id-ID')}`}
          </button>

          <p className="text-center text-[#9CA3AF] text-[11px]">
            Data kamu aman & tidak dibagikan ke pihak lain
          </p>
        </form>
      </div>
    </div>
  )
}
