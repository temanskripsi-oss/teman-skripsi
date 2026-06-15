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
