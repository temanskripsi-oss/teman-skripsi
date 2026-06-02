export type Product = 'fastrack' | 'mentoring-sempro' | 'mentoring-penelitian' | 'all'
export type Role = 'user' | 'admin'

export interface Profile {
  id: string
  full_name: string
  university: string
  phone: string
  product: Product
  active_until: string
  created_at: string
  role: Role
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
