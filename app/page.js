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
  Brain,
  User,
  Palette,
  PenTool,
  Download,
  Calculator,
  KeyRound,
} from "lucide-react";

import useLocalStorage from "./hooks/useLocalStorage";
import { MATIERES, THEMES_PAR_MATIERE, BADGES, AVATARS, AVATAR_COLORS, MINI_GAMES, MINI_GAMES_BY_THEME } from "./constants/gameData";

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
