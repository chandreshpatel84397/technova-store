import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/constants/storage";

const protectedRoutes = ["/wishlist", "/checkout", "/orders", "/cart", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/wishlist/:path*", "/checkout/:path*", "/orders/:path*", "/cart/:path*", "/profile/:path*"]
};
