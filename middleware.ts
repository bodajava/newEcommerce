import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
    const token = await getToken({
        req: request,
        secret
    })

    const { pathname } = request.nextUrl
    const lowerPath = pathname.toLowerCase()

    // Define page types
    const isAuthPage = lowerPath === '/login' || lowerPath === '/register'
    const isProtectedPage =
        lowerPath.startsWith('/cart') ||
        lowerPath.startsWith('/checkout') ||
        lowerPath.startsWith('/allorders') ||
        lowerPath.startsWith('/love')

    if (token) {
        if (isAuthPage) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    } else {
        if (isProtectedPage) {
            // Redirect to Login with callbackUrl if possible
            const loginUrl = new URL('/Login', request.url)
            return NextResponse.redirect(loginUrl)
        }
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        '/Cart/:path*',
        '/Checkout/:path*',
        '/allorders/:path*',
        '/Love/:path*',
        '/Login',
        '/register'
    ],
}




