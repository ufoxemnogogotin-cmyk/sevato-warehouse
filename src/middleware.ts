import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Позволяваме login и API-то за login
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = req.cookies.get("sevato_auth");

  if (session?.value === "ok") {
    // Има валидно cookie → пускаме
    return NextResponse.next();
  }

  // Няма cookie → пращаме на login
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname || "/");

  return NextResponse.redirect(loginUrl);
}

// Middleware да важи за всичко без статичните файлове
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
