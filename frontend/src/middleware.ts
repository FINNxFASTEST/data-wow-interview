import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "app_token";

function roleIdFromToken(token: string | undefined): number | null {
  if (!token) return null;
  try {
    const p = token.split(".")[1];
    if (!p) return null;
    const b64 = p.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 === 0 ? b64 : b64 + "====".slice(b64.length % 4);
    const json = JSON.parse(atob(pad)) as { role?: { id?: number } };
    const id = json?.role?.id;
    return typeof id === "number" ? id : null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const role = roleIdFromToken(token);

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== 1) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/concerts") || pathname.startsWith("/me/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (pathname.startsWith("/me/") && role !== 2) {
      return NextResponse.redirect(new URL("/concerts", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/concerts", "/concerts/:path*", "/me/:path*"],
};
