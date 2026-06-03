import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Video, Gift, ClipboardList, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile }  = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: sessions } = await supabase.from('sessions').select('*').eq('user_id', user.id).eq('status','upcoming').order('scheduled_at',{ascending:true}).limit(1)
  const { data: videos }   = await supabase.from('videos').select('id').or(`product.eq.all,product.eq.${profile?.product}`)
  const { data: progress } = await supabase.from('video_progress').select('id').eq('user_id', user.id)

  const total   = videos?.length ?? 0
  const watched = progress?.length ?? 0
  const pct     = total > 0 ? Math.round((watched / total) * 100) : 0
  const next    = sessions?.[0]
  const name    = profile?.full_name ?? user.email?.split('@')[0] ?? 'Kamu'

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt={name} width={56} height={56}
            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-gray-100 shadow-sm" />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2232dd] to-[#7C6FCD] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {name[0]?.toUpperCase() ?? '?'}
          </div>
        )}
        <div>
          <p className="text-[#9CA3AF] text-sm mb-0.5">Dashboard</p>
          <h1 className="text-3xl font-bold text-[#1E1B4B]">Halo, {name}!</h1>
          <p className="text-[#9CA3AF] text-sm mt-0.5">Kamu semakin dekat dengan wisuda.</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-6 mb-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-[#1E1B4B] text-sm">Progress Kurikulum</p>
          <span className="text-[#2232dd] font-bold text-sm">{pct}%</span>
        </div>
        <div className="h-2.5 bg-[#f4f8ff] rounded-full overflow-hidden border border-gray-100">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width:`${pct}%`, background:'linear-gradient(90deg,#2232dd,#4DD9C0)' }} />
        </div>
        <p className="text-[#9CA3AF] text-xs mt-2">{watched} dari {total} video ditonton</p>
      </div>

      {/* Next session */}
      {next && (
        <div className="bg-[#1E1B4B] rounded-2xl p-6 mb-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#2232dd] rounded-full blur-[80px] opacity-30 pointer-events-none" />
          <div className="relative z-10">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">Jadwal Berikutnya</p>
            <p className="text-lg font-bold text-white mb-0.5">
              {new Date(next.scheduled_at).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
            </p>
            <p className="text-white/50 text-sm capitalize">{next.session_type} · Pertemuan {next.session_number}</p>
            {next.zoom_link && (
              <a href={next.zoom_link} target="_blank" rel="noopener noreferrer"
                className="inline-block mt-4 bg-white text-[#1E1B4B] text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                Buka Zoom
              </a>
            )}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href:'/dashboard/videos',   icon:Video,         label:'Video Materi',        desc:'Tonton materi kurikulum',           color:'#2232dd', bg:'#eff6ff' },
          { href:'/dashboard/freebies', icon:Gift,          label:'Template & Freebies', desc:'Download template skripsi',         color:'#16a34a', bg:'#f0fdf4' },
          { href:'/dashboard/schedule', icon:Calendar,      label:'Jadwal Bimbingan',    desc:'Lihat sesi bimbinganmu',            color:'#7C6FCD', bg:'#f5f3ff' },
          { href:'/dashboard/tasks',    icon:ClipboardList, label:'Tugas Mingguan',       desc:'Kumpulkan & pantau progres tugas',  color:'#ea580c', bg:'#fff7ed' },
          { href:'/dashboard/feedback', icon:FileText,      label:'Written Feedback',     desc:'Saran & arahan dari mentor',        color:'#0891b2', bg:'#ecfeff' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <Link key={i} href={item.href}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#2232dd]/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-4 cursor-pointer shadow-sm">
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background:item.bg, color:item.color }}>
                <Icon size={18} />
              </div>
              <div>
                <p className="font-semibold text-[#1E1B4B] text-sm">{item.label}</p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">{item.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
