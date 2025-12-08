import { NextResponse } from "next/server";

export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;

  return NextResponse.json({
    ok: hasKey,
    message: hasKey
      ? "OPENAI_API_KEY е зареден успешно в сървъра."
      : "Няма OPENAI_API_KEY в средата. Провери .env.local и рестартирай dev сървъра.",
  });
}
