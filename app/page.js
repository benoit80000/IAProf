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
      { id: "quiz-1", title: "Termine un quiz photo", target: 1, current: 0, reward: 25, type: "quiz", emoji: "📸" },
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

const DailyMissionsPanel = ({ missions, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold">Missions du Jour</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

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
                <ProgressBar current={mission.current} target={mission.target} color={completed ? "bg-green-500" : "bg-blue-500"} />
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

const CalculMentalGame = ({ onClose, onWin }) => {
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

const MiniGamesPanel = ({ onClose, onSelectGame }) => {
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

        <div className="space-y-3">
          {MINI_GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              disabled={game.id !== "calcul-mental"}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                game.id === "calcul-mental"
                  ? "border-gray-200 hover:border-purple-400 hover:bg-purple-50"
                  : "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="text-4xl">{game.emoji}</div>
              <div>
                <h3 className="font-bold text-lg">{game.nom}</h3>
                <p className="text-sm text-gray-600">{game.desc}</p>
                {game.id !== "calcul-mental" && <p className="text-xs text-orange-500 mt-1">🔜 Bientôt disponible</p>}
              </div>
            </button>
          ))}
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
  const [streak, setStreak] = useLocalStorage("profai-streak", 0);
  const [lastVisit, setLastVisit] = useLocalStorage("profai-lastVisit", "");
  const [dailyMissions, setDailyMissions] = useLocalStorage("profai-missions", generateDailyMissions());
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
    setDailyMissions((prev) => ({
      ...prev,
      missions: prev.missions.map((m) => (m.type === type ? { ...m, current: Math.min(m.current + amount, m.target) } : m)),
    }));
  };

  const addPoints = (amount) => {
    setPoints((prevPoints) => {
      const newPoints = prevPoints + amount;
      const oldBadge = BADGES.filter((b) => b.points <= prevPoints).pop();
      const newBadge = BADGES.filter((b) => b.points <= newPoints).pop();

      if (newBadge && newBadge.id !== oldBadge?.id) {
        celebrate(`🎉 Nouveau badge : ${newBadge.nom} ! 🎉`);
      } else {
        celebrate(`+${amount} étoiles ! ⭐`);
      }

      return newPoints;
    });

    setLastPointsGain(amount);
    setShowPointsPop(true);
    setTimeout(() => setShowPointsPop(false), 1200);

    updateMissionProgress("questions", 1);
    if (matiere === "maths") {
      updateMissionProgress("maths", 1);
    }
  };

  const getCurrentBadge = () => BADGES.filter((b) => b.points <= points).pop() || BADGES[0];
  const getNextBadge = () => BADGES.find((b) => b.points > points);

  const handleUnlock = (type, item) => {
    if (points >= item.cost) {
      setPoints(points - item.cost);
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

  const handleGameWin = (earnedPoints) => {
    addPoints(earnedPoints);
    setActiveGame(null);
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

        {showMissions && <DailyMissionsPanel missions={dailyMissions.missions} onClose={() => setShowMissions(false)} />}
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
            onSelectGame={(gameId) => {
              setShowMiniGames(false);
              setActiveGame(gameId);
            }}
          />
        )}
        {activeGame === "calcul-mental" && <CalculMentalGame onClose={() => setActiveGame(null)} onWin={handleGameWin} />}
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
      {showMissions && <DailyMissionsPanel missions={dailyMissions.missions} onClose={() => setShowMissions(false)} />}
      {showMiniGames && (
        <MiniGamesPanel
          onClose={() => setShowMiniGames(false)}
          onSelectGame={(gameId) => {
            setShowMiniGames(false);
            setActiveGame(gameId);
          }}
        />
      )}
      {activeGame === "calcul-mental" && <CalculMentalGame onClose={() => setActiveGame(null)} onWin={handleGameWin} />}

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
              <button onClick={() => setShowBadges(true)} className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-2 sm:px-3 py-1 rounded-full">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-bold text-xs sm:text-sm">{points}</span>
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
