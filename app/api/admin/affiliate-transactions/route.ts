import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('affiliate_transactions')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })
  const supabase = createServiceClient()
  await supabase.from('affiliate_transactions').update({ status }).eq('id', id)
  return NextResponse.json({ ok: true })
}
