"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const BUCKET_NAME = "sources";

export default function UploadPage() {
  const [type, setType] = useState<"qs_sheet" | "model_photo">("qs_sheet");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setStatus("Моля, избери файл.");
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      const filePath = `${type}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        setStatus("Грешка при качване на файла.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from("source_documents")
        .insert([
          {
            type,
            file_url: publicUrl,
            notes: notes || null,
            status: "uploaded",
          },
        ]);

      if (insertError) {
        console.error(insertError);
        setStatus("Файлът е качен, но записът в базата се провали.");
        return;
      }

      setStatus("Успешно качено ✅");
      setFile(null);
      setNotes("");
    } catch (err) {
      console.error(err);
      setStatus("Неочаквана грешка.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        paddingTop: 60,
      }}
    >
      {/* ЛОГО */}
      <img
        src="/sevato-logo.svg"
        alt="SEVATO Logo"
        style={{
          width: 200,
          height: "auto",
          marginBottom: 40,
          opacity: 0.95,
          filter: "drop-shadow(0 0 6px rgba(255,255,255,0.08))",
        }}
      />

      <div
        style={{
          background: "#181818",
          padding: 32,
          borderRadius: 12,
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 0 20px rgba(0,0,0,0.6)",
          border: "1px solid #222",
        }}
      >
        <h2 style={{ marginBottom: 16, fontWeight: 400 }}>
          Качване на източник
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          {/* Тип */}
          <label style={{ display: "grid", gap: 4 }}>
            Тип:
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "qs_sheet" | "model_photo")
              }
              style={{
                padding: 10,
                borderRadius: 6,
                background: "#111",
                color: "white",
                border: "1px solid #333",
              }}
            >
              <option value="qs_sheet">QS лист (таблица с части)</option>
              <option value="model_photo">Снимка на модел</option>
            </select>
          </label>

          {/* Бележки */}
          <label style={{ display: "grid", gap: 4 }}>
            Бележки (по желание):
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              style={{
                padding: 10,
                borderRadius: 6,
                background: "#111",
                color: "white",
                border: "1px solid #333",
              }}
            />
          </label>

          {/* Файл */}
          <label style={{ display: "grid", gap: 4 }}>
            Файл:
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ padding: 8 }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 16px",
              background: "#16a34a",
              color: "white",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            {loading ? "Качване..." : "Качи"}
          </button>

          {status && (
            <p
              style={{
                color: status.includes("✅") ? "#22c55e" : "#f97316",
                marginTop: 8,
              }}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
