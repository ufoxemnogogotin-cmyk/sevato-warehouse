import { NextResponse } from "next/server";

const PASSWORD = process.env.WAREHOUSE_PASSWORD;

export async function POST(req: Request) {
  const { password } = await req.json();

  if (!PASSWORD || password !== PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // Cookie, което казва "този човек е логнат"
  res.cookies.set("warehouse_auth", "1", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 7 дни
  });

  return res;
}
