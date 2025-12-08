import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const password = body?.password as string | undefined;

    const expectedPassword = process.env.WAREHOUSE_ADMIN_PASSWORD;

    // 1) Проверка дали env е заредено
    if (!expectedPassword) {
      console.error("WAREHOUSE_ADMIN_PASSWORD is not set on the server");
      return NextResponse.json(
        { success: false, error: "Server misconfigured" },
        { status: 500 }
      );
    }

    // 2) Малко диагностика (само дължини, не самата парола)
    console.log("Login attempt", {
      hasPassword: Boolean(password),
      passwordLength: password?.length ?? 0,
      expectedLength: expectedPassword.length,
    });

    // 3) Сравняваме тримнати стойности
    const normalizedInput = (password ?? "").trim();
    const normalizedExpected = expectedPassword.trim();

    if (!normalizedInput || normalizedInput !== normalizedExpected) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    // 4) Успех – слагаме cookie
    const res = NextResponse.json({ success: true });

    res.cookies.set("sevato_auth", "ok", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 дни
    });

    return res;
  } catch (err) {
    console.error("Login API error", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
