import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signToken, verifyToken } from "@/lib/auth/session";

const publicRoutes = ["/", "/home", "/sign-in", "/sign-up"];
const protectedRoutes = ["/products", "/cart", "/checkout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  console.log(
    `middleware. pathname: ${pathname}, sessconCookie: ${sessionCookie}, isPublicRoute: ${isPublicRoute}, isProtectedRoute: ${isProtectedRoute}`
  );

  // 保護されたルートでセッションがない場合
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 認証ルートにセッションがある場合はリダイレクト
  if ((pathname === "/sign-in" || pathname === "/sign-up") && sessionCookie) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  let res = NextResponse.next();

  // セッションの更新処理
  if (sessionCookie) {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

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
