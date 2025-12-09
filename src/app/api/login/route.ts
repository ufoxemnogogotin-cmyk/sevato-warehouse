import { NextResponse } from "next/server";

type LoginRequestBody = {
  password?: string;
};

export async function POST(req: Request) {
  let body: LoginRequestBody;

  try {
    body = (await req.json()) as LoginRequestBody;
  } catch {
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

  // вече НЕ слагаме cookie – само казваме "success"
  return NextResponse.json({ success: true });
}
