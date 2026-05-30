import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MapPin, Video, CheckCircle, Clock, Calendar } from 'lucide-react'

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sessions } = await supabase
    .from('sessions').select('*').eq('user_id', user.id).order('session_number', { ascending: true })

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Jadwal Bimbingan</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Semua jadwal pertemuan dengan mentor kamu.</p>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="bg-white rounded-2xl p-14 text-center border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
            <Calendar size={24} className="text-[#2232dd]" />
          </div>
          <p className="text-[#9CA3AF] text-sm">Jadwal bimbingan akan dikonfirmasi oleh mentor setelah pendaftaran.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map(session => {
            const upcoming = session.status === 'upcoming'
            const date = session.scheduled_at
              ? new Date(session.scheduled_at).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
              : 'Belum dijadwalkan'
            const time = session.scheduled_at
              ? new Date(session.scheduled_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              : ''

            return (
              <div key={session.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${upcoming ? 'border-[#2232dd]/20 hover:shadow-md' : 'border-gray-100 opacity-65'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${upcoming ? 'bg-[#2232dd] text-white' : 'bg-gray-100 text-[#9CA3AF]'}`}>
                      {session.session_number}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E1B4B] text-sm">Pertemuan {session.session_number}</p>
                      <p className="text-[#9CA3AF] text-xs mt-0.5">{date}{time ? ` · ${time} WIB` : ''}</p>
                      {session.notes && (
                        <p className="text-[#6B6B8A] text-xs mt-2 bg-[#f4f8ff] border border-[#2232dd]/10 px-3 py-1.5 rounded-lg">{session.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${upcoming ? 'bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20' : 'bg-green-50 text-[#16a34a] border border-green-100'}`}>
                      {upcoming ? <Clock size={11} /> : <CheckCircle size={11} />}
                      {upcoming ? 'Upcoming' : 'Selesai'}
                    </span>
                    <span className="flex items-center gap-1 text-[#9CA3AF] text-xs">
                      {session.session_type === 'online' ? <Video size={11} /> : <MapPin size={11} />}
                      <span className="capitalize">{session.session_type}</span>
                    </span>
                  </div>
                </div>
                {session.zoom_link && upcoming && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <a href={session.zoom_link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#2232dd] hover:bg-[#1a28b8] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer">
                      <Video size={13} /> Buka Zoom
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
