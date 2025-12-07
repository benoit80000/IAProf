import ProgressBar from "./ProgressBar";
import { GAMES } from "../app/data/games";

export default function HomeScreen({ player, missions, onStartMission, onStartGame, onOpenChat }) {
  const popularGames = GAMES.slice(0, 4);

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div>
            <div className="chip" style={{ marginBottom: "0.4rem" }}>
              <span className="chip-dot" style={{ background: "#22c55e" }} />
              Entraînement CM1
            </div>
            <h1>Bonjour {player.name} 👋</h1>
            <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.35rem" }}>
              Aujourd'hui, ton objectif est de gagner au moins 25 XP !
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "999px",
                background:
                  "radial-gradient(circle at 30% 20%, #facc15, transparent 55%), linear-gradient(135deg, #4f46e5, #0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                border: "2px solid #22c55e",
              }}
            >
              🎓
            </div>
            <div style={{ marginTop: "0.35rem", fontSize: "0.8rem" }}>
              Niveau <strong>{player.level}</strong>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "0.7rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.2rem" }}>
            <span>XP : {player.xp} / {player.nextLevelXp}</span>
            <span>{Math.round((player.xp / player.nextLevelXp) * 100)}%</span>
          </div>
          <ProgressBar value={player.xp} max={player.nextLevelXp} />
        </div>
      </section>

      <section className="card-soft">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
          <h2>Missions du jour 🎯</h2>
          <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
            {missions.missions.length} missions
          </span>
        </div>
        <div className="grid grid-2">
          {missions.missions.map((m) => (
            <article key={m.id} className="game-card">
              <div className="game-title">{m.title}</div>
              <div className="game-meta">{m.description}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem" }}>
                <span className="chip">
                  🎁 <strong>+{m.xpReward} XP</strong>
                </span>
                <button
                  className="btn-primary btn-sm"
                  onClick={() => onStartMission(m)}
                >
                  Jouer
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-soft">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
          <h2>Prof IA 👨‍🏫</h2>
          <button className="btn-primary btn-sm" onClick={onOpenChat}>
            Discuter avec le prof
          </button>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
          Pose une question sur une leçon, demande un exercice ou laisse le Prof IA t'interroger
          comme en classe.
        </p>
      </section>

      <section className="card-soft">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
          <h2>Mini-jeux populaires 🎮</h2>
          <button
            className="btn-secondary btn-sm"
            onClick={() => onStartGame(popularGames[0])}
          >
            Commencer
          </button>
        </div>
        <div className="grid grid-2">
          {popularGames.map((g) => (
            <article key={g.id} className="game-card">
              <div className="game-title">{g.title}</div>
              <div className="game-meta">{g.description}</div>
              <button
                className="btn-secondary btn-sm"
                style={{ marginTop: "0.4rem" }}
                onClick={() => onStartGame(g)}
              >
                Jouer
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
