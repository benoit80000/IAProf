import { getGameById } from "../app/data/games";

export default function MissionsScreen({ missions, onStartMission }) {
  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <h1>Missions du jour 🎯</h1>
        <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.4rem" }}>
          Termine tes missions pour gagner des XP et débloquer de nouveaux badges.
        </p>
      </section>
      <section className="grid grid-2">
        {missions.missions.map((mission) => {
          const game = getGameById(mission.gameId);
          return (
            <article key={mission.id} className="game-card">
              <div className="game-title">{mission.title}</div>
              <div className="game-meta" style={{ marginBottom: "0.25rem" }}>
                {mission.description}
              </div>
              {game && (
                <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "0.25rem" }}>
                  Jeu : <strong>{game.title}</strong>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="chip">
                  🎁 <strong>+{mission.xpReward} XP</strong>
                </span>
                <button
                  className="btn-primary btn-sm"
                  onClick={() => onStartMission(mission)}
                >
                  Jouer
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
