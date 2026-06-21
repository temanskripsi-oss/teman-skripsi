import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}
