import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    const token = request.cookies.get('accessToken')?.value;
    const pathname = request.nextUrl.pathname;
    const isOAuthCallback = pathname.startsWith('/callback/');
    const isPaymentSuccess = pathname === '/payment/success';

    const isAuthPage = pathname.startsWith('/auth') ||
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname === '/forgot-password' ||
        isOAuthCallback;

    if (!token && !isAuthPage && !isPaymentSuccess && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/personas', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
