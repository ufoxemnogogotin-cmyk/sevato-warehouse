"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      setError("Грешна парола.");
      return;
    }

    localStorage.setItem("sevato_warehouse_auth", "ok");
    window.location.href = "/";
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
      <div style={{ padding: 32, border: "1px solid #1f2937", borderRadius: 12 }}>
        <h1 style={{ textAlign: "center", marginBottom: 16 }}>SEVATO Warehouse</h1>

        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <input
            type="password"
            placeholder="Парола"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              background: "#0f172a",
              border: "1px solid #334155",
              color: "white",
            }}
          />

          <button
            style={{
              padding: "8px 12px",
              background: "#16a34a",
              borderRadius: 6,
              color: "white",
              fontWeight: 500,
            }}
          >
            Вход
          </button>

          {error && <p style={{ color: "#f97316" }}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
