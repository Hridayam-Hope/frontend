import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page and public assets
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // For admin routes, check if auth cookie/token exists
  // Client-side auth context handles the real validation;
  // this is just a fast redirect for unauthenticated users
  if (pathname.startsWith("/admin")) {
    // We can't read localStorage in middleware, so we use a cookie
    const hasAuth = request.cookies.get("hridayam_authenticated");
    if (!hasAuth) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
