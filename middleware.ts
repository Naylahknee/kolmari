import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  return NextResponse.rewrite(new URL('/mvp.html', req.url));
}

export const config = {
  matcher: ['/((?!mvp.html|api|_next|favicon.ico|brand).*)'],
};
