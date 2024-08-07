import { NextResponse } from "next/server"

export async function middleware(request) {
    const path = request.nextUrl.pathname
    const session_token = request.cookies.get('session_token')?.value

    if (!session_token && path.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

    if (session_token && path.startsWith('/login')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  export const config = {
    matcher: ['/dashboard/:path*','/login']
  }