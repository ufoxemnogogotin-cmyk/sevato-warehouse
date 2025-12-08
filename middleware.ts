// middleware.ts (в root на проекта)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Позволяваме login страницата и login API
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // 2) Проверяваме cookie-то, което login API-то сетва
  const hasAuth = req.cookies.get("warehouse_auth")?.value === "1";

  if (!hasAuth) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // 3) Ако има cookie – пускаме нататък
  return NextResponse.next();
}

// На кои пътища да се пуска middleware-ът
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|icon).*)"],
};
