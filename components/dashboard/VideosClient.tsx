'use client'
import { useState, useTransition } from 'react'
import { Lock, Play, CheckCircle, X, Video, CalendarClock } from 'lucide-react'
import { markVideoWatchedAction } from '@/app/(dashboard)/dashboard/actions'
import type { Video as VideoType } from '@/types'

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/)
  return match?.[1] ?? null
}

interface Props {
  videos: VideoType[]
  watchedIds: string[]
  isLocked?: boolean
  unlockedAt?: string | null
}

export default function VideosClient({ videos, watchedIds: initialWatchedIds, isLocked = false, unlockedAt }: Props) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [activeVideo, setActiveVideo] = useState<VideoType | null>(null)
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set(initialWatchedIds))
  const [isPending, startTransition] = useTransition()

  const weeks = [...new Set(videos.map(v => v.week_number))].sort((a, b) => a - b)
  const filtered = selectedWeek !== null
    ? videos.filter(v => v.week_number === selectedWeek)
    : videos

  const handleMarkWatched = (videoId: string) => {
    startTransition(async () => {
      await markVideoWatchedAction(videoId)
      setWatchedIds(prev => new Set([...prev, videoId]))
    })
  }

  if (isLocked && unlockedAt) {
    const unlockDate = new Date(unlockedAt)
    const unlockLabel = unlockDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    const now = new Date()
    const diffMs = unlockDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#f5f3ff] flex items-center justify-center mx-auto mb-5">
          <CalendarClock size={28} className="text-[#7C6FCD]" />
        </div>
        <h2 className="text-xl font-bold text-[#1E1B4B] mb-2">Video materi dibuka H-3 sebelum batch mulai</h2>
        <p className="text-[#6B6B8A] text-sm leading-relaxed mb-5">
          Kami sengaja atur begini supaya kamu belajar bareng teman-teman satu batch, tetap fokus, dan hasilnya lebih maksimal.
        </p>
        <div className="bg-[#f5f3ff] rounded-2xl px-6 py-4 border border-[#7C6FCD]/15 mb-5 inline-block">
          <p className="text-[#9CA3AF] text-xs mb-1">Video terbuka mulai</p>
          <p className="text-[#7C6FCD] font-bold text-lg">{unlockLabel}</p>
          <p className="text-[#9CA3AF] text-xs mt-1">{diffDays} hari lagi</p>
        </div>
        <p className="text-[#9CA3AF] text-xs leading-relaxed">
          Sambil nunggu, eksplor dulu fitur lain di dashboard — jadwal bimbingan, tugas, dan progres kamu sudah bisa diakses sekarang.
        </p>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
          <Video size={24} className="text-[#2232dd]" />
        </div>
        <p className="text-[#9CA3AF] text-sm">Materi video akan segera ditambahkan oleh mentor.</p>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-52 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-[#1E1B4B] uppercase tracking-widest">Courses:</p>
          </div>
          <div className="p-2">
            <button
              onClick={() => setSelectedWeek(null)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer mb-1 ${
                selectedWeek === null
                  ? 'text-[#2232dd] font-semibold underline underline-offset-2'
                  : 'text-[#6B6B8A] hover:text-[#1E1B4B] hover:bg-[#f4f8ff]'
              }`}>
              All Classes
            </button>
            <div className="h-px bg-gray-100 my-1.5 mx-1" />
            {weeks.map(week => (
              <button key={week}
                onClick={() => setSelectedWeek(week)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                  selectedWeek === week
                    ? 'text-[#2232dd] font-semibold underline underline-offset-2'
                    : 'text-[#6B6B8A] hover:text-[#1E1B4B] hover:bg-[#f4f8ff]'
                }`}>
                Minggu {week}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Grid */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1E1B4B] mb-5">
          {selectedWeek !== null ? `Minggu ${selectedWeek}` : 'All Classes'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((video, idx) => {
            const videoId = getYouTubeId(video.youtube_url)
            const thumbnail = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : null
            const watched = watchedIds.has(video.id)
            const num = String(idx + 1).padStart(2, '0')

            return (
              <button key={video.id} onClick={() => setActiveVideo(video)}
                className="text-left group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#1E1B4B] mb-2.5 shadow-sm">
                  {thumbnail ? (
                    <img src={thumbnail} alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E1B4B] to-[#2232dd] flex items-center justify-center">
                      <Play size={28} className="text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                  {watched ? (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow">
                      <CheckCircle size={13} className="text-white" />
                    </div>
                  ) : (
                    <div className="absolute top-2.5 left-2.5 text-white/80">
                      <Lock size={13} />
                    </div>
                  )}
                  {/* Play button on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <Play size={20} className="text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                {/* Title */}
                <p className="text-sm text-[#6B6B8A] leading-snug">
                  <span className="font-medium text-[#1E1B4B]">{num}.</span> {video.title}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Video Player Modal */}
      {activeVideo && (() => {
        const videoId = getYouTubeId(activeVideo.youtube_url)
        const watched = watchedIds.has(activeVideo.id)
        return (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
            onClick={e => { if (e.target === e.currentTarget) setActiveVideo(null) }}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-[#1E1B4B] text-base truncate pr-4">{activeVideo.title}</h2>
                <button onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0">
                  <X size={16} className="text-[#9CA3AF]" />
                </button>
              </div>

              {/* Player */}
              {videoId ? (
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-50 flex items-center justify-center">
                  <p className="text-[#9CA3AF] text-sm">Video tidak dapat dimuat</p>
                </div>
              )}

              {/* Footer */}
              <div className="px-6 py-4 flex items-center justify-between gap-4">
                <p className="text-[#6B6B8A] text-xs flex-1 line-clamp-2">
                  {activeVideo.description || ''}
                </p>
                <button
                  onClick={() => { handleMarkWatched(activeVideo.id); setActiveVideo(null) }}
                  disabled={watched || isPending}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    watched
                      ? 'bg-green-50 text-green-600 border border-green-100 cursor-default'
                      : 'bg-[#2232dd] text-white hover:bg-[#1a28b8] disabled:opacity-60'
                  }`}>
                  {watched
                    ? <><CheckCircle size={14} /> Sudah ditonton</>
                    : isPending
                    ? 'Menyimpan...'
                    : <><CheckCircle size={14} /> Tandai Selesai</>}
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
