import ProgressBar from "./ProgressBar";

const DEFAULT_BADGES = [
  { id: "perso", label: "Persévérant", icon: "💪", unlocked: true },
  { id: "tables", label: "As des tables", icon: "✖️", unlocked: false },
  { id: "detective", label: "Détective des mots", icon: "🕵️", unlocked: false },
  { id: "calcul-rapide", label: "Fusée du calcul", icon: "🚀", unlocked: false },
  { id: "serie", label: "5 jours d'affilée", icon: "📅", unlocked: false },
  { id: "secret1", label: "Badge secret 1", icon: "❓", unlocked: false }
];

export default function ProfileScreen({ player }) {
  const levelPct = Math.round((player.xp / player.nextLevelXp) * 100);

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: "999px",
              background:
                "radial-gradient(circle at 30% 20%, #f97316, transparent 55%), linear-gradient(135deg, #22c55e, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.2rem",
              border: "2px solid #facc15",
            }}
          >
            🎓
          </div>
          <div style={{ flex: 1 }}>
            <h1>Profil de {player.name}</h1>
            <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.3rem" }}>
              Continue de t'entraîner pour monter de niveau et débloquer les badges secrets.
            </p>
            <div style={{ marginTop: "0.4rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.75rem",
                  marginBottom: "0.2rem",
                }}
              >
                <span>
                  Niveau <strong>{player.level}</strong>
                </span>
                <span>
                  {player.xp} / {player.nextLevelXp} XP ({levelPct}%)
                </span>
              </div>
              <ProgressBar value={player.xp} max={player.nextLevelXp} />
            </div>
          </div>
        </div>
      </section>

      <section className="card-soft">
        <h2>Badges 🏆</h2>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.3rem" }}>
          Les badges se débloquent quand tu fais des actions particulières (terminer des missions,
          réussir plusieurs exercices d'affilée, revenir plusieurs jours...).
        </p>
        <div className="badges-row" style={{ marginTop: "0.5rem" }}>
          {DEFAULT_BADGES.map((badge) => (
            <div
              key={badge.id}
              className={"badge-pill" + (!badge.unlocked ? " locked" : "")}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card-soft">
        <h2>Statistiques simples 📊</h2>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "0.3rem" }}>
          (À enrichir plus tard avec de vraies données par matière, temps de jeu, etc.)
        </p>
        <ul style={{ fontSize: "0.85rem", color: "#e5e7eb", marginTop: "0.4rem", paddingLeft: "1.1rem" }}>
          <li>Temps total estimé : {player.totalSessions * 5} minutes</li>
          <li>Nombre de parties : {player.totalSessions}</li>
          <li>Missions terminées : {player.missionsCompleted}</li>
        </ul>
      </section>
    </div>
  );
}
