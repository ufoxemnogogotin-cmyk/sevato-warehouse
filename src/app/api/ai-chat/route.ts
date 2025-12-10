import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessages = body.messages ?? [];

    // 1) ЧЕТЕМ ДАННИ ОТ БАЗАТА
    const { data: parts } = await supabase
      .from("parts")
      .select("id, code, name, category");

    const { data: models } = await supabase
      .from("models")
      .select("id, name");

    const { data: modelParts } = await supabase
      .from("model_parts")
      .select("model_id, part_id, quantity");

    // Ако имаш stock_movements, можеш да събираш наличности тук.
    // Ще оставя примерна логика, ти само нагласи имената на колоните.
    const { data: stockMovements } = await supabase
      .from("stock_movements")
      .select("part_id, change"); // ако при теб колоната е qty, delta и т.н. - смени я

    // Проста агрегация: наличност по part_id
    const stock: Record<string, number> = {};
    (stockMovements || []).forEach((m) => {
      const pid = m.part_id as string;
      const change = Number(m.change ?? 0);
      stock[pid] = (stock[pid] ?? 0) + change;
    });

    // 2) СГЛОБЯВАМЕ SYSTEM PROMPT С ПРАВИЛАТА
    const systemPrompt = `
Ти си "SEVATO Warehouse AI" – асистент за управление на склад с части за часовници.

Имаш следните таблици (данните са в JSON по-долу):

- parts: всички стандартни части. Полета: id, code, name, category.
- models: часовникови модели. Полета: id, name.
- model_parts: кой модел от кои части се състои. Полета: model_id, part_id, quantity (колко броя от тази част трябват за един часовник).
- stock_movements: движения в склада (тук вече е агрегирано до "stock" обект).

Бизнес логика:
- Наличност на част = сумата на всички движения за тази част.
- Налични бройки от даден МОДЕЛ = минималното:
    min( stock[part_id] / quantity ) за всички части на модела.
- Ако част липсва или наличността ѝ е 0, този модел не може да се сглоби.
- Отговаряй винаги конкретно и практично. Когато питат:
  - "Какви модели имаме налични?" – върни списък с име на модел и бройки.
  - "Кои части влизат в модел X?" – изброи частите по име и code.
  - "Ако сглобим/продадем модел X" – обясни кои части ще намалеят, но НЕ записваш нищо в базата (само обясняваш).
- Отговаряй на български.
- Ако ти липсват данни за нещо, кажи честно, не си измисляй.

Ето ти данните:

parts = ${JSON.stringify(parts ?? [])}
models = ${JSON.stringify(models ?? [])}
modelParts = ${JSON.stringify(modelParts ?? [])}
stockByPartId = ${JSON.stringify(stock)}
    `.trim();

    // 3) ВИКАМЕ OPENAI
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        ...userMessages,
      ],
    });

    const output = response.output[0];
    const text =
      output?.type === "message"
        ? output.message.content[0].type === "output_text"
          ? output.message.content[0].text
          : JSON.stringify(output.message.content)
        : "Нещо се обърка в отговора на модела.";

    return NextResponse.json({ reply: text });
  } catch (err: any) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
