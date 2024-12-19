import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const restrictedRoutes = [
    "/ranking",
    "/board/post",
    "/board",
    "/board/wallet",
    "/board/ads-history",
    "/board/ads-purchase",
    "/board/fincoin-purchase",
    "/board/write",
    "/ads",
    "/auth/wallet",
    "/privacy-policy",
    "/terms",
  ]; // Define restricted routes
  const path = req.nextUrl.pathname;

  if (restrictedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/404", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/ranking",
    "/board/post",
    "/board",
    "/board/wallet",
    "/board/ads-history",
    "/board/ads-purchase",
    "/board/fincoin-purchase",
    "/board/write",
    "/ads",
    "/auth/wallet",
    "/privacy-policy",
    "/terms",
  ], // Match restricted routes
};
