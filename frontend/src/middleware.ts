import { fetchAuth } from '@/lib/axios'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const user = cookies().get('token')?.value
    if(user == undefined)
        return NextResponse.redirect(new URL('/auth/login', request.url))

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/app/:path*',
    '/',
    '/tracking',
    '/glance'
  ],
}