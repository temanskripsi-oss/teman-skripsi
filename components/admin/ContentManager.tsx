'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2, Pencil, Trash2, Video, Gift, Play } from 'lucide-react'
import {
  createVideoAction, updateVideoAction, deleteVideoAction,
  createFreebieAction, updateFreebieAction, deleteFreebieAction,
} from '@/app/(admin)/admin/actions'
import type { Video as VideoType, Freebie } from '@/types'

const INPUT = 'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#2232dd]/30 focus:border-[#2232dd] transition-all'
const SELECT = INPUT + ' bg-white cursor-pointer'

const PRODUCTS = [
  { value: 'all', label: 'All Access' },
  { value: 'fastrack', label: 'Fastrack' },
  { value: 'mentoring-sempro', label: 'Mentoring Sempro' },
  { value: 'mentoring-penelitian', label: 'Mentoring Penelitian' },
]

const EMPTY_VIDEO = { title: '', description: '', youtube_url: '', week_number: 1, order_index: 1, product: 'all' }
const EMPTY_FREEBIE = { title: '', description: '', file_url: '', product: 'all', order_index: 1 }

interface Props {
  videos: VideoType[]
  freebies: Freebie[]
}

export default function ContentManager({ videos, freebies }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'videos' | 'freebies'>('videos')
  const [isPending, startTransition] = useTransition()

  // Video modal
  const [videoModal, setVideoModal] = useState<'add' | string | null>(null)
  const [videoForm, setVideoForm] = useState(EMPTY_VIDEO)
  const [videoError, setVideoError] = useState('')

  // Freebie modal
  const [freebieModal, setFreebieModal] = useState<'add' | string | null>(null)
  const [freebieForm, setFreebieForm] = useState(EMPTY_FREEBIE)
  const [freebieError, setFreebieError] = useState('')

  // Grouped videos by week
  const grouped: Record<number, VideoType[]> = {}
  videos.forEach(v => {
    if (!grouped[v.week_number]) grouped[v.week_number] = []
    grouped[v.week_number].push(v)
  })

  const openAddVideo = () => {
    const maxOrder = videos.length > 0 ? Math.max(...videos.map(v => v.order_index)) + 1 : 1
    setVideoForm({ ...EMPTY_VIDEO, order_index: maxOrder })
    setVideoError('')
    setVideoModal('add')
  }
  const openEditVideo = (v: VideoType) => {
    setVideoForm({ title: v.title, description: v.description ?? '', youtube_url: v.youtube_url, week_number: v.week_number, order_index: v.order_index, product: v.product })
    setVideoError('')
    setVideoModal(v.id)
  }
  const handleVideoSave = (e: React.FormEvent) => {
    e.preventDefault()
    setVideoError('')
    startTransition(async () => {
      const res = videoModal === 'add' ? await createVideoAction(videoForm) : await updateVideoAction(videoModal!, videoForm)
      if (res.error) { setVideoError(res.error); return }
      setVideoModal(null)
      router.refresh()
    })
  }
  const handleDeleteVideo = (id: string) => {
    if (!confirm('Hapus video ini?')) return
    startTransition(async () => { await deleteVideoAction(id); router.refresh() })
  }

  const openAddFreebie = () => {
    setFreebieForm({ ...EMPTY_FREEBIE, order_index: freebies.length + 1 })
    setFreebieError('')
    setFreebieModal('add')
  }
  const openEditFreebie = (f: Freebie) => {
    setFreebieForm({ title: f.title, description: f.description ?? '', file_url: f.file_url, product: f.product, order_index: f.order_index })
    setFreebieError('')
    setFreebieModal(f.id)
  }
  const handleFreebieSave = (e: React.FormEvent) => {
    e.preventDefault()
    setFreebieError('')
    startTransition(async () => {
      const res = freebieModal === 'add' ? await createFreebieAction(freebieForm) : await updateFreebieAction(freebieModal!, freebieForm)
      if (res.error) { setFreebieError(res.error); return }
      setFreebieModal(null)
      router.refresh()
    })
  }
  const handleDeleteFreebie = (id: string) => {
    if (!confirm('Hapus freebie ini?')) return
    startTransition(async () => { await deleteFreebieAction(id); router.refresh() })
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit mb-6 shadow-sm">
        {[
          { key: 'videos', icon: Video, label: `Video (${videos.length})` },
          { key: 'freebies', icon: Gift, label: `Freebies (${freebies.length})` },
        ].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setTab(key as 'videos' | 'freebies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              tab === key ? 'bg-[#2232dd] text-white shadow-sm' : 'text-[#9CA3AF] hover:text-[#1E1B4B]'
            }`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Videos tab */}
      {tab === 'videos' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={openAddVideo}
              className="flex items-center gap-2 bg-[#2232dd] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] transition-colors cursor-pointer">
              <Plus size={15} /> Tambah Video
            </button>
          </div>

          {videos.length === 0 ? (
            <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
              <p className="text-[#9CA3AF] text-sm">Belum ada video. Tambahkan video pertama.</p>
            </div>
          ) : (
            Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b)).map(([week, vids]) => (
              <div key={week} className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 text-xs font-bold px-3 py-1.5 rounded-full">
                    Minggu {week}
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                  {vids.sort((a, b) => a.order_index - b.order_index).map(v => (
                    <div key={v.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="p-2 rounded-xl bg-[#eff6ff] text-[#2232dd] flex-shrink-0">
                        <Play size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1E1B4B] text-sm truncate">{v.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[#9CA3AF] text-xs">#{v.order_index}</span>
                          <span className="text-xs bg-gray-100 text-[#6B6B8A] px-2 py-0.5 rounded-full">{v.product}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button onClick={() => openEditVideo(v)}
                          className="p-1.5 rounded-lg hover:bg-[#eff6ff] text-[#9CA3AF] hover:text-[#2232dd] transition-colors cursor-pointer">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDeleteVideo(v.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Freebies tab */}
      {tab === 'freebies' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={openAddFreebie}
              className="flex items-center gap-2 bg-[#2232dd] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] transition-colors cursor-pointer">
              <Plus size={15} /> Tambah Freebie
            </button>
          </div>
          {freebies.length === 0 ? (
            <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
              <p className="text-[#9CA3AF] text-sm">Belum ada freebie. Tambahkan freebie pertama.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {freebies.sort((a, b) => a.order_index - b.order_index).map(f => (
                <div key={f.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="p-2 rounded-xl bg-green-50 text-green-600 flex-shrink-0">
                    <Gift size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1E1B4B] text-sm truncate">{f.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[#9CA3AF] text-xs">#{f.order_index}</span>
                      <span className="text-xs bg-gray-100 text-[#6B6B8A] px-2 py-0.5 rounded-full">{f.product}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => openEditFreebie(f)}
                      className="p-1.5 rounded-lg hover:bg-[#eff6ff] text-[#9CA3AF] hover:text-[#2232dd] transition-colors cursor-pointer">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDeleteFreebie(f.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video Modal */}
      {videoModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">{videoModal === 'add' ? 'Tambah Video' : 'Edit Video'}</h2>
              <button onClick={() => setVideoModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleVideoSave} className="p-6 flex flex-col gap-4">
              {videoError && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{videoError}</p>}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Judul</label>
                <input required value={videoForm.title} onChange={e => setVideoForm(f => ({ ...f, title: e.target.value }))} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">YouTube URL</label>
                <input required value={videoForm.youtube_url} onChange={e => setVideoForm(f => ({ ...f, youtube_url: e.target.value }))} className={INPUT} placeholder="https://youtu.be/..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Deskripsi</label>
                <textarea value={videoForm.description} rows={2} onChange={e => setVideoForm(f => ({ ...f, description: e.target.value }))} className={INPUT + ' resize-none'} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Minggu</label>
                  <input type="number" min={1} value={videoForm.week_number} onChange={e => setVideoForm(f => ({ ...f, week_number: Number(e.target.value) }))} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Urutan</label>
                  <input type="number" min={1} value={videoForm.order_index} onChange={e => setVideoForm(f => ({ ...f, order_index: Number(e.target.value) }))} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Produk</label>
                  <select value={videoForm.product} onChange={e => setVideoForm(f => ({ ...f, product: e.target.value }))} className={SELECT}>
                    {PRODUCTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setVideoModal(null)} className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isPending} className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {isPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Freebie Modal */}
      {freebieModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1E1B4B] text-base">{freebieModal === 'add' ? 'Tambah Freebie' : 'Edit Freebie'}</h2>
              <button onClick={() => setFreebieModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={16} className="text-[#9CA3AF]" />
              </button>
            </div>
            <form onSubmit={handleFreebieSave} className="p-6 flex flex-col gap-4">
              {freebieError && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-xl px-3 py-2">{freebieError}</p>}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Judul</label>
                <input required value={freebieForm.title} onChange={e => setFreebieForm(f => ({ ...f, title: e.target.value }))} className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">File URL (Google Drive / Notion / dll)</label>
                <input required value={freebieForm.file_url} onChange={e => setFreebieForm(f => ({ ...f, file_url: e.target.value }))} className={INPUT} placeholder="https://drive.google.com/..." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Deskripsi</label>
                <textarea value={freebieForm.description} rows={2} onChange={e => setFreebieForm(f => ({ ...f, description: e.target.value }))} className={INPUT + ' resize-none'} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Urutan</label>
                  <input type="number" min={1} value={freebieForm.order_index} onChange={e => setFreebieForm(f => ({ ...f, order_index: Number(e.target.value) }))} className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B4B] mb-1.5">Produk</label>
                  <select value={freebieForm.product} onChange={e => setFreebieForm(f => ({ ...f, product: e.target.value }))} className={SELECT}>
                    {PRODUCTS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setFreebieModal(null)} className="flex-1 border border-gray-200 text-[#6B6B8A] py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">Batal</button>
                <button type="submit" disabled={isPending} className="flex-1 bg-[#2232dd] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a28b8] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2">
                  {isPending ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
