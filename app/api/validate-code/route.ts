import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

const PRODUCT_SCOPE: Record<string, 'fastrack' | 'mentoring'> = {
  'fastrack': 'fastrack',
  'mentoring-sempro': 'mentoring',
  'mentoring-penelitian': 'mentoring',
}

export async function POST(req: NextRequest) {
  try {
    const { code, product } = await req.json()
    if (!code) return NextResponse.json({ valid: false, message: 'Kode tidak boleh kosong' })

    const scope = PRODUCT_SCOPE[product as string]

    const supabase = createServiceClient()
    let query = supabase
      .from('affiliate_codes')
      .select('code, discount_amount, sales_name, commission_per_sale, product')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)

    if (scope) query = query.eq('product', scope)

    const { data, error } = await query.single()

    if (error || !data) {
      return NextResponse.json({ valid: false, message: 'Kode tidak ditemukan, tidak berlaku untuk program ini, atau sudah tidak aktif.' })
    }

    return NextResponse.json({
      valid: true,
      code: data.code,
      discount: data.discount_amount,
      commission: data.commission_per_sale,
      message: `Kode "${data.code}" berhasil digunakan!`,
    })
  } catch {
    return NextResponse.json({ valid: false, message: 'Terjadi kesalahan server' })
  }
}
