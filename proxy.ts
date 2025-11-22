import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isLoginPage = nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', nextUrl))
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
