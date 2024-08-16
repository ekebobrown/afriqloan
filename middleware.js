import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request) {
    const path = request.nextUrl.pathname
    const token = request.cookies.get('session_token')?.value

    try{
      const tokenVerify = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY))
      if (tokenVerify && (path.startsWith('/login')||path.startsWith('/register'))) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }catch(error){
      if (path.startsWith('/login')||path.startsWith('/register')){
        return null
      }
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register', '/account/:path*',]
  }