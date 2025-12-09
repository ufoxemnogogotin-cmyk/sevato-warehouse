// src/app/api/login/route.ts
import { NextResponse } from "next/server";

type LoginRequestBody = {
  password?: string;
};

export async function POST(req: Request) {
  let body: LoginRequestBody;

  try {
    body = (await req.json()) as LoginRequestBody;
  } catch (e) {
    console.error("Login: invalid JSON body", e);
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const password = body.password;
  const expectedPassword = process.env.WAREHOUSE_ADMIN_PASSWORD;

  console.log("Login attempt:", {
    hasPasswordInBody: !!password,
    expectedSet: !!expectedPassword,
  });

  if (!expectedPassword) {
    console.error("WAREHOUSE_ADMIN_PASSWORD is not set");
    return NextResponse.json(
      { success: false, error: "Server misconfigured" },
      { status: 500 }
    );
  }

  if (!password || password !== expectedPassword) {
    console.warn("Login: invalid password");
    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    );
  }

  // Успешен логин → сетваме cookie
  const res = NextResponse.json({ success: true });

  res.cookies.set("sevato_auth", "ok", {
    httpOnly: true,
    secure: true,        // винаги true (на Vercel си е https)
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 дни
  });

  console.log("Login: success, cookie set");

  return res;
}
