import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  try {
    const { registrationId } = await req.json()
    if (!registrationId) return NextResponse.json({ error: 'registrationId required' }, { status: 400 })

    const supabase = createServiceClient()

    const { data: reg } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single()

    if (!reg) return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    if (reg.status === 'active' || reg.status === 'paid') {
      return NextResponse.json({ error: 'Sudah aktif' }, { status: 409 })
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: reg.email,
      email_confirm: true,
      user_metadata: { full_name: reg.full_name },
    })

    if (authError && authError.message !== 'User already registered') {
      return NextResponse.json({ error: 'Gagal membuat akun: ' + authError.message }, { status: 500 })
    }

    const userId = authData?.user?.id

    if (userId) {
      const product = reg.product ?? 'fastrack'
      const now = new Date()
      const activeUntil = product === 'fastrack' && reg.batch
        ? new Date(Number(reg.batch.split('-')[0]), Number(reg.batch.split('-')[1]), 0).toISOString().split('T')[0]
        : new Date(now.getFullYear(), now.getMonth() + 3, now.getDate()).toISOString().split('T')[0]

      await supabase.from('profiles').upsert({
        id: userId,
        full_name: reg.full_name,
        phone: reg.phone,
        product,
        role: 'user',
        start_date: product === 'fastrack' && reg.batch ? `${reg.batch}-01` : now.toISOString().split('T')[0],
        active_until: activeUntil,
      }, { onConflict: 'id' })

      await supabase.auth.admin.generateLink({ type: 'recovery', email: reg.email })
    }

    await supabase.from('registrations').update({
      status: 'active',
      paid_at: new Date().toISOString(),
      user_id: userId ?? null,
    }).eq('id', registrationId)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/activate]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
