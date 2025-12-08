import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/login", "/favicon.ico"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // оставяме статичните ресурси
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/public/") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // оставяме login и api/login
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("warehouse-auth");

  if (cookie?.value === "1") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", pathname || "/");
  return NextResponse.redirect(loginUrl);
}

// важен matcher – да пазим всички нормални пътеки
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};