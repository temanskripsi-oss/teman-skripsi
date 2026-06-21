import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ valid: false, message: 'Kode tidak boleh kosong' })

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('affiliate_codes')
      .select('code, discount_amount, sales_name, commission_per_sale')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ valid: false, message: 'Kode tidak ditemukan atau sudah tidak aktif.' })
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
