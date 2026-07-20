export type Product = 'fastrack' | 'mentoring-sempro' | 'mentoring-penelitian' | 'all'
export type Role = 'user' | 'admin' | 'mentor'

export interface Profile {
  id: string
  full_name: string
  university: string
  phone: string
  product: Product
  active_until: string
  created_at: string
  role: Role
  mentor_id: string | null
  start_date: string | null
  avatar_url: string | null
}

export interface Video {
  id: string
  title: string
  description: string
  youtube_url: string
  week_number: number
  order_index: number
  product: Product
  created_at: string
}

export interface VideoProgress {
  id: string
  user_id: string
  video_id: string
  watched_at: string
}

export interface Freebie {
  id: string
  title: string
  description: string
  file_url: string
  product: Product
  order_index: number
}

export interface Session {
  id: string
  user_id: string
  session_number: number
  session_type: 'offline' | 'online'
  scheduled_at: string
  zoom_link: string
  notes: string
  status: 'upcoming' | 'done'
  catatan_sesi: string
  pr_description: string
  session_file_url: string | null
}

export interface SessionSubmission {
  id: string
  session_id: string
  user_id: string
  url: string
  notes: string
  status: 'submitted' | 'disetujui' | 'revisi'
  mentor_feedback: string
  submitted_at: string
  reviewed_at: string | null
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  description: string
  payment_date: string
  status: 'paid' | 'pending'
  created_at: string
  profiles?: Pick<Profile, 'id' | 'full_name' | 'product'>
}

export interface Feedback {
  id: string
  user_id: string
  title: string
  description: string
  type: 'pdf' | 'video'
  url: string
  session_number: number | null
  created_at: string
}

export interface Task {
  id: string
  week_number: number
  title: string
  description: string
  product: Product
  order_index: number
  created_at: string
}

export interface Registration {
  id: string
  full_name: string
  email: string
  phone: string
  batch: string | null
  product: string | null
  amount: number
  merchant_order_id: string
  mayar_transaction_id: string | null
  payment_url: string | null
  status: 'pending' | 'paid' | 'active' | 'expired'
  user_id: string | null
  created_at: string
  paid_at: string | null
  affiliate_code: string | null
  discount_amount: number
  final_price: number | null
}

export interface AffiliateCode {
  id: string
  code: string
  product: 'fastrack' | 'mentoring'
  sales_name: string
  sales_email: string
  sales_password: string
  sales_whatsapp: string | null
  commission_per_sale: number
  discount_amount: number
  total_sales: number
  total_commission: number
  is_active: boolean
  source: string
  created_at: string
}

export type ProspectStatus = 'target' | 'dm_sent' | 'deal' | 'live' | 'rejected'
export type FormatCollab = 'sg_statis' | 'video_promosi'
export type DmStatus = 'belum_dm' | 'terkirim' | 'balas' | 'pindah_wa' | 'closing' | 'ghosting'

export interface CollabsProspect {
  id: string
  username_ig: string
  followers_count: number
  kampus: string | null
  status: ProspectStatus
  dm_status: DmStatus
  format_collab: FormatCollab | null
  affiliate_code_ft: string | null
  affiliate_code_mp: string | null
  notes: string | null
  dm_sent_at: string | null
  deal_at: string | null
  live_at: string | null
  created_at: string
  updated_at: string
  sales_ft?: number
  sales_mp?: number
}

export interface AffiliateTransaction {
  id: string
  affiliate_code: string
  registration_id: string
  buyer_name: string
  commission_amount: number
  status: 'pending' | 'paid'
  created_at: string
}

export interface TaskSubmission {
  id: string
  task_id: string
  user_id: string
  url: string
  notes: string
  status: 'submitted' | 'reviewed' | 'revision'
  mentor_feedback: string
  submitted_at: string
  reviewed_at: string | null
  task?: Pick<Task, 'id' | 'title' | 'week_number'>
  profiles?: Pick<Profile, 'id' | 'full_name'>
}
