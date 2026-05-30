import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Download, FileText } from 'lucide-react'


const DEFAULT_FREEBIES = [
  'Template Proposal Bab 1, 2, 3',
  'Template PPT Sempro',
  '100+ Contoh Judul ACC',
  'Research Gap Framework',
  'Prompt AI untuk Skripsi',
  'Script Konsultasi ke Dosen',
  'Checklist ACC Judul',
  'Template Email ke Dosen',
  'Database 300+ Jurnal Skripsi',
]

export default async function FreebiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile }  = await supabase.from('profiles').select('product').eq('id', user.id).single()
  const { data: freebies } = await supabase.from('freebies').select('*').or(`product.eq.all,product.eq.${profile?.product}`).order('order_index',{ascending:true})
  const items = freebies && freebies.length > 0 ? freebies : null

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Dashboard</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Template & Freebies</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Download semua template dan tools yang kamu butuhkan.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items ? items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2232dd]/15 transition-all">
            <div className="p-2.5 bg-[#eff6ff] text-[#2232dd] rounded-xl w-fit"><FileText size={18} /></div>
            <div className="flex-1">
              <p className="font-semibold text-[#1E1B4B] text-sm mb-1">{item.title}</p>
              {item.description && <p className="text-[#9CA3AF] text-xs leading-relaxed">{item.description}</p>}
            </div>
            {item.file_url ? (
              <a href={item.file_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#2232dd] hover:bg-[#1a28b8] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
                <Download size={13} /> Download
              </a>
            ) : (
              <span className="text-center text-[#9CA3AF] text-xs bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">Segera tersedia</span>
            )}
          </div>
        )) : DEFAULT_FREEBIES.map((name, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-gray-100 shadow-sm">
            <div className="p-2.5 bg-[#eff6ff] text-[#2232dd] rounded-xl w-fit"><FileText size={18} /></div>
            <p className="font-semibold text-[#1E1B4B] text-sm flex-1">{name}</p>
            <span className="text-center text-[#9CA3AF] text-xs bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">Segera tersedia</span>
          </div>
        ))}
      </div>
    </div>
  )
}
