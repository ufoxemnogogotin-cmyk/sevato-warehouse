import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json({ ok: false, message: "No file." });
    }

    const path = `training/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("sources")
      .upload(path, file);

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("sources").getPublicUrl(path);

    return NextResponse.json({
      ok: true,
      url: publicUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false });
  }
}
