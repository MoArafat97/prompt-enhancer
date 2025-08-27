import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// Define public auth routes that should redirect to dashboard if authenticated
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Get the auth token from cookies (presence-only check)
  const authToken = request.cookies.get('auth-token');

  // If user is authenticated, never allow access to marketing homepage
  if (pathname === '/' && authToken) {
    const url = new URL('/dashboard/workspace', request.url);
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && !authToken) {
    // Redirect unauthenticated users trying to access protected routes
    const url = new URL('/', request.url);
    url.searchParams.set('auth', 'required');
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && authToken) {
    // Redirect authenticated users away from auth pages
    const url = new URL('/dashboard/workspace', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};