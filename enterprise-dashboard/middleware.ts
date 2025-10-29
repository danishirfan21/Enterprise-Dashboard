import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = [
  '/login',
  '/api/login',
  '/_next',
  '/favicon.ico',
  '/api/health',
];

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dev_secret_change_me'
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (pathname.startsWith('/admin') && (payload as any).role !== 'admin') {
      return NextResponse.redirect(
        new URL('/dashboard?error=forbidden', req.url)
      );
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
