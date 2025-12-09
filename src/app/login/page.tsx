"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const STORAGE_KEY = "sevato_warehouse_auth";
const PASSWORD = process.env.NEXT_PUBLIC_WAREHOUSE_ADMIN_PASSWORD ?? "";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const search = useSearchParams();

  // ако вече сме логнати → директно към /
  useEffect(() => {
    if (!PASSWORD) return;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEY)
        : null;

    if (token === PASSWORD) {
      const from = search.get("from") || "/";
      router.replace(from);
    }
  }, [router, search]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!PASSWORD) {
      setError("Server password not configured.");
      return;
    }

    if (password === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, PASSWORD);
      const from = search.get("from") || "/";
      router.replace(from);
    } else {
      setError("Грешна парола.");
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
