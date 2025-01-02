import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const restrictedRoutes = [
    "/ranking",
    // "/ads",
    // "/auth/wallet",
    "/privacy-policy",
    "/terms",
  ]; // Define explicitly restricted routes
  const path = req.nextUrl.pathname;

  // console.log("req.nextUrl.pathname", path);

  // Check if the path is explicitly restricted or starts with "/board"
  if (restrictedRoutes.includes(path) || path.startsWith("/board")) {
    return NextResponse.redirect(new URL("/404", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/ranking",
    // "/ads",
    // "/auth/wallet",
    "/privacy-policy",
    "/terms",
    "/board/:path*", // Matches all routes under "/board"
  ],
};
