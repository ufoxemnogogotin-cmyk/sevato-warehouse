import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/favicon.ico"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Разрешаваме:
  // - самата login страница
  // - API за логин
  // - next статиките / images / favicon
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/login")
  ) {
    return NextResponse.next();
  }

  const authCookie = req.cookies.get("warehouse_auth");

  // Ако няма cookie -> пращаме на /login
  if (!authCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname || "/");
    return NextResponse.redirect(url);
  }

  // Има cookie -> пускаме към страницата
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
