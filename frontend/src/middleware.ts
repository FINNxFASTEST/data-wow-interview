import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { appHomePathForRoleId, getRoleIdFromToken } from "@/lib/jwt-role";

const TOKEN_COOKIE = "app_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = getRoleIdFromToken(token);

  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(
        new URL(appHomePathForRoleId(role), request.url),
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== 1) {
      return NextResponse.redirect(new URL("/concerts", request.url));
    }
  }

  if (pathname.startsWith("/concerts") || pathname.startsWith("/me/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/me/") && role !== 1 && role !== 2) {
      return NextResponse.redirect(new URL("/concerts", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/concerts", "/concerts/:path*", "/me/:path*"],
};
