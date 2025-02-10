import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createToken, verifyToken } from "@/lib/auth/session";

const protectedRoutes = ["/cart"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 保護されたルートでセッションがない場合
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 認証ルートにセッションがある場合はリダイレクト
  if ((pathname === "/login" || pathname === "/sign-up") && sessionCookie) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  let res = NextResponse.next();

  // セッションの更新処理（保護されたルートの場合のみ）
  if (sessionCookie && isProtectedRoute) {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res.cookies.set({
        name: "session",
        value: await createToken({
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
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
