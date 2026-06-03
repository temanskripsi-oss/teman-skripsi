import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { verifyCallbackSignature } from '@/lib/duitku'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { merchantCode, amount, merchantOrderId, resultCode, reference, signature } = body

    if (!verifyCallbackSignature(amount, merchantOrderId, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    if (resultCode !== '00') {
      return NextResponse.json({ message: 'Payment not successful, ignored' })
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

    // Buat akun Supabase user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: reg.email,
      email_confirm: true,
      user_metadata: { full_name: reg.full_name },
    })

    if (authError && authError.message !== 'User already registered') {
      console.error('[callback] createUser error:', authError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    const userId = authData?.user?.id

    // Upsert profile
    if (userId) {
      await supabase.from('profiles').upsert({
        id: userId,
        full_name: reg.full_name,
        phone: reg.phone,
        product: 'fastrack',
        role: 'user',
        start_date: `${reg.batch}-01`,
        active_until: new Date(
          Number(reg.batch.split('-')[0]),
          Number(reg.batch.split('-')[1]),
          0
        ).toISOString().split('T')[0],
      }, { onConflict: 'id' })

      // Kirim email reset password agar user bisa set password
      await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: reg.email,
      })
    }

    // Update registration status
    await supabase.from('registrations').update({
      status: 'paid',
      duitku_reference: reference,
      paid_at: new Date().toISOString(),
      user_id: userId ?? null,
    }).eq('merchant_order_id', merchantOrderId)

    console.log(`[callback] Payment confirmed: ${merchantOrderId} | ${reg.email}`)
    return NextResponse.json({ message: 'OK' })
  } catch (err) {
    console.error('[duitku/callback]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
