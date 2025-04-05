import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default async function middleware(request: Request) {
  const session = await auth()
  const { pathname } = new URL(request.url)

  // Check if user is on dashboard or home page
  const isOnDashboard = pathname.startsWith('/dashboard')
  const isOnHomePage = pathname === '/'

  // Redirect authenticated users from home to dashboard
  if (session && isOnHomePage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users from dashboard to home
  if (!session && isOnDashboard) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = { 
  matcher: ['/', '/dashboard/:path*']
}