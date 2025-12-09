"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const search = useSearchParams();

  const correctPassword = process.env
    .NEXT_PUBLIC_WAREHOUSE_ADMIN_PASSWORD as string;

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password === correctPassword) {
      localStorage.setItem("warehouse-auth", "ok");
      const from = search.get("from") || "/";
      router.replace(from);
    } else {
      setError("Невалидна парола.");
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
          width: "100%",
          maxWidth: 360,
          padding: 32,
          borderRadius: 12,
          background: "#0f172a",
          border: "1px solid #1e293b",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 12,
            fontSize: 22,
            letterSpacing: 1,
          }}
        >
          SEVATO Warehouse
        </h1>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
          <label style={{ fontSize: 14 }}>
            Парола:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                background: "#020617",
                border: "1px solid #334155",
                color: "white",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 6,
              border: "none",
              background: "#16a34a",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Вход
          </button>

          {error && (
            <p style={{ color: "#f87171", fontSize: 13, marginTop: 4 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
