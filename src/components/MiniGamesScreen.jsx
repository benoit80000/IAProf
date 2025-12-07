import React from "react";
import { SUBJECTS } from "../data/subjects";
import { gamesBySubject } from "../data/games";

export default function MiniGamesScreen({ onStartGame }) {
  const subjectOrder = ["maths", "francais", "logique", "culture"];

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1>Mini-jeux 🎮</h1>
        <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.4rem" }}>
          Choisis une matière et entraîne-toi en jouant. Tu peux jouer autant que tu veux !
        </p>
      </section>

      {subjectOrder.map((subjectId) => {
        const subject = SUBJECTS[subjectId];
        const games = gamesBySubject(subjectId);
        return (
          <section key={subjectId} className="card-soft">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <h2>
                {subject.emoji} {subject.label}
              </h2>
              <span
                className="chip"
                style={{ border: `1px solid ${subject.color}`, color: subject.color }}
              >
                {games.length} mini-jeux
              </span>
            </div>
            <div className="grid grid-2">
              {games.map((g) => (
                <article key={g.id} className="game-card">
                  <div className="game-title">{g.title}</div>
                  <div className="game-meta">{g.description}</div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.4rem",
                    }}
                  >
                    <span className="tag">
                      Difficulté : {g.difficulty}
                    </span>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => onStartGame(g)}
                    >
                      Jouer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
