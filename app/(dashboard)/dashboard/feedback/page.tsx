import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Video, ExternalLink } from 'lucide-react'
import type { Feedback } from '@/types'

export default async function FeedbackPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: feedbacks } = await supabase
    .from('feedbacks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const list = (feedbacks ?? []) as Feedback[]

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Written Feedback</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Saran dan arahan dari mentor untukmu</p>
      </div>

      {list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
            <FileText size={22} className="text-[#2232dd]" />
          </div>
          <p className="font-semibold text-[#1E1B4B] text-sm mb-1">Belum ada feedback</p>
          <p className="text-[#9CA3AF] text-xs">Mentor akan menambahkan feedback setelah sesi bimbingan</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {list.map(f => (
            <div key={f.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:border-[#2232dd]/20 hover:shadow-md transition-all duration-200">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${f.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-[#eff6ff] text-[#2232dd]'}`}>
                {f.type === 'pdf' ? <FileText size={20} /> : <Video size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-[#1E1B4B] text-sm">{f.title}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.type === 'pdf' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-[#eff6ff] text-[#2232dd] border border-[#2232dd]/20'}`}>
                    {f.type === 'pdf' ? 'PDF' : 'Video'}
                  </span>
                  {f.session_number && (
                    <span className="text-xs text-[#9CA3AF] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                      Sesi {f.session_number}
                    </span>
                  )}
                </div>
                {f.description && (
                  <p className="text-[#6B6B8A] text-xs mb-2">{f.description}</p>
                )}
                <p className="text-[#9CA3AF] text-xs mb-3">
                  {new Date(f.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <a href={f.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#2232dd] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#1a28b8] transition-colors">
                  <ExternalLink size={12} />
                  {f.type === 'pdf' ? 'Download PDF' : 'Tonton Video'}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
