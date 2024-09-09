import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { encrypt, decrypt } from '@/lib/auth/session';

const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  let res = NextResponse.next();

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (sessionCookie) {
    try {
      const parsed = await decrypt(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res.cookies.set({
        name: 'session',
        value: await encrypt({
          ...parsed,
          expires: expiresInOneDay.toISOString(),
        }),
        httpOnly: true,
        expires: expiresInOneDay,
      });
    } catch (error) {
      console.error('Error updating session:', error);
      res.cookies.delete('session');
      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
