import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const password = body.password as string | undefined;

    const expectedPassword = process.env.WAREHOUSE_PASSWORD;

    if (!expectedPassword) {
      console.error("WAREHOUSE_PASSWORD не е зададена в env.");
      return NextResponse.json(
        { ok: false, error: "Server config error" },
        { status: 500 }
      );
    }

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { ok: false, error: "Невалидна парола" },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });

    // cookie, което middleware-ът ще проверява
    res.cookies.set("warehouse_auth", "ok", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 дни
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}
