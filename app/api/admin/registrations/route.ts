import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function DELETE(req: NextRequest) {
  const { registrationId } = await req.json()
  if (!registrationId) return NextResponse.json({ error: 'registrationId required' }, { status: 400 })
  const supabase = createServiceClient()
  await supabase.from('registrations').delete().eq('id', registrationId)
  return NextResponse.json({ ok: true })
}
