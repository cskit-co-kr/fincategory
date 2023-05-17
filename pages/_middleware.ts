import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  } else if (req.nextUrl.pathname.startsWith('/uploads')) {
    return NextResponse.next()
  }
  return NextResponse.next()
}
