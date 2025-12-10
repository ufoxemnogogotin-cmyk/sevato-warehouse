"use client";

import { useState } from "react";

export default function AgentChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Йо, аз съм SEVATO Warehouse Agent. Питай ме за наличности, сглобки, какво липсва, какво може да направим с частите или как да оптимизирам склада. ⚙️🔥",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const question = input.trim();
    setInput("");

    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.answer || "Няма отговор 🤖" },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Грешка при заявката към агента." },
      ]);
    }

    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "white",
        padding: "30px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 900 }}>
        <h1 style={{ marginBottom: 10, fontSize: 28, fontWeight: 700 }}>
          🧠 SEVATO Chat Agent
        </h1>
        <p style={{ marginBottom: 20, opacity: 0.7 }}>
          Твоят AI помощник за склада и моделите. Питай смело.  
        </p>

        <div
          style={{
            border: "1px solid #222",
            borderRadius: 12,
            padding: 20,
            height: "70vh",
            display: "flex",
            flexDirection: "column",
            background: "#111",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              paddingRight: 10,
              marginBottom: 15,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    maxWidth: "75%",
                    borderRadius: 10,
                    background:
                      msg.role === "user" ? "#16a34a" : "rgba(255,255,255,0.08)",
                    color: "white",
                    fontSize: 14,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div style={{ opacity: 0.6 }}>Агентът мисли…</div>}
          </div>

          <form onSubmit={sendMessage} style={{ display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напиши въпрос…"
              style={{
                flex: 1,
                padding: "10px 15px",
                borderRadius: 50,
                border: "1px solid #333",
                background: "#0d0d0d",
                color: "white",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: 50,
                background: loading ? "#16a34a88" : "#16a34a",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              Прати
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
