import { NextResponse, type NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/middleware-auth";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isOnLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login");
  const isOnAdmin = pathname.startsWith("/admin");

  // Always allow login page - set a header so layout knows
  if (isOnLogin) {
    const response = NextResponse.next();
    response.headers.set("x-is-login-page", "true");
    return response;
  }

  // Protect other admin routes
  if (isOnAdmin) {
    try {
      const session = await getAuthSession(req);
      if (!session) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

