import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  const expected = process.env.WAREHOUSE_ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { success: false, error: "Server missing password" },
      { status: 500 }
    );
  }

  if (!password || password !== expected) {
    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    );
  }

  // success
  return NextResponse.json({ success: true });
}
