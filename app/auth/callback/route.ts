import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && user) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/update-password`)
      }

      let { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()

      // Google OAuth bisa buat user baru tanpa profile — cek by email
      if ((!profile || !profile.full_name) && user.email) {
        const { data: users } = await supabase.auth.admin.listUsers()
        const match = users?.users.find(u => u.email === user.email && u.id !== user.id)
        if (match) {
          const { data: existingProfile } = await supabase.from('profiles').select('role').eq('id', match.id).single()
          if (existingProfile?.role === 'mentor') {
            // Update profile ID to new Google user
            await supabase.from('profiles').update({ id: user.id }).eq('id', match.id)
            profile = existingProfile
          }
        }
      }

      if (!profile || !profile.full_name) {
        const serviceClient = createServiceClient()
        await serviceClient.auth.admin.deleteUser(user.id)
        return NextResponse.redirect(`${origin}/auth/signout-unregistered`)
      }

      const role = profile.role
      const destination = role === 'admin' ? '/admin' : role === 'mentor' ? '/mentor' : '/dashboard'
      return NextResponse.redirect(`${origin}${destination}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
