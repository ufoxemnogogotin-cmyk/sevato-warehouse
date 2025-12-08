import { supabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { model_name, parts, image_url } = await req.json();

    if (!model_name || !parts || !image_url) {
      return NextResponse.json(
        { ok: false, message: "Missing fields." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("training_images").insert({
      model_name,
      parts,
      image_url,
    });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      message: "Training record saved.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Server error." },
      { status: 500 }
    );
  }
}
