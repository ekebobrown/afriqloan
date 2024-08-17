import { NextResponse } from "next/server"

export async function middleware(request) {
    const path = request.nextUrl.pathname
    const session_token = request.cookies.get('session_token')?.value

    if (!session_token && (path.startsWith('/dashboard')||path.startsWith('/account'))) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

    if (session_token && (path.startsWith('/login')||path.startsWith('/register?asa=user'))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  export const config = {
    matcher: ['/dashboard/:path*','/login', '/register', '/account/:path*',]
  }