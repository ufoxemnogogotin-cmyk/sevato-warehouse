import { NextResponse } from "next/server";
import { runInventoryAgent } from "@/lib/agent/inventoryAgent";

export const runtime = "nodejs"; // за да е сигурно, че сме на server (не edge)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.question as string;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Липсва въпрос." },
        { status: 400 }
      );
    }

    const answer = await runInventoryAgent(question);

    return NextResponse.json({ answer });
  } catch (err: any) {
    console.error("Agent API error:", err);
    return NextResponse.json(
      {
        error: "Assistant failed",
        details: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}
