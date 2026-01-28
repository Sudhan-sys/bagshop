import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if we are accessing an admin route
  console.log('Middleware checking path:', request.nextUrl.pathname);
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get('admin_session');
    console.log('Admin session cookie:', adminSession);

    // If no session, redirect to login
    if (!adminSession || adminSession.value !== 'true') {
      console.log('Redirecting to login...');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
