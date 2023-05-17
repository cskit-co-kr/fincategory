import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/',
    '/uploads/:path*',
  ]
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/uploads')) {
    console.log('pathname: ', req.nextUrl.pathname);
    return NextResponse.next()
  }

  return NextResponse.next()
}