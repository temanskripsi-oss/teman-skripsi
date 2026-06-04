import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VideosClient from '@/components/dashboard/VideosClient'
import type { Video } from '@/types'

export default async function VideosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile }  = await supabase.from('profiles').select('product, start_date').eq('id', user.id).single()

  // Fastrack: locked sampai H-3 sebelum start_date
  // Jika start_date belum di-set admin → tetap locked
  let unlockedAt: Date | null = null
  const isFastrack = profile?.product === 'fastrack'
  if (isFastrack && profile?.start_date) {
    const batchStart = new Date(profile.start_date)
    unlockedAt = new Date(batchStart)
    unlockedAt.setDate(unlockedAt.getDate() - 3)
  }
  const isLocked = isFastrack && (unlockedAt === null || new Date() < unlockedAt)

  const { data: videos }   = await supabase
    .from('videos')
    .select('*')
    .or(`product.eq.all,product.eq.${profile?.product}`)
    .order('week_number', { ascending: true })
    .order('order_index', { ascending: true })
  const { data: progress } = await supabase
    .from('video_progress')
    .select('video_id')
    .eq('user_id', user.id)

  const watchedIds = progress?.map(p => p.video_id) ?? []

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Video Materi</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Tonton semua materi kurikulum program kamu.</p>
      </div>
      <VideosClient
        videos={(videos ?? []) as Video[]}
        watchedIds={watchedIds}
        isLocked={isLocked}
        unlockedAt={unlockedAt?.toISOString() ?? null}
      />
    </div>
  )
}
