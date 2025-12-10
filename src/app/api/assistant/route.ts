// src/app/api/assistant/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabaseServer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 1) Взимаме snapshot на склада + моделите
async function getWarehouseSnapshot() {
  // parts
  const { data: parts } = await supabaseServer
    .from("parts")
    .select("id, code, name, category");

  // models
  const { data: models } = await supabaseServer
    .from("models")
    .select("id, code, name, description");

  // model_parts
  const { data: modelParts } = await supabaseServer
    .from("model_parts")
    .select("model_id, part_id, quantity");

  // stock_movements (in/out)
  const { data: movements } = await supabaseServer
    .from("stock_movements")
    .select("part_id, quantity_change");

  // смятаме наличности по part_id
  const qtyByPartId: Record<string, number> = {};
  (movements || []).forEach((m) => {
    qtyByPartId[m.part_id] = (qtyByPartId[m.part_id] || 0) + m.quantity_change;
  });

  // правим малко по-приятен JSON за модела
  const enrichedParts = (parts || []).map((p) => ({
    id: p.id,
    code: p.code,
    name: p.name,
    category: p.category,
    quantity: qtyByPartId[p.id] || 0,
  }));

  const enrichedModels = (models || []).map((m) => {
    const reqParts = (modelParts || []).filter((mp) => mp.model_id === m.id);
    return {
      id: m.id,
      code: m.code,
      name: m.name,
      description: m.description,
      required_parts: reqParts.map((mp) => ({
        part_id: mp.part_id,
        quantity: mp.quantity,
      })),
    };
  });

  return { parts: enrichedParts, models: enrichedModels };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const snapshot = await getWarehouseSnapshot();

    const systemPrompt = `
Ти си SEVATO Warehouse AI агент.

Имаш следните данни в JSON:

- parts: списък с части
  - id, code, name, category, quantity (наличност в склада)
- models: списък с модели
  - id, code, name, description
  - required_parts: [{ part_id, quantity }]

Правила:
- "наличност на част" = quantity.
- "колко модела X можем да сглобим" = минималното (quantity на всяка нуждаеща се част / quantity, която трябва за модела), закръглено надолу.
- Ако quantity <= 0, частта я броим като неналична.
- Отговаряй ясно и стегнато, на български. Използвай таблици с текст където е полезно.
- Можеш да правиш планове: ако сглобим един определен модел, кажи как това ще промени наличностите теоретично (но не записваш в базата, само симулираш).

Ако потребителят пита нещо извън склада, просто кажи, че този агент е само за warehouse анализ.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "system",
          content:
            "Ето ти snapshot на склада и моделите в JSON:\n" +
            JSON.stringify(snapshot),
        },
        ...messages,
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Нямам отговор, нещо се обърка.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Assistant error:", err);
    return NextResponse.json(
      { error: "Assistant failed", details: err?.message },
      { status: 500 },
    );
  }
}
