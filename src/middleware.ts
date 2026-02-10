import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

import {
  AUTH_PATHS,
  DEFAULT_LOGIN_REDIRECT_PATH,
  PROTECTED_PATHS,
  API_AUTH_ROUTE_PREFIX,
} from '@/lib/constants/routes';

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = !!token;

  const isApiAuthRoute = nextUrl.pathname.startsWith(API_AUTH_ROUTE_PREFIX);
  // Check if the current path starts with any of the protected base paths
  const isProtectedRoute = nextUrl.pathname.startsWith(
    PROTECTED_PATHS.SETTINGS_BASE
  );

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isProtectedRoute && !isAuthenticated) {
    // Redirect unauthenticated users trying to access protected routes to the login page.
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const loginUrl = new URL(AUTH_PATHS.LOGIN, nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
    console.log(
      `Middleware: Unauthenticated access to ${nextUrl.pathname}, redirecting to ${loginUrl.toString()}`
    );
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login/register pages, redirect to default logged-in page.
  if (
    isAuthenticated &&
    (nextUrl.pathname === AUTH_PATHS.LOGIN ||
      nextUrl.pathname === AUTH_PATHS.REGISTER)
  ) {
    console.log(
      `Middleware: Authenticated user accessing ${nextUrl.pathname}, redirecting to ${DEFAULT_LOGIN_REDIRECT_PATH}`
    );
    return NextResponse.redirect(
      new URL(DEFAULT_LOGIN_REDIRECT_PATH, nextUrl.origin)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
