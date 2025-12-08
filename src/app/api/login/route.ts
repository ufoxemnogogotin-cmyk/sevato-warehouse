import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  const expectedPassword = process.env.WAREHOUSE_ADMIN_PASSWORD;

  if (!expectedPassword) {
    console.error("WAREHOUSE_ADMIN_PASSWORD is not set");
    return NextResponse.json(
      { success: false, error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (!password || password !== expectedPassword) {
    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });

  // cookie за достъп
  res.cookies.set("sevato_auth", "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 дни
  });

  return res;
}
