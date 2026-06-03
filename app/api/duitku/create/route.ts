import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { createInvoice, getNextBatch } from '@/lib/duitku'

const FASTRACK_PRICE = Number(process.env.FASTRACK_PRICE ?? 500000)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

export async function POST(req: NextRequest) {
  try {
    const { full_name, email, phone, payment_method } = await req.json()

    if (!full_name || !email || !phone || !payment_method) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    const { value: batch } = getNextBatch()
    const merchantOrderId = `FT-${batch}-${Date.now()}`

    const supabase = createServiceClient()

    // Cek apakah email sudah pernah daftar batch ini
    const { data: existing } = await supabase
      .from('registrations')
      .select('id, status')
      .eq('email', email)
      .eq('batch', batch)
      .neq('status', 'expired')
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Email ini sudah terdaftar untuk batch ini.' }, { status: 409 })
    }

    const result = await createInvoice({
      merchantOrderId,
      amount: FASTRACK_PRICE,
      productDetails: `Fastrack Sempro Batch ${batch}`,
      email,
      phoneNumber: phone,
      customerName: full_name,
      paymentMethod: payment_method,
      callbackUrl: `${BASE_URL}/api/duitku/callback`,
      returnUrl: `${BASE_URL}/daftar/sukses?orderId=${merchantOrderId}`,
    })

    if (result.statusCode !== '00') {
      return NextResponse.json({ error: result.statusMessage ?? 'Gagal membuat invoice' }, { status: 500 })
    }

    await supabase.from('registrations').insert({
      full_name,
      email,
      phone,
      batch,
      amount: FASTRACK_PRICE,
      merchant_order_id: merchantOrderId,
      duitku_reference: result.reference,
      payment_url: result.paymentUrl,
      payment_method,
      status: 'pending',
    })

    return NextResponse.json({ paymentUrl: result.paymentUrl })
  } catch (err) {
    console.error('[duitku/create]', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
