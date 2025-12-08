"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "white",
        padding: "40px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "50px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img src="/sevato-logo.svg" alt="Sevato" height={40} />
          <h1 style={{ fontSize: "26px", fontWeight: 600, margin: 0 }}>
            Sevato Warehouse System
          </h1>
        </div>
      </header>

      {/* Navigation Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        <NavCard title="📤 Upload QS лист" desc="Качване на PDF източници" href="/upload" />
        <NavCard title="🧩 Части" desc="Списък с наличните части" href="/parts" />
        <NavCard title="⌚ Модели" desc="Всички модели и техните части" href="/models" />
        <NavCard title="🤖 Build AI" desc="AI анализ: какво може да се сглоби" href="/build" />
        <NavCard title="📦 Движения" desc="История на складови операции" href="/stock" />
      </div>
    </main>
  );
}

function NavCard({ title, desc, href }: any) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "25px",
        borderRadius: "12px",
        background: "#1a1a1a",
        border: "1px solid #333",
        textDecoration: "none",
        transition: "0.2s",
      }}
    >
      <h2 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "white" }}>{title}</h2>
      <p style={{ margin: 0, color: "#aaa" }}>{desc}</p>
    </Link>
  );
}
