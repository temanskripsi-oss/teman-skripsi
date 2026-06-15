import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, data } = body

    // Hanya proses event payment berhasil
    if (event !== 'payment.received') {
      return NextResponse.json({ message: 'Event ignored' })
    }

    if (!data?.status) {
      return NextResponse.json({ message: 'Payment not successful, ignored' })
    }

    // merchantOrderId disimpan di extraData.noCustomer saat create invoice
    const merchantOrderId = data?.extraData?.noCustomer ?? data?.extraData?.idProd
    if (!merchantOrderId) {
      return NextResponse.json({ error: 'merchantOrderId not found' }, { status: 400 })
    }

    const supabase = createServiceClient()

    const { data: reg } = await supabase
      .from('registrations')
      .select('*')
      .eq('merchant_order_id', merchantOrderId)
      .single()

    if (!reg) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    if (reg.status === 'paid' || reg.status === 'active') {
      return NextResponse.json({ message: 'Already processed' })
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: reg.email,
      email_confirm: true,
      user_metadata: { full_name: reg.full_name },
    })

    if (authError && authError.message !== 'User already registered') {
      console.error('[mayar/callback] createUser error:', authError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
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

      await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: reg.email,
      })
    }

    await supabase.from('registrations').update({
      status: 'paid',
      mayar_transaction_id: data?.id ?? null,
      paid_at: new Date().toISOString(),
      user_id: userId ?? null,
    }).eq('merchant_order_id', merchantOrderId)

    console.log(`[mayar/callback] Payment confirmed: ${merchantOrderId} | ${reg.email}`)
    return NextResponse.json({ message: 'OK' })
  } catch (err) {
    console.error('[mayar/callback]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
