import { NextResponse } from "next/server";

type LoginRequestBody = {
  password?: string;
};

export async function POST(req: Request) {
  let body: LoginRequestBody;

  try {
    body = (await req.json()) as LoginRequestBody;
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const password = body.password;
  const expectedPassword = process.env.WAREHOUSE_ADMIN_PASSWORD;

  // Ако не сме задали парола в env → това е грешка в конфигурацията
  if (!expectedPassword) {
    console.error("WAREHOUSE_ADMIN_PASSWORD is not set");
    return NextResponse.json(
      { success: false, error: "Server misconfigured" },
      { status: 500 }
    );
  }

  // Грешна или липсваща парола
  if (!password || password !== expectedPassword) {
    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    );
  }

  // Успешен логин → сетваме cookie
  const res = NextResponse.json({ success: true });

  res.cookies.set("sevato_auth", "ok", {
    httpOnly: true,
    // Важно: secure само в production, иначе на localhost cookie-то не се праща
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 дни
  });

  return res;
}
