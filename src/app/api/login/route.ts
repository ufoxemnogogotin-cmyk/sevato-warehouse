// src/app/api/login/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type LoginRequestBody = {
  password?: string;
};

export async function POST(req: NextRequest) {
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

  // Успех → сетваме cookie
  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: "sevato_auth",
    value: "ok",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 дни
  });

  return res;
}
