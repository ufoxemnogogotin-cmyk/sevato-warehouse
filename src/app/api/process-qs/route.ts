import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

type ProcessBody = {
  documentId: string;
};

export async function POST(req: Request) {
  let body: ProcessBody;
  try {
    body = (await req.json()) as ProcessBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!body.documentId) {
    return NextResponse.json(
      { ok: false, error: "Missing documentId" },
      { status: 400 }
    );
  }

  // 1) Взимаме source_document
  const { data: doc, error: docError } = await supabase
    .from("source_documents")
    .select("*")
    .eq("id", body.documentId)
    .single();

  if (docError || !doc) {
    console.error("Doc error:", docError);
    return NextResponse.json(
      { ok: false, error: "Document not found" },
      { status: 404 }
    );
  }

  const imageUrl: string = doc.file_url;
  if (!imageUrl) {
    return NextResponse.json(
      { ok: false, error: "Document has no file_url" },
      { status: 400 }
    );
  }

  // 2) Маркираме го като processing
  await supabase
    .from("source_documents")
    .update({ status: "processing" })
    .eq("id", doc.id);

  // 3) Пращаме снимката към OpenAI Vision
  //    ВАЖНО: отговорът трябва да е чист JSON, който после ще парснем.
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "Ти си асистент, който чете QS листове за части за часовници. Връщай САМО валиден JSON, без обяснения.",
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `
Имаш снимка на QS лист с части.

Искам да върнеш JSON с този формат:

{
  "items": [
    {
      "raw_text": "както го е написал китаеца",
      "quantity": 1
    }
  ]
}

- Взимай само редовете, които са реални части (dial, case, hands, movement, strap и т.н.).
- quantity може да е null, ако не си сигурен.
- НЕ добавяй допълнителни полета.
- НЕ добавяй текст извън JSON.
          `,
          },
          {
            type: "input_image",
            image_url: imageUrl,
          },
        ],
      },
    ],
  });

  const content = response.output[0].content[0];
  if (content.type !== "output_text") {
    return NextResponse.json(
      { ok: false, error: "Unexpected OpenAI response format" },
      { status: 500 }
    );
  }

  let parsed: any;
  try {
    parsed = JSON.parse(content.text);
  } catch (e) {
    console.error("JSON parse error from OpenAI:", e, content.text);
    return NextResponse.json(
      { ok: false, error: "Failed to parse JSON from OpenAI" },
      { status: 500 }
    );
  }

  const items: Array<{ raw_text: string; quantity?: number }> =
    parsed.items ?? [];

  // 4) Записваме в extracted_items
  const rows = items.map((item) => ({
    source_document_id: doc.id,
    raw_text: item.raw_text,
    quantity: item.quantity ?? null,
    raw_json: item,
  }));

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from("extracted_items")
      .insert(rows);

    if (insertError) {
      console.error("Insert extracted_items error:", insertError);
      return NextResponse.json(
        { ok: false, error: "Failed to insert extracted_items" },
        { status: 500 }
      );
    }
  }

  // 5) Маркираме документа като done
  await supabase
    .from("source_documents")
    .update({ status: "done" })
    .eq("id", doc.id);

  return NextResponse.json({
    ok: true,
    count: rows.length,
  });
}
