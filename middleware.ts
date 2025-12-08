// middleware.ts (root)

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Кои пътища да са защитени с парола
export const config = {
  matcher: [
    "/",              // dashboard
    "/upload/:path*", // Upload QS лист
    "/parts/:path*",
    "/models/:path*",
    "/build/:path*",
    "/stock/:path*",
  ],
};

export function middleware(req: NextRequest) {
  const authCookie = req.cookies.get("warehouse_auth")?.value;

  // Ако вече има валиден cookie -> пускаме
  if (authCookie === "ok") {
    return NextResponse.next();
  }

  // Няма cookie -> пращаме към /login
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("from", req.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}
