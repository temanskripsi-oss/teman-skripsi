'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  currentUrl: string | null
  name: string
  onUpdated?: (url: string) => void
}

export default function ProfilePhotoUpload({ userId, currentUrl, name, onUpdated }: Props) {
  const [url, setUrl]         = useState<string | null>(currentUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { setError('Ukuran file maks 3 MB'); return }
    if (!file.type.startsWith('image/')) { setError('Harus file gambar'); return }

    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const ext  = file.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`

      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (upErr) throw upErr

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      const finalUrl = `${publicUrl}?t=${Date.now()}`

      await supabase.from('profiles').update({ avatar_url: finalUrl }).eq('id', userId)

      setUrl(finalUrl)
      onUpdated?.(finalUrl)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload gagal')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group cursor-pointer" onClick={() => !loading && inputRef.current?.click()}>
        {url ? (
          <Image src={url} alt={name} width={80} height={80}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {initials}
          </div>
        )}
        <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {loading
            ? <Loader2 size={20} className="text-white animate-spin" />
            : <Camera size={20} className="text-white" />
          }
        </div>
      </div>

      <button type="button" onClick={() => !loading && inputRef.current?.click()}
        className="text-xs text-[#2232dd] hover:underline font-medium cursor-pointer disabled:opacity-50"
        disabled={loading}>
        {loading ? 'Mengupload...' : 'Ganti foto'}
      </button>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
