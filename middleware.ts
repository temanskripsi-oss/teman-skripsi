import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      await supabase.auth.signOut()
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('error', 'not_registered')
      const res = NextResponse.redirect(redirectUrl)
      // Clear session cookies
      request.cookies.getAll().forEach(cookie => {
        if (cookie.name.includes('auth-token') || cookie.name.includes('supabase')) {
          res.cookies.delete(cookie.name)
        }
      })
      return res
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
