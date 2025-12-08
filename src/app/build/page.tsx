"use client";

import { useState } from "react";

type ApiSuccessFlag = {
  success?: boolean;
  ok?: boolean;
  url?: string;
  error?: string;
};

export default function BuildAIPage() {
  const [modelName, setModelName] = useState("");
  const [parts, setParts] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // helper – true ако API-то е върнало success/ok
  function isSuccess(resp: ApiSuccessFlag | undefined | null) {
    if (!resp) return false;
    return resp.success === true || resp.ok === true;
  }

  async function uploadImage() {
    if (!image) {
      throw new Error("Няма избрана снимка.");
    }

    const body = new FormData();
    body.append("file", image);

    const res = await fetch("/api/upload-training-image", {
      method: "POST",
      body,
    });

    let json: ApiSuccessFlag | undefined;
    try {
      json = (await res.json()) as ApiSuccessFlag;
    } catch {
      json = undefined;
    }

    if (!res.ok || !isSuccess(json) || !json?.url) {
      throw new Error(json?.error || "Грешка при качване на снимката.");
    }

    return json.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    if (!modelName || !parts || !image) {
      setStatus("Попълни всички полета!");
      return;
    }

    setLoading(true);

    try {
      // 1) качваме снимката
      const imageUrl = await uploadImage();

      // 2) пращаме модела към /api/train-model
      const res = await fetch("/api/train-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ❗ Тук имената трябва да съвпадат с route.ts
          // ако там ползваш `model_name` / `image_url` – смени ги
          name: modelName,
          parts,        // пращаме целия стринг, бекендът може да сплитне
          imageUrl,
        }),
      });

      let data: ApiSuccessFlag | undefined;
      try {
        data = (await res.json()) as ApiSuccessFlag;
      } catch {
        data = undefined;
      }

      if (!res.ok || !isSuccess(data)) {
        setStatus(data?.error || "Грешка при записа.");
        setLoading(false);
        return;
      }

      // успех
      setStatus("Обучението е записано успешно! ✅");
      setModelName("");
      setParts("");
      setImage(null);
    } catch (err: any) {
      console.error("Build AI error:", err);
      setStatus(err?.message || "Неочаквана грешка.");
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          {/* Име на модела */}
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
              placeholder="Пример: GMT Bruce Wayne"
            />
          </div>

          {/* Части */}
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
              placeholder="NH34, CASE + STRAP, DIAL GMT BLACK/GREEN..."
            />
          </div>

          {/* Снимка */}
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
              cursor: loading ? "default" : "pointer",
              fontSize: 16,
              marginTop: 10,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Записване..." : "Запиши обучението"}
          </button>

          {/* Статус / грешка */}
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
