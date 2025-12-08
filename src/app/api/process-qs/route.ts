import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// ✅ 1) GET – за да може да цъкаш линк в браузъра:
// http://localhost:3000/api/process-qs?source_id=... 
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sourceId = searchParams.get("source_id");

    if (!sourceId) {
      return NextResponse.json(
        { error: "Липсва source_id в URL-а" },
        { status: 400 }
      );
    }

    // Пример: маркираме документа като "processing"
    const { error } = await supabase
      .from("source_documents")
      .update({ status: "processing" })
      .eq("id", sourceId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log("Започвам обработка на QS:", sourceId);

    // Тук по-късно ще вкараме AI логиката (Vision, парсване на части и т.н.)

    return NextResponse.json({
      ok: true,
      sourceId,
      message: "QS документът е отбелязан като processing. AI логиката ще се добави после.",
    });
  } catch (err: any) {
    console.error("Unhandled error in GET /api/process-qs:", err);
    return NextResponse.json(
      { error: "Internal error", details: err?.message },
      { status: 500 }
    );
  }
}

// ✅ 2) POST – оставяме го за бъдещ UI (бутон, форма и т.н.)
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const sourceId = body.sourceId;

  if (!sourceId) {
    return NextResponse.json(
      { error: "Липсва sourceId в body-то" },
      { status: 400 }
    );
  }

  // Можем да реюзнем същата логика като при GET:
  const url = new URL(req.url);
  url.searchParams.set("source_id", sourceId);
  return GET(new Request(url.toString(), { method: "GET" }));
}
