'use client'
import { useState } from 'react'
import Image from 'next/image'
import { GraduationCap, CheckCircle, Loader2, MessageCircle, Copy, Check, Tag, X } from 'lucide-react'
import { getNextBatch } from '@/lib/mayar'

const INPUT = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all placeholder:text-gray-400'

const BASE_PRICE = 500_000
const PROMO_ORIGINAL_PRICE = 1_000_000
const ADMIN_WA = '6289524785477'

export default function DaftarPage() {
  const { label: batchLabel } = getNextBatch()

  const [form, setForm] = useState({ full_name: '', email: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [finalPrice, setFinalPrice] = useState(BASE_PRICE)
  const [copied, setCopied] = useState(false)

  // Kode diskon state
  const [codeInput, setCodeInput] = useState('')
  const [codeLoading, setCodeLoading] = useState(false)
  const [codeError, setCodeError] = useState('')
  const [appliedCode, setAppliedCode] = useState<{ code: string; discount: number } | null>(null)

  const validateCode = async () => {
    if (!codeInput.trim()) return
    setCodeLoading(true)
    setCodeError('')
    try {
      const res = await fetch('/api/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput, product: 'fastrack' }),
      })
      const data = await res.json()
      if (data.valid) {
        setAppliedCode({ code: data.code, discount: data.discount })
        setFinalPrice(BASE_PRICE - data.discount)
      } else {
        setCodeError(data.message)
      }
    } catch {
      setCodeError('Gagal memvalidasi kode.')
    } finally {
      setCodeLoading(false)
    }
  }

  const removeCode = () => {
    setAppliedCode(null)
    setCodeInput('')
    setCodeError('')
    setFinalPrice(BASE_PRICE)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          affiliate_code: appliedCode?.code ?? null,
          discount_amount: appliedCode?.discount ?? 0,
        }),
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
    navigator.clipboard.writeText(String(finalPrice))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const waMessage = encodeURIComponent(
    `Halo admin, saya sudah transfer QRIS untuk Fastrack Sempro Batch ${batchLabel}.\n\nNama: ${form.full_name}\nEmail: ${form.email}\nNominal: Rp ${finalPrice.toLocaleString('id-ID')}${appliedCode ? `\nKode Diskon: ${appliedCode.code}` : ''}\n\n*Mohon konfirmasi pembayarannya ya. Terima kasih!*`
  )

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f4f8ff] py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#2232dd]/20 text-[#2232dd] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              <GraduationCap size={13} /> Batch {batchLabel}
            </div>
            <h1 className="text-2xl font-bold text-[#1E1B4B]">Selesaikan Pembayaran</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">Scan QRIS di bawah, lalu konfirmasi ke admin</p>
          </div>

          {/* Nominal */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Nominal Transfer</p>
            {appliedCode && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#9CA3AF]">Harga Normal</span>
                <span className="line-through text-[#EF4444]">Rp {BASE_PRICE.toLocaleString('id-ID')}</span>
              </div>
            )}
            {appliedCode && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#16a34a]">Diskon ({appliedCode.code})</span>
                <span className="text-[#16a34a] font-semibold">- Rp {appliedCode.discount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-[#2232dd]">Rp {finalPrice.toLocaleString('id-ID')}</p>
              <button onClick={copyNominal} className="flex items-center gap-1.5 text-xs font-semibold text-[#2232dd] bg-[#eff6ff] border border-[#2232dd]/20 px-3 py-2 rounded-lg hover:bg-[#dbeafe] transition-colors">
                {copied ? <><Check size={12} /> Disalin!</> : <><Copy size={12} /> Salin</>}
              </button>
            </div>
            {appliedCode && (
              <p className="text-xs text-[#16a34a] mt-2 font-medium">🎉 Kamu hemat Rp {appliedCode.discount.toLocaleString('id-ID')}!</p>
            )}
            <p className="text-xs text-[#9CA3AF] mt-1">Fast Track Sempro · Batch {batchLabel}</p>
          </div>

          {/* QRIS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 flex flex-col items-center">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4 self-start">Scan QRIS</p>
            <Image src="/images/QRIS.jpeg" alt="QRIS Teman Skripsi" width={280} height={280} className="rounded-xl border border-gray-100" />
            <p className="text-xs text-[#9CA3AF] mt-3 text-center">Buka aplikasi m-banking atau e-wallet → Pilih Scan QR</p>
          </div>

          {/* Instruksi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Langkah Selanjutnya</p>
            <ol className="flex flex-col gap-3">
              {['Scan QRIS di atas & transfer nominal yang tertera','Screenshot bukti pembayaran','Kirim bukti ke WhatsApp admin di bawah','Admin akan aktivasi akses dashboard kamu'].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#2232dd] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-[#1E1B4B]">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <a href={`https://wa.me/${ADMIN_WA}?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#16a34a] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#15803d] transition-colors">
            <MessageCircle size={16} /> Konfirmasi via WhatsApp Admin
          </a>
          <p className="text-center text-[#9CA3AF] text-[11px] mt-3">Akses dashboard aktif setelah pembayaran diverifikasi admin</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f8ff] py-12 px-4">
      <div className="max-w-lg mx-auto">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#eff6ff] border border-[#2232dd]/20 text-[#2232dd] text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <GraduationCap size={13} /> Batch {batchLabel}
          </div>
          <h1 className="text-3xl font-bold text-[#1E1B4B]">Daftar Fastrack Sempro</h1>
          <p className="text-[#9CA3AF] text-sm mt-2">30 hari, proposal siap seminar. Isi form di bawah untuk lanjut bayar.</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">Ringkasan Order</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-[#1E1B4B] text-sm">Fast Track Sempro</p>
              <p className="text-[#9CA3AF] text-xs">Batch {batchLabel} · Akses 30 hari</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-0.5">
                <span className="text-[#9CA3AF] text-xs line-through">Rp {PROMO_ORIGINAL_PRICE.toLocaleString('id-ID')}</span>
                <span className="inline-flex items-center bg-[#FEF3C7] text-[#92400E] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#FDE68A]">
                  Diskon 50%
                </span>
              </div>
              <p className="font-bold text-[#1E1B4B]">Rp {BASE_PRICE.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            {appliedCode ? (
              <>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#9CA3AF]">Harga Normal</span>
                  <span className="line-through text-[#EF4444]">Rp {BASE_PRICE.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#16a34a]">Diskon ({appliedCode.code})</span>
                  <span className="text-[#16a34a] font-semibold">- Rp {appliedCode.discount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <p className="text-sm font-semibold text-[#1E1B4B]">Total Bayar</p>
                  <p className="text-lg font-bold text-[#2232dd]">Rp {finalPrice.toLocaleString('id-ID')}</p>
                </div>
                <p className="text-xs text-[#16a34a] mt-1.5 font-medium">🎉 Kamu hemat Rp {appliedCode.discount.toLocaleString('id-ID')}!</p>
              </>
            ) : (
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-[#1E1B4B]">Total</p>
                <p className="text-lg font-bold text-[#2232dd]">Rp {BASE_PRICE.toLocaleString('id-ID')}</p>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Video Materi Lengkap','Template & Freebies','Tugas Mingguan','Written Feedback'].map(f => (
              <span key={f} className="flex items-center gap-1 text-[10px] text-[#16a34a] bg-green-50 border border-green-100 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle size={10} /> {f}
              </span>
            ))}
          </div>
          <p className="text-[#B45309] text-[11px] font-semibold mt-3">Diskon berlaku 1–25 Juli 2026. Tanggal 26–31 kembali ke harga normal, jika kuota masih tersedia.</p>
        </div>

        {/* Kode Diskon */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={13} className="text-[#2232dd]" />
            <p className="text-xs font-semibold text-[#1E1B4B]">Punya kode diskon?</p>
          </div>
          {appliedCode ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-[#16a34a]" />
                <span className="text-sm font-semibold text-[#16a34a]">Kode &quot;{appliedCode.code}&quot; berhasil!</span>
              </div>
              <button onClick={removeCode} className="text-[#9CA3AF] hover:text-red-400 transition-colors">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={codeInput}
                onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError('') }}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), validateCode())}
                placeholder="Masukkan kode..."
                className={`flex-1 border rounded-xl px-4 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 transition-all placeholder:text-gray-400 ${codeError ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-[#2232dd]/30 focus:border-[#2232dd]'}`}
              />
              <button
                type="button"
                onClick={validateCode}
                disabled={codeLoading || !codeInput.trim()}
                className="px-4 py-2.5 bg-[#2232dd] text-white text-xs font-bold rounded-xl hover:bg-[#1a28b8] disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                {codeLoading ? <Loader2 size={13} className="animate-spin" /> : 'Pakai'}
              </button>
            </div>
          )}
          {codeError && <p className="text-xs text-red-500 mt-2">{codeError}</p>}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Data Diri</p>
          {error && <div className="bg-red-50 border border-red-100 text-red-500 text-xs rounded-xl px-4 py-3">{error}</div>}
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
            {loading ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : `Lanjut Bayar — Rp ${finalPrice.toLocaleString('id-ID')}`}
          </button>
          <p className="text-center text-[#9CA3AF] text-[11px]">Data kamu aman & tidak dibagikan ke pihak lain</p>
        </form>
      </div>
    </div>
  )
}
