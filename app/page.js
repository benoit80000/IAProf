"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen,
  Camera,
  Send,
  Trash2,
  Loader,
  Upload,
  Star,
  Trophy,
  Award,
  Target,
  Zap,
  Crown,
  Sparkles,
  Medal,
  X,
  Flame,
  Gamepad2,
  Timer,
  Check,
  User,
  Palette,
  PenTool,
  Download,
  Calculator,
  KeyRound,
} from "lucide-react";

import useLocalStorage from "./hooks/useLocalStorage";
import { MATIERES, THEMES_PAR_MATIERE, BADGES, AVATARS, AVATAR_COLORS, MINI_GAMES } from "./constants/gameData";

// ==================== CONSTANTS ====================
// ==================== HOOKS ====================
const generateDailyMissions = () => {
  const today = new Date().toDateString();
  return {
    date: today,
    missions: [
      { id: "questions-5", title: "Réponds à 5 questions", target: 5, current: 0, reward: 20, type: "questions", emoji: "❓" },
      { id: "maths-3", title: "Fais 3 exercices de maths", target: 3, current: 0, reward: 15, type: "maths", emoji: "🔢" },
      { id: "francais-3", title: "Travaille 3 questions de français", target: 3, current: 0, reward: 15, type: "francais", emoji: "📝" },
      { id: "sciences-2", title: "Travaille 2 questions de sciences", target: 2, current: 0, reward: 15, type: "sciences", emoji: "🔬" },
      { id: "histoire-2", title: "Travaille 2 questions d'histoire-géo", target: 2, current: 0, reward: 15, type: "histoire", emoji: "🌍" },
      { id: "anglais-2", title: "Travaille 2 questions d'anglais", target: 2, current: 0, reward: 15, type: "anglais", emoji: "🇬🇧" },
      { id: "quiz-1", title: "Termine un quiz photo", target: 1, current: 0, reward: 25, type: "quiz", emoji: "📸" },
      { id: "mini-jeux-1", title: "Joue à un mini-jeu", target: 1, current: 0, reward: 15, type: "mini-jeux", emoji: "🎮" },
      { id: "arts-1", title: "Fais un dessin en arts plastiques", target: 1, current: 0, reward: 20, type: "arts", emoji: "🎨" },
      { id: "earn-30", title: "Gagne 30 étoiles aujourd'hui", target: 30, current: 0, reward: 25, type: "earn-points", emoji: "⭐" },
      { id: "streak", title: "Maintiens ta série", target: 1, current: 0, reward: 10, type: "streak", emoji: "🔥" },
    ],
  };
};

// ==================== SUB-COMPONENTS ====================

const ProgressBar = ({ current, target, color = "bg-purple-500", showLabel = true }) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-600 mt-1 text-center">
          {current} / {target}
        </p>
      )}
    </div>
  );
};

const LevelProgress = ({ points, currentBadge, nextBadge }) => {
  if (!nextBadge) {
    return (
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-sm">Niveau Maximum !</span>
        </div>
        <p className="text-xs text-gray-600">Tu es une Légende ! 🎉</p>
      </div>
    );
  }

  const progress = points - currentBadge.points;
  const needed = nextBadge.points - currentBadge.points;
  const CurrentIcon = currentBadge.icon;

  return (
    <div className="bg-white rounded-xl p-3 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CurrentIcon className={`w-5 h-5 ${currentBadge.color}`} />
          <span className="font-bold text-sm">{currentBadge.nom}</span>
        </div>
        <span className="text-xs text-gray-500">→ {nextBadge.nom}</span>
      </div>
      <ProgressBar
        current={progress}
        target={needed}
        color={currentBadge.color.replace("text-", "bg-")}
        showLabel={false}
      />
      <p className="text-xs text-gray-500 mt-1">
        Plus que {nextBadge.points - points} ⭐ pour {nextBadge.nom} !
      </p>
    </div>
  );
};

const StreakDisplay = ({ streak, lastVisit }) => {
  const isActiveToday = lastVisit === new Date().toDateString();

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${streak > 0 ? "bg-orange-100" : "bg-gray-100"}`}>
      <Flame className={`w-5 h-5 ${streak > 0 ? "text-orange-500" : "text-gray-400"}`} />
      <span className="font-bold text-sm">{streak}</span>
      {isActiveToday && <span className="text-xs text-green-500">✓</span>}
    </div>
  );
};

const DailyMissionsPanel = ({ missions, completedMissions, onClose }) => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold">Missions</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === "today" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("today")}
          >
            Missions du jour
          </button>
          <button
            className={`flex-1 py-2 text-sm font-semibold ${activeTab === "completed" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("completed")}
          >
            Missions réalisées
          </button>
        </div>

        {activeTab === "today" && (
          <div className="space-y-4">
            {missions.map((mission) => {
              const completed = mission.current >= mission.target;
              return (
                <div
                  key={mission.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    completed ? "border-green-400 bg-green-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{mission.emoji}</span>
                      <span className="font-semibold">{mission.title}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-bold">+{mission.reward}</span>
                    </div>
                  </div>
                  <ProgressBar
                    current={mission.current}
                    target={mission.target}
                    color={completed ? "bg-green-500" : "bg-blue-500"}
                  />
                  {completed && (
                    <div className="flex items-center gap-1 text-green-600 mt-2">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-semibold">Complété !</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="space-y-3">
            {(!completedMissions || completedMissions.length === 0) && (
              <p className="text-sm text-gray-500">Aucune mission réalisée pour le moment.</p>
            )}
            {completedMissions &&
              completedMissions.map((mission, index) => (
                <div
                  key={mission.id + mission.date + index}
                  className="p-3 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mission.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{mission.title}</p>
                      <p className="text-xs text-gray-500">Terminé le {mission.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-bold">+{mission.reward}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
const AvatarSelector = ({
  selectedAvatar,
  selectedColor,
  unlockedAvatars,
  unlockedColors,
  points,
  showPointsPop,
  lastPointsGain,
  onSelectAvatar,
  onSelectColor,
  onUnlock,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold">Mon Avatar</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className={`w-24 h-24 ${selectedColor} rounded-full flex items-center justify-center text-5xl shadow-lg`}>
            {selectedAvatar}
          </div>
        </div>

        <h3 className="font-bold mb-3">Personnage</h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {AVATARS.map((avatar) => {
            const isUnlocked = unlockedAvatars.includes(avatar.id);
            const isSelected = selectedAvatar === avatar.emoji;
            return (
              <button
                key={avatar.id}
                onClick={() => (isUnlocked ? onSelectAvatar(avatar.emoji) : onUnlock("avatar", avatar))}
                className={`p-3 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-purple-500 bg-purple-50"
                    : isUnlocked
                    ? "border-gray-200 hover:border-purple-300"
                    : "border-gray-200 bg-gray-100 opacity-60"
                }`}
              >
                <div className="text-3xl mb-1">{avatar.emoji}</div>
                <div className="text-xs">{avatar.nom}</div>
                {!isUnlocked && (
                  <div className="flex items-center justify-center gap-1 text-xs text-yellow-600 mt-1">
                    <Star className="w-3 h-3" />
                    {avatar.cost}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <h3 className="font-bold mb-3">Couleur</h3>
        <div className="grid grid-cols-4 gap-2">
          {AVATAR_COLORS.map((colorOption) => {
            const isUnlocked = unlockedColors.includes(colorOption.id);
            const isSelected = selectedColor === colorOption.color;
            return (
              <button
                key={colorOption.id}
                onClick={() => (isUnlocked ? onSelectColor(colorOption.color) : onUnlock("color", colorOption))}
                className={`p-3 rounded-xl border-2 transition-all ${isSelected ? "border-purple-500" : "border-gray-200"} ${
                  !isUnlocked ? "opacity-60" : ""
                }`}
              >
                <div className={`w-8 h-8 ${colorOption.color} rounded-full mx-auto mb-1`} />
                <div className="text-xs">{colorOption.nom}</div>
                {!isUnlocked && (
                  <div className="flex items-center justify-center gap-1 text-xs text-yellow-600 mt-1">
                    <Star className="w-3 h-3" />
                    {colorOption.cost}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded-xl text-center">
          <p className="text-sm flex items-center justify-center gap-2">
            Tes étoiles : <strong>{points} ⭐</strong>
            {showPointsPop && (
              <span className="text-green-600 text-xs font-bold animate-bounce">
                +{lastPointsGain}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const BadgesPanel = ({ points, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🏆 Tes Badges</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
          <p className="text-center text-lg font-semibold mb-2">Tu as {points} étoiles ⭐</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            const unlocked = points >= badge.points;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  unlocked ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50" : "border-gray-200 bg-gray-50 opacity-50"
                }`}
              >
                <Icon className={`w-12 h-12 mx-auto mb-2 ${unlocked ? badge.color : "text-gray-300"}`} />
                <h3 className="font-bold text-center mb-1">{badge.nom}</h3>
                <p className="text-xs text-center text-gray-600">{badge.desc}</p>
                {unlocked && <p className="text-center text-green-600 font-semibold mt-2">✓ Débloqué !</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CodePanel = ({ onClose, onAddPoints, onRemovePoints }) => {
  const [value, setValue] = useState("10");
  const parsed = parseInt(value, 10) || 0;

  const handleAdd = () => {
    if (parsed !== 0) onAddPoints(parsed);
  };

  const handleRemove = () => {
    if (parsed !== 0) onRemovePoints(parsed);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold">Menu code</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Ici tu peux ajouter ou retirer des étoiles manuellement (par exemple pour corriger ou récompenser un travail).
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre d&apos;étoiles</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded-xl text-sm"
            >
              + Ajouter
            </button>
            <button
              onClick={handleRemove}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-xl text-sm"
            >
              - Retirer
            </button>
          </div>

          <p className="text-[11px] text-gray-400">
            Astuce : tu peux par exemple donner des étoiles pour un travail fait hors de l&apos;application,
            ou retirer des étoiles si besoin.
          </p>
        </div>
      </div>
    </div>
  );
};

const CalculMentalGame = ({ matiere, theme, onClose, onWin }) => {
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  const generateQuestion = () => {
    const operations = ["+", "-", "×"];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a, b, answer;

    switch (op) {
      case "+":
        a = Math.floor(Math.random() * 50) + 10;
        b = Math.floor(Math.random() * 50) + 10;
        answer = a + b;
        break;
      case "-":
        a = Math.floor(Math.random() * 50) + 30;
        b = Math.floor(Math.random() * 30) + 1;
        answer = a - b;
        break;
      case "×":
        a = Math.floor(Math.random() * 10) + 2;
        b = Math.floor(Math.random() * 10) + 2;
        answer = a * b;
        break;
      default:
        a = 1;
        b = 1;
        answer = 2;
    }

    setQuestion({ a, b, op, answer });
    setUserAnswer("");
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const checkAnswer = () => {
    if (!userAnswer) return;
    const isCorrect = parseInt(userAnswer) === question.answer;
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ correct: true, message: "Bravo ! 🎉" });
      setTimeout(generateQuestion, 500);
    } else {
      setFeedback({ correct: false, message: `Non, c'était ${question.answer}` });
      setTimeout(generateQuestion, 1000);
    }
  };

  const handleFinish = () => {
    const earnedPoints = score * 3;
    onWin(earnedPoints);
    onClose();
  };

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">⏱️ Temps écoulé !</h2>
          <div className="text-6xl mb-4">🧮</div>
          <p className="text-xl mb-2">
            Score : <strong>{score}</strong> bonnes réponses
          </p>
          <p className="text-lg text-yellow-600 mb-6">
            Tu gagnes <strong>{score * 3} ⭐</strong> !
          </p>
          <button onClick={handleFinish} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-xl">
            Récupérer mes étoiles !
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
            <Timer className="w-5 h-5 text-red-500" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 rounded-full">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>
          <button onClick={onClose} className="text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg font-bold mb-4">🧮 Calcul Mental</h2>
          {question && (
            <div className="text-4xl font-bold mb-4">
              {question.a} {question.op} {question.b} = ?
            </div>
          )}

          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
            className="w-32 text-center text-2xl border-2 border-gray-300 rounded-xl p-3 mb-4"
            autoFocus
          />

          {feedback && (
            <div className={`text-lg font-bold ${feedback.correct ? "text-green-500" : "text-red-500"}`}>{feedback.message}</div>
          )}
        </div>

        <button
          onClick={checkAnswer}
          disabled={!userAnswer}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl"
        >
          Valider
        </button>
      </div>
    </div>
  );
};
const WORDS_BY_SUBJECT = {
  francais: ["verbe", "sujet", "phrase", "adjectif", "conjugaison"],
  dictee: ["orthographe", "accord", "genre", "nombre", "ponctuation"],
  maths: ["fraction", "addition", "soustraction", "rectangle", "triangle"],
  sciences: ["plante", "respiration", "planete", "soleil", "energie"],
  histoire: ["prehistoire", "antiquite", "royaume", "chateau", "empire"],
  geographie: ["carte", "pays", "continent", "ocean", "ville"],
  anglais: ["teacher", "school", "lesson", "english", "family"],
  "arts-plastiques": ["couleur", "peinture", "dessin", "artiste"],
  "education-musicale": ["musique", "rythme", "chant", "instrument"],
  "histoire-des-arts": ["tableau", "sculpture", "museum"],
  eps: ["sport", "course", "saut", "jeu"],
  emc: ["respect", "regle", "droit", "solidarite"],
  general: ["ecole", "eleve", "cahier", "professeur", "classe"],
};

const STATEMENTS_BY_SUBJECT = {
  maths: [
    { text: "5 + 3 = 8", isTrue: true },
    { text: "10 est un nombre impair.", isTrue: false },
    { text: "Un triangle a 3 côtés.", isTrue: true },
    { text: "2 × 6 = 14.", isTrue: false },
  ],
  francais: [
    { text: "Une phrase commence toujours par une majuscule.", isTrue: true },
    { text: "Le verbe est toujours au début de la phrase.", isTrue: false },
    { text: "On met un point à la fin d’une phrase.", isTrue: true },
  ],
  dictee: [
    { text: "On entend toujours toutes les lettres d’un mot.", isTrue: false },
    { text: "On met un s au pluriel des noms en général.", isTrue: true },
  ],
  sciences: [
    { text: "La Terre tourne autour du Soleil.", isTrue: true },
    { text: "Les poissons respirent avec des poumons.", isTrue: false },
  ],
  histoire: [
    { text: "Les hommes préhistoriques vivaient dans des grottes.", isTrue: true },
    { text: "L’Antiquité vient après le Moyen Âge.", isTrue: false },
  ],
  anglais: [
    { text: "'Hello' veut dire 'Bonjour'.", isTrue: true },
    { text: "'Dog' veut dire 'Chat'.", isTrue: false },
  ],
  general: [
    { text: "À l’école, on doit respecter les autres.", isTrue: true },
    { text: "On peut crier tout le temps en classe.", isTrue: false },
  ],
};

const getWordsForSubject = (matiere) => {
  return WORDS_BY_SUBJECT[matiere] || WORDS_BY_SUBJECT.general;
};

const getStatementsForSubject = (matiere) => {
  return STATEMENTS_BY_SUBJECT[matiere] || STATEMENTS_BY_SUBJECT.general;
};

const PenduGame = ({ matiere, theme, onClose, onWin }) => {
  const [word, setWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(8);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const initGame = () => {
    const words = getWordsForSubject(matiere);
    const random = words[Math.floor(Math.random() * words.length)] || "ecole";
    setWord(random.toUpperCase());
    setGuessedLetters([]);
    setAttemptsLeft(8);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    initGame();
  }, [matiere, theme]);

  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.includes(letter)) return;
    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      if (newAttempts <= 0) {
        setGameOver(true);
        setWon(false);
      }
    } else {
      const allRevealed = word
        .split("")
        .every((l) => l === " " || newGuessed.includes(l));
      if (allRevealed) {
        setGameOver(true);
        setWon(true);
        onWin(25);
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  const maskedWord = word
    .split("")
    .map((l) => (l === " " ? " " : guessedLetters.includes(l) ? l : "_"))
    .join(" ");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold">Jeu du pendu</h2>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-2">
          Mots liés à : <span className="font-semibold">{matiere || "ta matière"}</span>
        </p>

        <div className="flex flex-col items-center mb-4">
          <div className="text-2xl tracking-widest font-mono mb-2">{maskedWord}</div>
          <p className="text-sm text-gray-600">Essais restants : {attemptsLeft}</p>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {alphabet.map((letter) => {
            const disabled = guessedLetters.includes(letter) || gameOver;
            return (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={disabled}
                className={`text-xs py-1 rounded-md border ${
                  disabled
                    ? "bg-gray-200 text-gray-400 border-gray-200"
                    : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {gameOver && (
          <div className={`p-3 rounded-xl text-center mb-3 ${won ? "bg-green-50" : "bg-red-50"}`}>
            <p className="text-sm">
              {won ? "Bravo, tu as trouvé le mot ! ⭐" : `Dommage, le mot était : ${word}`}
            </p>
            {won && <p className="text-xs text-gray-600 mt-1">+25 étoiles gagnées 🎉</p>}
          </div>
        )}

        {!gameOver && (
          <p className="text-xs text-gray-500 text-center">
            Trouve le mot avant de perdre tous tes essais !
          </p>
        )}
      </div>
    </div>
  );
};

const VraiFauxGame = ({ matiere, theme, onClose, onWin, title = "Vrai ou Faux" }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const statements = getStatementsForSubject(matiere);
  const totalQuestions = Math.min(10, statements.length);

  const current = statements[index % statements.length];

  const answer = (value) => {
    if (finished) return;
    const isCorrect = value === current.isTrue;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("Bravo, c'est vrai ! ⭐");
    } else {
      setFeedback(current.isTrue ? "C'était vrai !" : "C'était faux !");
    }

    if (index + 1 >= totalQuestions) {
      setFinished(true);
      const pts = (score + (isCorrect ? 1 : 0)) * 3;
      onWin(pts);
    } else {
      setTimeout(() => {
        setIndex((i) => i + 1);
        setFeedback(null);
      }, 800);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-2">
          Questions liées à : <span className="font-semibold">{matiere || "ta matière"}</span>
        </p>

        {!finished ? (
          <>
            <p className="text-sm text-gray-700 mb-4">
              Question {index + 1}/{totalQuestions}
            </p>
            <div className="p-4 bg-purple-50 rounded-2xl mb-4">
              <p className="text-base text-gray-800">{current.text}</p>
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={() => answer(true)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl"
              >
                Vrai
              </button>
              <button
                onClick={() => answer(false)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl"
              >
                Faux
              </button>
            </div>

            {feedback && (
              <p className="text-sm text-center text-gray-700 mb-2">{feedback}</p>
            )}

            <p className="text-xs text-gray-500 text-center">
              Réponds le mieux possible, chaque bonne réponse te donnera des étoiles !
            </p>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg font-bold mb-2">Quiz terminé ! 🎉</p>
            <p className="text-sm text-gray-700 mb-2">
              Tu as eu {score}/{totalQuestions} bonnes réponses.
            </p>
            <p className="text-xs text-gray-500 mb-4">Tes étoiles ont été ajoutées à ton compte.</p>
            <button
              onClick={handleClose}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-xl"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
const MathCompareGame = ({ matiere, theme, onClose, onWin }) => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const totalRounds = 5;

  const newRound = () => {
    let x = Math.floor(Math.random() * 99) + 1;
    let y = Math.floor(Math.random() * 99) + 1;
    if (x === y) y = (y % 99) + 1;
    setA(x);
    setB(y);
  };

  useEffect(() => {
    newRound();
  }, []);

  const handleChoice = (choice) => {
    if (finished) return;
    const correct = a > b ? "a" : "b";
    const isCorrect = choice === correct;

    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("Bravo, tu as choisi le plus grand nombre ! ⭐");
    } else {
      setFeedback("Ce n'était pas le plus grand nombre, essaie encore !");
    }

    if (round >= totalRounds) {
      const finalScore = isCorrect ? score + 1 : score;
      setFinished(true);
      // Win condition : au moins 3 bonnes réponses sur 5
      if (finalScore >= 3) {
        onWin();
      }
    } else {
      setTimeout(() => {
        setRound((r) => r + 1);
        setFeedback(null);
        newRound();
      }, 800);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold">Comparaison de nombres</h2>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!finished ? (
          <>
            <p className="text-sm text-gray-700 mb-2">
              Manche {round}/{totalRounds} – Choisis le plus grand nombre :
            </p>
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => handleChoice("a")}
                className="flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl py-3 text-xl font-bold"
              >
                {a}
              </button>
              <button
                onClick={() => handleChoice("b")}
                className="flex-1 bg-green-50 hover:bg-green-100 border border-green-200 rounded-2xl py-3 text-xl font-bold"
              >
                {b}
              </button>
            </div>
            {feedback && <p className="text-sm text-center text-gray-700 mb-2">{feedback}</p>}
            <p className="text-xs text-gray-500 text-center">
              Tu as {score} bonne(s) réponse(s) pour l'instant.
            </p>
          </>
        ) : (
          <div className="text-center">
            <p className="text-lg font-bold mb-2">Partie terminée !</p>
            <p className="text-sm text-gray-700 mb-2">
              Tu as eu {score}/{totalRounds} bonnes réponses.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Si tu as au moins 3 bonnes réponses, tu gagnes des étoiles grâce à ce mini-jeu.
            </p>
            <button
              onClick={handleClose}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-xl"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DrawingCanvas = ({ onClose, onValidate }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e && e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "mon-dessin.png";
    link.click();
  };

  const handleValidate = () => {
    onValidate();
  };

  const colors = ["#000000", "#444444", "#ff0000", "#ff7f00", "#ffff00", "#00a000", "#00bfff", "#0000ff", "#4b0082", "#aa00aa", "#ff1493"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-600" />
            <h2 className="text-base sm:text-lg font-bold">Atelier de dessin</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mb-3">
          Dessine librement pour travailler les couleurs, les mélanges et la palette graphique. 🎨
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex justify-center items-center">
            <canvas
              ref={canvasRef}
              width={700}
              height={400}
              className="border border-gray-300 rounded-xl shadow-inner touch-none bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          <div className="w-full sm:w-48 flex flex-col gap-3">
            <div>
              <p className="text-xs sm:text-sm font-semibold mb-1">Couleur du pinceau</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBrushColor(c)}
                    className={`w-7 h-7 rounded-full border-2 ${
                      brushColor === c ? "border-purple-500" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs sm:text-sm font-semibold mb-1">Taille du pinceau</p>
              <input
                type="range"
                min="2"
                max="16"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Enregistrer mon dessin (PNG)
              </button>
              <button
                onClick={clearCanvas}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm hover:bg-gray-50"
              >
                <Trash2 className="w-4 h-4" />
                Effacer le dessin
              </button>
              <button
                onClick={handleValidate}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm font-semibold"
              >
                <PenTool className="w-4 h-4" />
                Valider mon dessin (+étoiles et note)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




const FrenchVerbGame = ({ onClose, onWin }) => {
  const QUESTIONS = [
    {
      sentence: "Le chat mange une souris.",
      words: ["Le", "chat", "mange", "une", "souris."],
      verbIndex: 2,
    },
    {
      sentence: "Les enfants jouent dans le parc.",
      words: ["Les", "enfants", "jouent", "dans", "le", "parc."],
      verbIndex: 2,
    },
    {
      sentence: "Je regarde un dessin animé.",
      words: ["Je", "regarde", "un", "dessin", "animé."],
      verbIndex: 1,
    },
    {
      sentence: "Nous écrivons une histoire.",
      words: ["Nous", "écrivons", "une", "histoire."],
      verbIndex: 1,
    },
    {
      sentence: "Elle prend son cartable.",
      words: ["Elle", "prend", "son", "cartable."],
      verbIndex: 1,
    },
  ];

  const totalQuestions = QUESTIONS.length;
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  const current = QUESTIONS[index];

  const handleWordClick = (wordIndex) => {
    if (finished) return;
    const isCorrect = wordIndex === current.verbIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback({ correct: true, message: "Bravo, tu as trouvé le verbe ! 🎉" });
    } else {
      setFeedback({ correct: false, message: "Ce n'est pas le verbe conjugué, essaie encore !" });
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 >= totalQuestions) {
        setFinished(true);
        onWin(); // Gestion des points par handleGameWin
      } else {
        setIndex((i) => i + 1);
      }
    }, 800);
  };

  const handleClose = () => {
    onClose();
  };

  if (finished) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Jeu terminé !</h2>
          <div className="text-5xl mb-3">🧠</div>
          <p className="text-sm mb-2">
            Tu as trouvé le verbe dans {score}/{totalQuestions} phrase(s).
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Tu as gagné des étoiles et de l&apos;XP pour ce mini-jeu.
          </p>
          <button
            onClick={handleClose}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-xl"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold">Trouve le verbe</h2>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-2">
          Clique sur le <span className="font-semibold">verbe conjugué</span> dans la phrase.
        </p>

        <p className="text-sm text-gray-700 mb-4">
          Phrase {index + 1}/{totalQuestions}
        </p>

        <div className="p-4 bg-purple-50 rounded-2xl mb-4">
          <p className="text-base text-gray-800 mb-3">{current.sentence}</p>
          <div className="flex flex-wrap gap-2">
            {current.words.map((w, i) => (
              <button
                key={i}
                onClick={() => handleWordClick(i)}
                className="px-3 py-1 bg-white hover:bg-purple-100 border border-purple-200 rounded-full text-sm"
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {feedback && (
          <p
            className={`text-sm font-semibold text-center ${
              feedback.correct ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
};

const EnglishMemoryGame = ({ onClose, onWin }) => {
  const PAIRS = [
    { en: "cat", fr: "chat" },
    { en: "dog", fr: "chien" },
    { en: "apple", fr: "pomme" },
    { en: "house", fr: "maison" },
  ];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const initialCards = [];
    PAIRS.forEach((pair, index) => {
      initialCards.push(
        { id: index * 2, label: pair.en, pairId: index },
        { id: index * 2 + 1, label: pair.fr, pairId: index }
      );
    });
    for (let i = initialCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
    }
    setCards(initialCards);
  }, []);

  const handleCardClick = (card) => {
    if (finished) return;
    if (flipped.find((c) => c.id === card.id)) return;
    if (matched.includes(card.id)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [c1, c2] = newFlipped;
      if (c1.pairId === c2.pairId) {
        setTimeout(() => {
          setMatched((prev) => [...prev, c1.id, c2.id]);
          setFlipped([]);
          if (matched.length + 2 >= cards.length) {
            setFinished(true);
            onWin(); // Gestion des points par handleGameWin
          }
        }, 600);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 800);
      }
    }
  };

  const handleClose = () => {
    onClose();
  };

  const allMatched = matched.length === cards.length && cards.length > 0;

  if (finished || allMatched) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full text-center">
          <h2 className="text-xl font-bold mb-2">Bravo ! 🎉</h2>
          <div className="text-5xl mb-3">🔤</div>
          <p className="text-sm mb-2">Tu as retrouvé toutes les paires en {moves} coups.</p>
          <p className="text-xs text-gray-500 mb-4">
            Tu as gagné des étoiles et de l&apos;XP pour ce mini-jeu.
          </p>
          <button
            onClick={handleClose}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-xl"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold">Memory anglais</h2>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Retourne les cartes et retrouve les paires{" "}
          <span className="font-semibold">mot anglais / mot français</span>.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {cards.map((card) => {
            const isFlipped =
              !!flipped.find((c) => c.id === card.id) || matched.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`h-16 rounded-xl border text-sm font-bold flex items-center justify-center ${
                  isFlipped
                    ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                }`}
              >
                {isFlipped ? card.label : "?"}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 mt-3 text-right">Coups : {moves}</p>
      </div>
    </div>
  );
};

const MiniGamesPanel = ({ onClose, onSelectGame, level, points }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold">Mini-Jeux</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Chaque partie coûte <span className="font-semibold">10 étoiles</span>. Certains jeux se débloquent avec ton niveau.
        </p>

        <div className="space-y-3">
          {MINI_GAMES.map((game) => {
            const requiredLevel = game.levelRequired || 1;
            const unlocked = level >= requiredLevel;
            const enoughPoints = points >= 10;
            const disabled = !unlocked || !enoughPoints;

            return (
              <button
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                disabled={disabled}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                  disabled
                    ? "border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed"
                    : "border-gray-200 hover:border-purple-400 hover:bg-purple-50"
                }`}
              >
                <div className="text-4xl">{game.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{game.nom}</h3>
                  <p className="text-sm text-gray-600">{game.desc}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      <Star className="w-3 h-3" /> 10 étoiles / partie
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      <Trophy className="w-3 h-3" /> Niveau {requiredLevel}+
                    </span>
                    {!unlocked && (
                      <span className="text-[11px] text-gray-500">Atteins le niveau {requiredLevel} pour débloquer ce jeu.</span>
                    )}
                    {unlocked && !enoughPoints && (
                      <span className="text-[11px] text-red-500">Pas assez d'étoiles pour jouer.</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};


// ==================== MAIN COMPONENT ====================
export default function ProfIA() {
  // Core state
  const [matiere, setMatiere] = useState("");
  const [themeSelectionne, setThemeSelectionne] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Persisted state
  const [points, setPoints] = useLocalStorage("profai-points", 0);
  const [xp, setXp] = useLocalStorage("profai-xp", 0);
  const [streak, setStreak] = useLocalStorage("profai-streak", 0);
  const [lastVisit, setLastVisit] = useLocalStorage("profai-lastVisit", "");
  const [dailyMissions, setDailyMissions] = useLocalStorage("profai-missions", generateDailyMissions());
  const [completedMissions, setCompletedMissions] = useLocalStorage("profai-completedMissions", []);
  const [selectedAvatar, setSelectedAvatar] = useLocalStorage("profai-avatar", "🐱");
  const [selectedColor, setSelectedColor] = useLocalStorage("profai-color", "bg-blue-500");
  const [unlockedAvatars, setUnlockedAvatars] = useLocalStorage("profai-unlockedAvatars", ["cat", "dog", "rabbit"]);
  const [unlockedColors, setUnlockedColors] = useLocalStorage("profai-unlockedColors", ["blue", "purple"]);

  // UI state
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState("");
  const [showBadges, setShowBadges] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showMiniGames, setShowMiniGames] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [showCodePanel, setShowCodePanel] = useState(false);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const MASTER_PIN = "12345";
  const [activeGame, setActiveGame] = useState(null);
  const [lastPointsGain, setLastPointsGain] = useState(0);
  const [showPointsPop, setShowPointsPop] = useState(false);


  // Refs
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize streak on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastVisit !== today) {
      if (lastVisit === yesterday) {
        setStreak((prev) => prev + 1);
      } else if (lastVisit && lastVisit !== today) {
        setStreak(1);
      } else if (!lastVisit) {
        setStreak(1);
      }
      setLastVisit(today);

      setDailyMissions((prev) => ({
        ...prev,
        missions: prev.missions.map((m) => (m.type === "streak" ? { ...m, current: 1 } : m)),
      }));

      if (dailyMissions.date !== today) {
        setDailyMissions(generateDailyMissions());
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const celebrate = (text = "") => {
    setCelebrationText(text);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const updateMissionProgress = (type, amount) => {
    setDailyMissions((prev) => {
      const updatedMissions = prev.missions.map((m) => {
        if (m.type !== type) return m;
        const newCurrent = Math.min(m.current + amount, m.target);
        return { ...m, current: newCurrent };
      });

      // Détecter les missions qui viennent d'être complétées
      updatedMissions.forEach((m, index) => {
        const prevMission = prev.missions[index];
        if (m.current >= m.target && prevMission.current < prevMission.target) {
          setCompletedMissions((prevCompleted) => {
            if (prevCompleted.find((cm) => cm.id === m.id && cm.date === prev.date)) {
              return prevCompleted;
            }
            return [
              ...prevCompleted,
              {
                id: m.id,
                title: m.title,
                reward: m.reward,
                emoji: m.emoji,
                date: prev.date,
              },
            ];
          });
        }
      });

      return {
        ...prev,
        missions: updatedMissions,
      };
    });
  };

  const addPoints = (amount) => {
    // XP : ne diminue jamais, sert aux niveaux et badges
    setXp((prevXp) => {
      const newXp = prevXp + amount;

      const thresholds = {
        1: 0,
        2: 150,
        3: 300,
        4: 500,
        5: 1000,
        6: 2000,
        7: 3000,
        8: 5000,
        9: 7500,
        10: 10000,
        11: 12000,
        12: 14000,
        13: 16000,
        14: 18000,
        15: 20000,
        16: 23000,
        17: 26000,
        18: 29000,
        19: 32000,
        20: 35000,
      };

      const getLevelFromXp = (xpValue) => {
        let lvl = 1;
        for (let i = 1; i <= 20; i++) {
          if (xpValue >= thresholds[i]) {
            lvl = i;
          }
        }
        return lvl;
      };

      const oldBadge = BADGES.filter((b) => b.points <= prevXp).pop();
      const newBadge = BADGES.filter((b) => b.points <= newXp).pop();

      const oldLevel = getLevelFromXp(prevXp);
      const newLevel = getLevelFromXp(newXp);

      if (newBadge && newBadge.id !== oldBadge?.id) {
        celebrate(`🎉 Nouveau badge : ${newBadge.nom} ! 🎉`);
      } else if (newLevel > oldLevel) {
        celebrate(`🌟 Niveau ${newLevel} atteint ! 🌟`);
      } else {
        celebrate(`+${amount} XP ! ⭐`);
      }

      return newXp;
    });

    // Étoiles : monnaie qui peut augmenter ou diminuer
    setPoints((prevPoints) => prevPoints + amount);

    setLastPointsGain(amount);
    setShowPointsPop(true);
    setTimeout(() => setShowPointsPop(false), 1200);

    // Missions générales
    updateMissionProgress("questions", 1);
    updateMissionProgress("earn-points", amount);

    // Missions par matière
    if (matiere === "maths") {
      updateMissionProgress("maths", 1);
    }
    if (matiere === "francais" || matiere === "dictee") {
      updateMissionProgress("francais", 1);
    }
    if (matiere === "sciences") {
      updateMissionProgress("sciences", 1);
    }
    if (matiere === "histoire" || matiere === "geographie") {
      updateMissionProgress("histoire", 1);
    }
    if (matiere === "anglais") {
      updateMissionProgress("anglais", 1);
    }
  };

  const getCurrentBadge = () => BADGES.filter((b) => b.points <= xp).pop() || BADGES[0];
  const getNextBadge = () => BADGES.find((b) => b.points > xp);

  const getLevel = () => {
    const thresholds = {
      1: 0,
      2: 150,
      3: 300,
      4: 500,
      5: 1000,
      6: 2000,
      7: 3000,
      8: 5000,
      9: 7500,
      10: 10000,
      11: 12000,
      12: 14000,
      13: 16000,
      14: 18000,
      15: 20000,
      16: 23000,
      17: 26000,
      18: 29000,
      19: 32000,
      20: 35000,
    };
    let lvl = 1;
    for (let i = 1; i <= 20; i++) {
      if (xp >= thresholds[i]) {
        lvl = i;
      }
    }
    return lvl;
  };

  const getNextLevelPoints = () => {
    const level = getLevel();
    if (level >= 20) return null;
    const thresholds = {
      1: 0,
      2: 150,
      3: 300,
      4: 500,
      5: 1000,
      6: 2000,
      7: 3000,
      8: 5000,
      9: 7500,
      10: 10000,
      11: 12000,
      12: 14000,
      13: 16000,
      14: 18000,
      15: 20000,
      16: 23000,
      17: 26000,
      18: 29000,
      19: 32000,
      20: 35000,
    };
    return thresholds[level + 1] ?? null;
  };


  const handleUnlock = (type, item) => {
    if (points >= item.cost) {
      if (type === "avatar") {
        setUnlockedAvatars([...unlockedAvatars, item.id]);
        setSelectedAvatar(item.emoji);
      } else {
        setUnlockedColors([...unlockedColors, item.id]);
        setSelectedColor(item.color);
      }
      celebrate(`${item.nom} débloqué ! 🎉`);
    } else {
      alert(`Il te manque ${item.cost - points} étoiles !`);
    }
  };

  const handleGameWin = () => {
    addPoints(20);
    updateMissionProgress("mini-jeux", 1);
    setActiveGame(null);
  };

  const handleStartGame = (gameId) => {
    const game = MINI_GAMES.find((g) => g.id === gameId);
    const requiredLevel = game?.levelRequired || 1;
    const currentLevel = getLevel();

    if (currentLevel < requiredLevel) {
      celebrate(`Ce mini-jeu se débloque au niveau ${requiredLevel}. Tu es actuellement niveau ${currentLevel}. 💪`);
      return;
    }

    if (points < 10) {
      celebrate("Tu n'as pas assez d'étoiles pour jouer. Il faut 10 étoiles par partie. ⭐");
      return;
    }

    setPoints((prev) => prev - 10);
    setActiveGame(gameId);
  };

  useEffect(() => {
    if (matiere && themeSelectionne && messages.length === 0) {
      const themeName = THEMES_PAR_MATIERE[matiere]?.find((t) => t.id === themeSelectionne)?.nom || "";
      const welcomeMsg = {
        role: "assistant",
        content: `Bonjour ! 👋 Je suis ton professeur pour ${MATIERES.find((m) => m.id === matiere)?.nom}${
          themeName ? ` - ${themeName}` : ""
        } !

🔥 Ta série : ${streak} jours
⭐ Tes étoiles : ${points}

Commençons ! 😊`,
        showButtons: true,
      };
      setMessages([welcomeMsg]);
    }
  }, [matiere, themeSelectionne]);

  const handleQuickAction = (action) => {
    if (action === "quiz") {
      cameraInputRef.current?.click();
    } else if (action === "question") {
      document.querySelector('input[type="text"]')?.focus();
    } else if (action === "aide") {
      const helpMsg = { role: "user", content: "J'ai besoin d'aide pour réviser" };
      setMessages((prev) => [...prev, helpMsg]);
      getAssistantResponse("J'ai besoin d'aide pour réviser", false);
    } else if (action === "exercice") {
      const exerciseMsg = { role: "user", content: "Peux-tu me donner des exercices ?" };
      setMessages((prev) => [...prev, exerciseMsg]);
      getAssistantResponse("Peux-tu me donner des exercices ?", false);
    } else if (action === "minigames") {
      setShowMiniGames(true);
    }
  };

  const getAssistantResponse = async (userText, isPhotoMessage = false) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("message", userText);
      formData.append("matiere", matiere);
      formData.append("theme", themeSelectionne || "");
      formData.append("quizMode", quizMode.toString());
      formData.append("quizCount", quizCount.toString());

      const recentHistory = messages.slice(-6);
      formData.append("history", JSON.stringify(recentHistory));

      if (photo && isPhotoMessage) {
        formData.append("photo", photo);
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = { role: "assistant", content: data.response };
        setMessages((prev) => [...prev, assistantMessage]);

        if (data.gainPoints) {
          addPoints(data.gainPoints);
          if (quizMode) setCorrectAnswers((prev) => prev + 1);
        }

        if (data.startQuiz) {
          setQuizMode(true);
          setQuizCount(1);
          setCorrectAnswers(0);
          updateMissionProgress("quiz", 1);
        }

        if (quizMode && quizCount < 10) {
          setQuizCount((prev) => prev + 1);
        } else if (quizMode && quizCount >= 10) {
          setQuizMode(false);
          setQuizCount(0);
          const bonus = correctAnswers * 5;
          setTimeout(() => {
            const finalMsg = {
              role: "assistant",
              content: `🎉 Quiz terminé ! Tu as eu ${correctAnswers}/10 bonnes réponses !

⭐ Bonus : +${bonus} étoiles !

Bravo pour ton travail ! 💪`,
            };
            setMessages((prev) => [...prev, finalMsg]);
            addPoints(bonus);
          }, 1000);
        }
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.error || "Oups ! 😅 Une erreur. Réessaye !" }]);
      }

      if (isPhotoMessage) removePhoto();
    } catch (error) {
      console.error("Erreur:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Oups ! 😅 Une erreur est survenue." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !photo) return;
    if (!matiere) {
      alert("Choisis d'abord une matière ! 😊");
      return;
    }

    const userMessage = {
      role: "user",
      content: photo ? input || "Voici mon cahier, pose-moi des questions !" : input,
      hasPhoto: !!photo,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    await getAssistantResponse(userMessage.content, !!photo);
  };

  const resetChat = () => {
    setMessages([]);
    setMatiere("");
    setThemeSelectionne("");
    setInput("");
    removePhoto();
    setQuizMode(false);
    setQuizCount(0);
    setCorrectAnswers(0);
  };

  const currentBadge = getCurrentBadge();
  const nextBadge = getNextBadge();

  // ==================== RENDER: Subject Selection ====================
  if (!matiere) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 mt-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-10 h-10 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-800">Prof IA CM1</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <button
                onClick={() => setShowAvatar(true)}
                className={`w-14 h-14 ${selectedColor} rounded-full flex items-center justify-center text-2xl shadow-md hover:scale-105 transition-transform`}
              >
                {selectedAvatar}
              </button>

              <div className="flex-1 max-w-xs mx-4">
                <LevelProgress points={points} currentBadge={currentBadge} nextBadge={nextBadge} />
              </div>

              <div className="flex gap-2">
                <StreakDisplay streak={streak} lastVisit={lastVisit} />
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-2 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold">{points}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowMissions(true)} className="flex-1 bg-purple-100 hover:bg-purple-200 rounded-xl p-3 transition-colors">
                <Target className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                <span className="text-xs font-semibold block">Missions</span>
              </button>
              <button onClick={() => setShowBadges(true)} className="flex-1 bg-yellow-100 hover:bg-yellow-200 rounded-xl p-3 transition-colors">
                <Trophy className="w-5 h-5 mx-auto text-yellow-600 mb-1" />
                <span className="text-xs font-semibold block">Badges</span>
              </button>
              <button onClick={() => setShowMiniGames(true)} className="flex-1 bg-green-100 hover:bg-green-200 rounded-xl p-3 transition-colors">
                <Gamepad2 className="w-5 h-5 mx-auto text-green-600 mb-1" />
                <span className="text-xs font-semibold block">Jeux</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Quelle matière veux-tu réviser ? 📚</h2>

            <div className="grid grid-cols-2 gap-3">
              {MATIERES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMatiere(m.id)}
                  className={`${m.color} hover:opacity-90 text-white rounded-2xl p-5 transition-all transform active:scale-95 shadow-lg`}
                >
                  <div className="text-3xl mb-2">{m.emoji}</div>
                  <div className="text-lg font-bold">{m.nom}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h3 className="font-bold text-base mb-3 text-gray-800">💡 Comment ça marche ?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                📸 <strong>Montre ton cahier</strong> → Quiz de 10 questions !
              </li>
              <li>
                🎮 <strong>Mini-jeux</strong> → Apprends en t'amusant
              </li>
              <li>⭐ Gagne des étoiles à chaque bonne réponse</li>
              <li>🏆 Débloque des badges et personnalise ton avatar !</li>
            </ul>
          </div>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-8 animate-bounce">
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <p className="text-xl font-bold text-center">{celebrationText}</p>
            </div>
          </div>
        )}

        {showMissions && <DailyMissionsPanel missions={dailyMissions.missions} completedMissions={completedMissions} onClose={() => setShowMissions(false)} />}
        {showBadges && <BadgesPanel points={points} onClose={() => setShowBadges(false)} />}
        {showAvatar && (
          <AvatarSelector
            selectedAvatar={selectedAvatar}
            selectedColor={selectedColor}
            unlockedAvatars={unlockedAvatars}
            unlockedColors={unlockedColors}
            points={points}
            showPointsPop={showPointsPop}
            lastPointsGain={lastPointsGain}
            onSelectAvatar={setSelectedAvatar}
            onSelectColor={setSelectedColor}
            onUnlock={handleUnlock}
            onClose={() => setShowAvatar(false)}
          />
        )}
        {showMiniGames && (
          <MiniGamesPanel
            onClose={() => setShowMiniGames(false)}
            level={getLevel()}
            points={points}
            onSelectGame={(gameId) => {
              setShowMiniGames(false);
              handleStartGame(gameId);
            }}
          />
        )}
        
      {showPinPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-xs w-full">
            <h2 className="text-lg font-bold mb-3 text-center">🔒 Accès protégé</h2>
            <p className="text-sm text-gray-600 mb-4 text-center">Entre le code secret pour débloquer le menu :</p>
            <input
              type="password"
              value={pinValue}
              onChange={(e) => setPinValue(e.target.value)}
              placeholder="Code à 5 chiffres"
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-center text-lg tracking-[8px]"
              maxLength={5}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  if (pinValue === MASTER_PIN) {
                    setShowPinPopup(false);
                    setPinValue("");
                    setShowCodePanel(true);
                  } else {
                    alert("⛔ Code incorrect !");
                  }
                }}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl text-sm font-semibold"
              >
                OK
              </button>
              <button
                onClick={() => {
                  setShowPinPopup(false);
                  setPinValue("");
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-xl text-sm font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
{showCodePanel && (
          <CodePanel
            onClose={() => setShowCodePanel(false)}
            onAddPoints={(amount) => setPoints((p) => p + amount)}
            onRemovePoints={(amount) => setPoints((p) => Math.max(0, p - amount))}
          />
        )}
        {activeGame === "calcul-mental" && (
          <CalculMentalGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}
        {activeGame === "pendu" && (
          <PenduGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}
        {activeGame === "vrai-faux" && (
          <VraiFauxGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}
        {activeGame === "quiz-rapide" && (
          <VraiFauxGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
            title="Quiz Rapide"
          />
        )}
        {activeGame === "comparaison-maths" && (
          <MathCompareGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}
        {activeGame === "francais-verbe" && (
          <FrenchVerbGame
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}
        {activeGame === "anglais-memory" && (
          <EnglishMemoryGame
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}
      </div>
    );
  }

  // ==================== RENDER: Theme Selection ====================
  if (matiere && !themeSelectionne) {
    const currentMatiere = MATIERES.find((m) => m.id === matiere);
    const themes = THEMES_PAR_MATIERE[matiere] || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className={`${currentMatiere.color} text-white shadow-lg`}>
          <div className="max-w-4xl mx-auto p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">{currentMatiere.emoji}</span>
              <div>
                <h1 className="text-base sm:text-xl font-bold">{currentMatiere.nom}</h1>
                <p className="text-xs sm:text-sm opacity-90">CM1 • Programme officiel</p>
              </div>
            </div>
            <button onClick={resetChat} className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors">
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">Quel thème veux-tu réviser ? 📚</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setThemeSelectionne(theme.id)}
                className={`${currentMatiere.color} hover:opacity-90 text-white rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-md`}
              >
                <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{theme.emoji}</div>
                <div className="text-xs sm:text-sm font-semibold leading-tight">{theme.nom}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setThemeSelectionne("general")}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-xl p-3 sm:p-4 transition-colors text-sm sm:text-base"
          >
            ✨ Question libre
          </button>
        </div>
      </div>
    );
  }

  // ==================== RENDER: Chat View ====================
  const currentMatiere = MATIERES.find((m) => m.id === matiere);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-32 sm:pb-40">
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-bounce">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <p className="text-xl font-bold text-center">{celebrationText}</p>
          </div>
        </div>
      )}

      {showBadges && <BadgesPanel points={points} onClose={() => setShowBadges(false)} />}
      {showMissions && <DailyMissionsPanel missions={dailyMissions.missions} completedMissions={completedMissions} onClose={() => setShowMissions(false)} />}
      {showMiniGames && (
        <MiniGamesPanel
          onClose={() => setShowMiniGames(false)}
          onSelectGame={(gameId) => {
            setShowMiniGames(false);
            setActiveGame(gameId);
          }}
        />
      )}
      {showDrawing && (
        <DrawingCanvas
          onClose={() => setShowDrawing(false)}
          onValidate={() => {
            addPoints(10);
            updateMissionProgress("arts", 1);
            // Ajoute une note pour le dessin dans le chat
            const note = 8 + Math.floor(Math.random() * 3); // 8, 9 ou 10
            const feedbackMessage = {
              role: "assistant",
              content: `🎨 Bravo pour ton dessin en palette graphique ! Je te donne la note de ${note}/10 pour ton travail sur les couleurs. Continue comme ça !`,
            };
            setMessages((prev) => [...prev, feedbackMessage]);
            setShowDrawing(false);
          }}
        />
      )}
      {activeGame === "calcul-mental" && (
          <CalculMentalGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}
        {activeGame === "pendu" && (
          <PenduGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}
        {activeGame === "vrai-faux" && (
          <VraiFauxGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}
        {activeGame === "quiz-rapide" && (
          <VraiFauxGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
            title="Quiz Rapide"
          />
        )}
        {activeGame === "comparaison-maths" && (
          <MathCompareGame
            matiere={matiere}
            theme={themeSelectionne}
            onClose={() => setActiveGame(null)}
            onWin={handleGameWin}
          />
        )}

      <div className={`${currentMatiere.color} text-white shadow-lg sticky top-0 z-40`}>
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">{currentMatiere.emoji}</span>
              <div>
                <h1 className="text-sm sm:text-xl font-bold">{currentMatiere.nom}</h1>
                <p className="text-xs sm:text-sm opacity-90">
                  {themeSelectionne && themeSelectionne !== "general"
                    ? THEMES_PAR_MATIERE[matiere]?.find((t) => t.id === themeSelectionne)?.nom
                    : "CM1"}
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => setShowMissions(true)} className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button onClick={() => setShowMiniGames(true)} className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button onClick={() => setShowPinPopup(true)} className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors">
                <KeyRound className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {matiere === "arts-plastiques" && themeSelectionne === "palette-graphique" && (
                <button
                  onClick={() => setShowDrawing(true)}
                  className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors"
                >
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <button onClick={() => setShowBadges(true)} className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 sm:px-3 py-1 rounded-full">
                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-bold text-xs sm:text-sm">Niv. {getLevel()}</span>
                  </div>
                  <div className="w-20 sm:w-24 h-1.5 bg-indigo-200 rounded-full overflow-hidden">
                    {(() => {
                      const target = getNextLevelPoints();
                      if (!target) {
                        return <div className="h-full w-full bg-indigo-500" />;
                      }
                      const percent = Math.min(100, Math.round((xp / target) * 100));
                      return <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }} />;
                    })()}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-2 sm:px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-bold text-xs sm:text-sm">{points}</span>
                </div>
              </div>
              <button onClick={resetChat} className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {quizMode && (
            <div className="bg-white/20 rounded-xl p-2 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold">🎯 Mode Quiz</span>
              <span className="text-xs sm:text-sm font-bold">Question {quizCount}/10</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                    msg.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow-md"
                  }`}
                >
                  {msg.hasPhoto && <div className="mb-2 text-xs sm:text-sm opacity-75">📸 Photo envoyée</div>}
                  <div className="whitespace-pre-wrap text-sm sm:text-base">{msg.content}</div>
                </div>
              </div>

              {msg.showButtons && (
                <div className="flex justify-start mt-3">
                  <div className="grid grid-cols-2 gap-2 max-w-[85%] sm:max-w-[80%]">
                    <button
                      onClick={() => handleQuickAction("quiz")}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-lg text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Camera className="w-5 h-5" />
                        <span className="font-bold text-sm sm:text-base">Quiz Photo</span>
                      </div>
                      <p className="text-xs opacity-90">Montre ton cahier</p>
                    </button>

                    <button
                      onClick={() => handleQuickAction("minigames")}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-lg text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Gamepad2 className="w-5 h-5" />
                        <span className="font-bold text-sm sm:text-base">Mini-Jeux</span>
                      </div>
                      <p className="text-xs opacity-90">Apprends en jouant</p>
                    </button>

                    <button
                      onClick={() => handleQuickAction("aide")}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-lg text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-bold text-sm sm:text-base">Besoin d'aide</span>
                      </div>
                      <p className="text-xs opacity-90">Réviser une leçon</p>
                    </button>

                    <button
                      onClick={() => handleQuickAction("exercice")}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-lg text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-5 h-5" />
                        <span className="font-bold text-sm sm:text-base">Exercices</span>
                      </div>
                      <p className="text-xs opacity-90">S'entraîner</p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-purple-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          {photoPreview && (
            <div className="mb-2 sm:mb-3 relative inline-block">
              <img src={photoPreview} alt="Aperçu" className="h-16 sm:h-20 rounded-lg shadow-md" />
              <button
                onClick={removePhoto}
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />

            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-2 sm:p-3 transition-colors flex-shrink-0"
              title="Prendre une photo"
            >
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-xl p-2 sm:p-3 transition-colors flex-shrink-0"
              title="Choisir une photo"
            >
              <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ta question... 🤔"
              className="flex-1 border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
              disabled={loading}
            />

            <button
              onClick={handleSendMessage}
              disabled={loading || (!input.trim() && !photo)}
              className={`${currentMatiere.color} text-white rounded-xl px-4 sm:px-6 py-2 sm:py-3 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0`}
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
