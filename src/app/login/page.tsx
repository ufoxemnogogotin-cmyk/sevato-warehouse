"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // ако има ?from=/build го взима, иначе връща към /
        const params = new URLSearchParams(window.location.search);
        const from = params.get("from") || "/";
        window.location.href = from;
      } else {
        setStatus("Грешна парола.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Проблем със сървъра.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "#020617",
          border: "1px solid #1f2937",
          borderRadius: 12,
          padding: 32,
          width: "100%",
          maxWidth: 360,
          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>SEVATO Warehouse</h1>
        <p style={{ marginBottom: 24, color: "#9ca3af", fontSize: 14 }}>
          Вход с парола.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: 12 }}
        >
          <label style={{ display: "grid", gap: 4, fontSize: 14 }}>
            Парола:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 6,
                border: "1px solid #374151",
                background: "#020617",
                color: "white",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              padding: "10px 16px",
              borderRadius: 6,
              border: "none",
              background: "#16a34a",
              color: "white",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {loading ? "Влизане..." : "Вход"}
          </button>

          {status && (
            <p style={{ marginTop: 8, color: "#f97316", fontSize: 14 }}>
              {status}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
