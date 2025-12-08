import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  const correctPassword = process.env.WAREHOUSE_PASSWORD;

  if (!correctPassword) {
    console.error("WAREHOUSE_PASSWORD is not set");
    return NextResponse.json(
      { ok: false, error: "Server password not configured." },
      { status: 500 }
    );
  }

  if (password !== correctPassword) {
    return NextResponse.json(
      { ok: false, error: "Грешна парола." },
      { status: 401 }
    );
  }

  // ако е вярна – слагаме cookie за 30 дни
  const res = NextResponse.json({ ok: true });

  const maxAge = 60 * 60 * 24 * 30; // 30 дни

  res.cookies.set("warehouse-auth", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return res;
}