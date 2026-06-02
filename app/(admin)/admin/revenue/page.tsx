import { createServiceClient } from '@/lib/supabase/service'
import RevenueManager from '@/components/admin/RevenueManager'
import type { Payment, Profile } from '@/types'

export default async function AdminRevenuePage() {
  const supabase = createServiceClient()

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

  const [{ data: payments }, { data: clients }] = await Promise.all([
    supabase.from('payments').select('*, profiles(id, full_name, product)').order('payment_date', { ascending: false }),
    supabase.from('profiles').select('id, full_name, product').neq('role', 'admin').order('full_name', { ascending: true }),
  ])

  const allPayments = (payments ?? []) as (Payment & { profiles: Pick<Profile, 'id' | 'full_name' | 'product'> | null })[]

  const total = allPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const thisMonth = allPayments.filter(p => p.status === 'paid' && p.payment_date >= firstOfMonth).reduce((s, p) => s + p.amount, 0)
  const pending = allPayments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[#9CA3AF] text-sm mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-[#1E1B4B]">Revenue</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Lacak semua pembayaran klien</p>
      </div>
      <RevenueManager
        payments={allPayments}
        clients={(clients ?? []) as Pick<Profile, 'id' | 'full_name' | 'product'>[]}
        stats={{ total, thisMonth, pending }}
      />
    </div>
  )
}
