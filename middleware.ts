import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === '/mvp') {
    return NextResponse.rewrite(new URL('/mvp.html', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/mvp'],
};
