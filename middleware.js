import { NextResponse } from "next/server"

import Auth from "@/app/lib/auth"

export async function middleware(request) {
    const path = request.nextUrl.pathname
    const searchParams = request.nextUrl.search
    const token = request.nextUrl.searchParams.get("token")
    const session_token = request.cookies.get('session_token')?.value
    const { isAuthenticated } = await Auth()

    //Check if user is authenticated
    if (isAuthenticated){
        if(path.startsWith('/login')||path.startsWith('/register')||path.startsWith('/account/activation')||path.startsWith('/account/password')) {
            return NextResponse.redirect(new URL(`/dashboard`, request.url))
        }
        const response = NextResponse.next()
        response.cookies.set('session_token', session_token, {
            expires: new Date(Date.now() + 60*30*1000),
            httpOnly: true,
            secure: true,
            path: '/',
        })
        return response
    }

    if (!isAuthenticated){
        if(token && path.startsWith('/account/activation')){
            return NextResponse.rewrite(new URL(`/api/account/activation?token=${token}`, request.url))
        }
        if(path.startsWith('/login')||path.startsWith('/account/password')||path.startsWith('/register')||path.startsWith('/account/activation')){
            return null
        }
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(path)}${searchParams}`, request.url))
    }
  }

  export const config = {
    matcher: ['/register', '/login', '/dashboard/:path*', '/account/:path*', '/savings/:path*', '/loans/:path*', '/messages/:path*', '/settings', '/listings/:path*']
  }