import { useMemo, useState, useEffect } from "react";

export default function GameScreen({ game, level, onExit, onGainXp, onChangeLevel }) {
  const [question, setQuestion] = useState(() => game.generateQuestion(level));
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setQuestion(game.generateQuestion(level));
    setSelected(null);
    setIsCorrect(null);
  }, [game.id, level]);

  const handleAnswer = (index) => {
    if (selected !== null) return;
    setSelected(index);

    const correct = index === question.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setStreak((s) => s + 1);
      onGainXp(game.xpReward);
      if (streak + 1 >= 3) {
        onChangeLevel(1);
      }
    } else {
      setStreak(0);
      onChangeLevel(-1);
    }
  };

  const handleNext = () => {
    setQuestion(game.generateQuestion(level));
    setSelected(null);
    setIsCorrect(null);
  };

  const feedbackText = useMemo(() => {
    if (isCorrect === null) return "";
    if (isCorrect) return "Bravo ! Bonne réponse 🎉";
    return "Essaie encore, tu vas y arriver 💪";
  }, [isCorrect]);

  return (
    <div className="grid" style={{ gap: "1rem" }}>
      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div>
            <div className="chip" style={{ marginBottom: "0.3rem" }}>
              🎮 Mini-jeu
            </div>
            <h1>{game.title}</h1>
            <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.35rem" }}>
              {game.description}
            </p>
          </div>
          <button className="btn-secondary btn-sm" onClick={onExit}>
            Quitter
          </button>
        </div>
        <div
          style={{
            marginTop: "0.6rem",
            display: "flex",
            gap: "0.6rem",
            fontSize: "0.75rem",
            color: "#9ca3af",
            flexWrap: "wrap",
          }}
        >
          <span className="tag">Niveau : {level}</span>
          <span className="tag">XP par bonne réponse : +{game.xpReward}</span>
          <span className="tag">Série actuelle : {streak}</span>
        </div>
      </section>

      <section className="question-card">
        <div style={{ fontSize: "0.95rem", marginBottom: "0.5rem" }}>{question.prompt}</div>
        <div className="answers-grid">
          {question.options.map((opt, idx) => {
            const isSelected = selected === idx;
            let cls = "answer-btn";
            if (selected !== null) {
              if (idx === question.correctIndex) cls += " correct";
              else if (isSelected) cls += " wrong";
              else cls += " disabled";
            }
            return (
              <button key={idx} className={cls} onClick={() => handleAnswer(idx)}>
                {opt}
              </button>
            );
          })}
        </div>
        {isCorrect !== null && (
          <div className={"feedback " + (isCorrect ? "good" : "bad")}>
            <div style={{ marginTop: "0.6rem" }}>{feedbackText}</div>
            <div style={{ marginTop: "0.3rem", fontSize: "0.8rem", color: "#9ca3af" }}>
              {question.explanation}
            </div>
            <button
              className="btn-primary btn-sm"
              style={{ marginTop: "0.7rem" }}
              onClick={handleNext}
            >
              Question suivante →
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
