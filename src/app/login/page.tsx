"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const text = await res.text();
      console.log("DEBUG login response:", res.status, text);

      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok || data?.success === false) {
        setError(data?.error || "Грешна парола.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const from = params.get("from") || "/";

      window.location.href = from;
    } catch (err: any) {
      console.error("Login request failed:", err);
      setError("Мрежова грешка при логин: " + (err?.message || ""));
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#020617",
          borderRadius: 12,
          padding: 32,
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 0 40px rgba(0,0,0,0.7)",
          border: "1px solid #1f2937",
        }}
      >
        <h1
          style={{
            fontSize: 20,
            marginBottom: 8,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          SEVATO Warehouse
        </h1>
        <p
          style={{
            fontSize: 13,
            opacity: 0.8,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Вход с парола.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={{ fontSize: 13 }}>
            Парола:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                marginTop: 4,
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid #374151",
                background: "#020617",
                color: "white",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: 8,
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              background: "#16a34a",
              color: "white",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Вход
          </button>

          {error && (
            <p style={{ color: "#f97316", fontSize: 13, marginTop: 4 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
