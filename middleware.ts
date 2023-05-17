import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/',
    '/uploads/:path*',
  ]
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/uploads')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}