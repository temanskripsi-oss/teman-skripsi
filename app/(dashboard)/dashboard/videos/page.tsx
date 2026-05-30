import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Play, CheckCircle, Video } from 'lucide-react'

export default async function VideosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile }  = await supabase.from('profiles').select('product').eq('id', user.id).single()
  const { data: videos }   = await supabase.from('videos').select('*').or(`product.eq.all,product.eq.${profile?.product}`).order('week_number',{ascending:true}).order('order_index',{ascending:true})
  const { data: progress } = await supabase.from('video_progress').select('video_id').eq('user_id', user.id)

  const watchedIds = new Set(progress?.map(p => p.video_id))
  const grouped: Record<number, typeof videos> = {}
  videos?.forEach(v => {
    if (!grouped[v.week_number]) grouped[v.week_number] = []
    grouped[v.week_number]!.push(v)
  })

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Video Materi</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Tonton semua materi kurikulum program kamu.</p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
            <Video size={24} className="text-[#2232dd]" />
          </div>
          <p className="text-[#9CA3AF] text-sm">Materi video akan segera ditambahkan oleh mentor.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([week, vids]) => (
          <div key={week} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20 text-xs font-bold px-3 py-1.5 rounded-full">
                Minggu {week}
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vids?.map(video => {
                const watched = watchedIds.has(video.id)
                return (
                  <a key={video.id} href={video.youtube_url} target="_blank" rel="noopener noreferrer"
                    className="bg-white rounded-2xl p-4 flex gap-4 items-start border border-gray-100 hover:border-[#2232dd]/20 hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm group">
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${watched ? 'bg-green-50 text-[#16a34a]' : 'bg-[#eff6ff] text-[#2232dd]'}`}>
                      {watched ? <CheckCircle size={18} /> : <Play size={18} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1E1B4B] text-sm mb-0.5 truncate">{video.title}</p>
                      {video.description && <p className="text-[#9CA3AF] text-xs leading-relaxed line-clamp-2">{video.description}</p>}
                      <p className={`text-xs mt-1.5 font-medium ${watched ? 'text-[#16a34a]' : 'text-[#9CA3AF]'}`}>
                        {watched ? 'Sudah ditonton' : 'Belum ditonton'}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
