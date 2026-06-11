import { auth } from "./auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Protected routes — redirect unauthenticated users to login
  const isProtectedRoute =
    pathname.startsWith("/flags") ||
    pathname.startsWith("/segments") ||
    pathname.startsWith("/dashboard");

  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Auth pages — redirect logged in users to flags list
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return Response.redirect(new URL("/flags", req.nextUrl));
  }
});

// Run middleware on all paths except Next.js internals, static files, and api routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
