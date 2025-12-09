// src/app/api/train-model/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, parts, imageUrl } = body;

    // 1) Базова валидация
    if (!name || !parts || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Липсват полета (име, части или снимка)." },
        { status: 400 }
      );
    }

    // 2) Частите -> масив
    const partsArray = String(parts)
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean); // махаме празни елементи

    if (partsArray.length === 0) {
      return NextResponse.json(
        { success: false, error: "Няма валидни части в полето." },
        { status: 400 }
      );
    }

    // 3) Запис в Supabase
    // ❗ Смени "trained_models" и имената на колоните според твоите таблици
    const { error } = await supabaseServer.from("trained_models").insert({
      name,
      parts: partsArray,    // JSON/array колонка
      image_url: imageUrl,  // колоната за снимката
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error (train-model):", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("train-model POST error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}
