import { useState } from "react";

export default function ChatOverlay({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Super ! On va s'entraîner ensemble 💪\n\nPose-moi une question ou dis-moi sur quoi tu veux t'exercer (maths, français, histoire, sciences...)."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      if (data && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else if (data && data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Oups, une erreur est survenue. Réessaie dans un instant 😊" }
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Je n'arrive pas à joindre le serveur. Vérifie ta connexion Internet." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-overlay-backdrop">
      <div className="chat-overlay">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div>
            <h2>Prof IA CM1 👨‍🏫</h2>
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.15rem" }}>
              Pose une question, demande un exercice ou laisse le prof te poser une question à la fois.
            </p>
          </div>
          <button className="btn-secondary btn-sm" onClick={onClose}>
            Fermer
          </button>
        </header>
        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={
                "chat-bubble " +
                (m.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant")
              }
            >
              {m.content.split("\n").map((line, i) => (
                <p key={i} style={{ marginBottom: i === m.content.split("\n").length - 1 ? 0 : "0.2rem" }}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem" }}>
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écris ici ta question ou ta réponse..."
            style={{
              flex: 1,
              resize: "none",
              borderRadius: "0.7rem",
              border: "1px solid #1f2937",
              background: "#020617",
              color: "#e5e7eb",
              fontSize: "0.9rem",
              padding: "0.45rem 0.6rem"
            }}
          />
          <button
            className="btn-primary"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}
