import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
    })

    const { pathname } = request.nextUrl
    const isAuthPage = pathname === '/Login' || pathname === '/Regester' || pathname === '/register'
    const isProtectedPage = pathname.startsWith('/Cart')

    if (token) {
        if (isAuthPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    } else {
        if (isProtectedPage) {
            return NextResponse.redirect(new URL('/Login', request.url))
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/Cart', '/Login', '/Regester', '/register'],
}




