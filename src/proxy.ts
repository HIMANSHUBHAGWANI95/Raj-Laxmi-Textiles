import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "super-secret-crave-bite-key-hash-12345",
  });

  const { pathname } = request.nextUrl;

  // Protect private dashboard and checkout routes
  if (pathname.startsWith("/dashboard") || pathname === "/checkout") {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from auth pages (login/register) to dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/checkout", "/login", "/register"],
};
