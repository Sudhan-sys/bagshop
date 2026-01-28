import { NextResponse } from 'next/server';

export async function POST(request) {
  const body = await request.json();
  const { password } = body;

  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password === correctPassword) {
    // Create a response object
    const response = NextResponse.json({ success: true });

    // Set a cookie (HttpOnly for security)
    response.cookies.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
