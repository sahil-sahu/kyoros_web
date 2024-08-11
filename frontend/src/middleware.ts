import { fetchAuth } from '@/lib/axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const user = cookies().get('token')?.value
    const userType = cookies().get("userType")?.value
    if(user == undefined)
      return NextResponse.redirect(new URL('/auth/login', request.url))
    // if(request.nextUrl.pathname.includes("/docs/download")){
    //   return NextResponse.redirect(new URL(request.nextUrl.pathname.replace("/docs/download", "https://app.kyoros.com:420"), request.url))
    // }
    // console.log(request.nextUrl.pathname, request.nextUrl.pathname == "/" || request.nextUrl.pathname == "")
    if(request.nextUrl.pathname == "/" || request.nextUrl.pathname == ""){
      if(userType === "doctor") return NextResponse.redirect(new URL('/doctor', request.url))
      if(userType === "nurse") return NextResponse.redirect(new URL('/nurse', request.url))
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/app/:path*',
    '/',
    '/tracking',
    '/glance',
    // '/docs/download/:path*'
  ],
}