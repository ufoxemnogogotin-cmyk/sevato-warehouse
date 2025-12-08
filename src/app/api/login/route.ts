import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  const expectedPassword = process.env.WAREHOUSE_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      { ok: false, error: "Server password is not configured." },
      { status: 500 }
    );
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  // Слагаме cookie за 30 дни
  res.cookies.set("warehouse_auth", "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
