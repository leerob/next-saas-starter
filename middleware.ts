import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signToken, verifyToken } from "@/lib/auth/session";

const protectedRoutes = "/dashboard";
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");
  const isProtectedRoute = pathname.startsWith(protectedRoutes);
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  let res = NextResponse.next();

  if (sessionCookie) {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Redirect user to the dashboard if they are in any of the auth routes.
      if (isAuthRoute) {
        return NextResponse.redirect(new URL(protectedRoutes, request.url));
      }

      res.cookies.set({
        name: "session",
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString(),
        }),
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: expiresInOneDay,
      });
    } catch (error) {
      console.error("Error updating session:", error);
      res.cookies.delete("session");
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
