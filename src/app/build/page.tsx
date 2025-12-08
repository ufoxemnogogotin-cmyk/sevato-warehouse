"use client";

import { useState } from "react";

export default function BuildAIPage() {
  const [modelName, setModelName] = useState("");
  const [parts, setParts] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function uploadImage() {
    const body = new FormData();
    body.append("file", image as File);

    const res = await fetch("/api/upload-training-image", {
      method: "POST",
      body,
    });

    return res.json();
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setStatus(null);

    if (!modelName || !parts || !image) {
      setStatus("Попълни всички полета!");
      return;
    }

    setLoading(true);

    const upload = await uploadImage();

    if (!upload.ok) {
      setStatus("Грешка при качване на снимката.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/train-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model_name: modelName,
        parts: parts.split(",").map((p) => p.trim()),
        image_url: upload.url,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      setStatus("Обучението е записано успешно! ✅");
      setModelName("");
      setParts("");
      setImage(null);
    } else {
      setStatus("Грешка при записа.");
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 60,
      }}
    >
      <div
        style={{
          background: "#181818",
          padding: "40px 48px",
          borderRadius: 12,
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 0 25px rgba(0,0,0,0.6)",
          border: "1px solid #222",
        }}
      >
        {/* Заглавие */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 400,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          🤖 Build AI
        </h1>
        <p style={{ opacity: 0.8, marginBottom: 28 }}>
          Добавяне на обучителен модел + части.
        </p>

        {/* Форма */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: 20 }}
        >
          {/* Поле: Име на модела */}
          <div>
            <label style={{ opacity: 0.9 }}>Име на модела:</label>
            <input
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 6,
                marginTop: 6,
                background: "#111",
                border: "1px solid #333",
                color: "white",
              }}
              placeholder="Пример: Daytona Panda"
            />
          </div>

          {/* Поле: Части */}
          <div>
            <label style={{ opacity: 0.9 }}>Части (разделени със запетая):</label>
            <input
              value={parts}
              onChange={(e) => setParts(e.target.value)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 6,
                marginTop: 6,
                background: "#111",
                border: "1px solid #333",
                color: "white",
              }}
              placeholder="NH35, Ceramic Bezel Black, Sapphire Crystal..."
            />
          </div>

          {/* Поле: Снимка */}
          <div>
            <label style={{ opacity: 0.9 }}>Снимка на модела:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              style={{
                marginTop: 6,
                padding: 6,
                background: "#111",
                borderRadius: 6,
                border: "1px solid #333",
              }}
            />
          </div>

          {/* Бутон */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 18px",
              background: "#16a34a",
              color: "white",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              marginTop: 10,
            }}
          >
            {loading ? "Записване..." : "Запиши обучението"}
          </button>

          {/* Статус */}
          {status && (
            <p
              style={{
                color: status.includes("✅") ? "#22c55e" : "#f97316",
                marginTop: 4,
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
