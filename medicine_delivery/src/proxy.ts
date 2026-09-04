import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Redirect logged in users away from auth pages to dashboard
    if (token && (path === "/login" || path === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Protected pages require an active token
        if (
          path.startsWith("/dashboard") ||
          path.startsWith("/upload-prescription") ||
          path.startsWith("/checkout")
        ) {
          return !!token;
        }

        // Publicly accessible pages
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/upload-prescription",
    "/checkout",
    "/login",
    "/register",
  ],
};
