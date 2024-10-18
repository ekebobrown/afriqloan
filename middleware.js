import { NextResponse } from "next/server"

import Auth from "@/app/lib/auth"

export async function middleware(request, event) {
    const path = request.nextUrl.pathname
    const searchParams = request.nextUrl.search
    const token = request.nextUrl.searchParams.get("token")
    const session_token = request.cookies.get('session_token')?.value
    const { data, isAuthenticated } = await Auth()

    const headers = new Headers(request.headers);
    headers.set("x-current-path", path);
    headers.set("x-user-id", data?._id)

    //Check if user is authenticated
    if (isAuthenticated){
        if(path.startsWith('/login')||path.startsWith('/register')||path.startsWith('/account/activation')||path.startsWith('/account/password')) {
            return NextResponse.redirect(new URL(`/dashboard`, request.url))
        }
        const response = NextResponse.next({headers})
        const expires = new Date(Date.now() + 60*30*1000)
        response.cookies.set('session_token', session_token, {
            expires: expires,
            httpOnly: true,
            secure: true,
            path: '/',
        })
        event.waitUntil(
            fetch(`${process.env.SITE_URL}/api/session`,{
                method: "PATCH",
                headers: headers
            }))
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