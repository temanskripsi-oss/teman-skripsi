import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ClientDetail from '@/components/admin/ClientDetail'
import type { Profile, Session } from '@/types'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServiceClient()

  const [{ data: profile }, { data: sessions }, { data: videos }, { data: progress }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', id).single(),
    supabase.from('sessions').select('*').eq('user_id', id).order('session_number', { ascending: true }),
    supabase.from('videos').select('id').or(`product.eq.all,product.eq.${(await supabase.from('profiles').select('product').eq('id', id).single()).data?.product}`),
    supabase.from('video_progress').select('id').eq('user_id', id),
  ])

  if (!profile) notFound()

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <Link href="/admin/clients" className="inline-flex items-center gap-2 text-[#9CA3AF] text-sm hover:text-[#1E1B4B] transition-colors mb-4 cursor-pointer">
          <ArrowLeft size={14} /> Kembali ke Klien
        </Link>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">{profile.full_name}</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">{profile.university} · {profile.phone}</p>
      </div>
      <ClientDetail
        profile={profile as Profile}
        sessions={(sessions ?? []) as Session[]}
        videoProgress={{ total: videos?.length ?? 0, watched: progress?.length ?? 0 }}
      />
    </div>
  )
}
