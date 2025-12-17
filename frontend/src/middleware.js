import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Check if the path is inside the (user) protected route group
  const isProtectedRoute =
    pathname.startsWith("/@") ||
    pathname.startsWith("/explore") ||
    pathname.startsWith("/feed") ||
    pathname.startsWith("/following") ||
    pathname.startsWith("/post") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/write");

  // If accessing protected routes without token, redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If authenticated and accessing public-only pages, redirect to feed
  if (
    token &&
    (pathname === "/" || pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css)).*)",
  ],
};
