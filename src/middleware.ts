// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Разрешаваме login страницата и API-то за логин
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = req.cookies.get("sevato_auth");

  // Ако имаме валидно cookie -> пускаме
  if (session?.value === "ok") {
    return NextResponse.next();
  }

  // Няма cookie -> пращаме на /login
  const loginUrl = new URL("/login", req.url);

  // да не правим from=/login, че е безсмислено
  if (!pathname.startsWith("/login")) {
    loginUrl.searchParams.set("from", pathname || "/");
  }

  return NextResponse.redirect(loginUrl);
}

// Middleware да важи за всичко без статичните файлове
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
