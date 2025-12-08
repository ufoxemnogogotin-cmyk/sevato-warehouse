"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("from") || "/";

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

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus(data.error || "Грешна парола.");
        setLoading(false);
        return;
      }

      // успех – пренасочваме към началната
      router.push(redirectTo);
    } catch (err) {
      console.error(err);
      setStatus("Нещо се счупи. Пробвай пак.");
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
          borderRadius: 16,
          padding: 32,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 0 40px rgba(0,0,0,0.8)",
          border: "1px solid #1f2937",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: 4,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          SEVATO
        </h1>
        <p style={{ textAlign: "center", marginBottom: 24, color: "#9ca3af" }}>
          Вход към Sevato Warehouse System
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: 16 }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            Парола:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 8,
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
              marginTop: 4,
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#16a34a",
              color: "white",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {loading ? "Влизане..." : "Влез"}
          </button>

          {status && (
            <p style={{ color: "#f97316", fontSize: 14 }}>{status}</p>
          )}
        </form>
      </div>
    </main>
  );
}