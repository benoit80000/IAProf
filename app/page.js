'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Camera, Send, Trash2, Loader, Upload, Star, Trophy, Award, Target, Zap, Crown, Sparkles, Medal, X } from 'lucide-react';

const MATIERES = [
  { id: 'maths', nom: 'Mathématiques', emoji: '🔢', color: 'bg-blue-500' },
  { id: 'francais', nom: 'Français', emoji: '📝', color: 'bg-purple-500' },
  { id: 'sciences', nom: 'Sciences', emoji: '🔬', color: 'bg-green-500' },
  { id: 'histoire', nom: 'Histoire-Géo', emoji: '🌍', color: 'bg-orange-500' },
  { id: 'emc', nom: 'EMC', emoji: '🤝', color: 'bg-pink-500' }
];

const THEMES_PAR_MATIERE = {
  maths: [
    { id: 'fractions', nom: 'Les fractions', emoji: '🍕' },
    { id: 'grands-nombres', nom: 'Grands nombres', emoji: '🔢' },
    { id: 'additions', nom: 'Additions', emoji: '➕' },
    { id: 'multiplications', nom: 'Multiplications', emoji: '✖️' },
    { id: 'divisions', nom: 'Divisions', emoji: '➗' },
    { id: 'geometrie', nom: 'Géométrie', emoji: '📐' },
    { id: 'mesures', nom: 'Mesures', emoji: '📏' },
    { id: 'problemes', nom: 'Problèmes', emoji: '🧩' }
  ],
  francais: [
    { id: 'conjugaison', nom: 'Conjugaison', emoji: '⏰' },
    { id: 'grammaire', nom: 'Grammaire', emoji: '📖' },
    { id: 'orthographe', nom: 'Orthographe', emoji: '✍️' },
    { id: 'vocabulaire', nom: 'Vocabulaire', emoji: '📚' },
    { id: 'lecture', nom: 'Lecture', emoji: '📰' },
    { id: 'redaction', nom: 'Rédaction', emoji: '📝' },
    { id: 'cod-coi', nom: 'COD/COI', emoji: '🎯' },
    { id: 'types-phrases', nom: 'Types phrases', emoji: '❓' }
  ],
  sciences: [
    { id: 'corps-humain', nom: 'Corps humain', emoji: '🧍' },
    { id: 'digestion', nom: 'Digestion', emoji: '🍎' },
    { id: 'respiration', nom: 'Respiration', emoji: '💨' },
    { id: 'plantes', nom: 'Plantes', emoji: '🌱' },
    { id: 'animaux', nom: 'Animaux', emoji: '🦋' },
    { id: 'environnement', nom: 'Environnement', emoji: '🌍' },
    { id: 'energie', nom: 'Énergie', emoji: '⚡' },
    { id: 'eau', nom: 'L\'eau', emoji: '💧' }
  ],
  histoire: [
    { id: 'prehistoire', nom: 'Préhistoire', emoji: '🦴' },
    { id: 'antiquite', nom: 'Antiquité', emoji: '🏛️' },
    { id: 'moyen-age', nom: 'Moyen Âge', emoji: '🏰' },
    { id: 'temps-modernes', nom: 'Temps modernes', emoji: '⚓' },
    { id: 'france-geo', nom: 'Géo France', emoji: '🗺️' },
    { id: 'regions', nom: 'Régions', emoji: '🇫🇷' },
    { id: 'relief', nom: 'Relief', emoji: '⛰️' },
    { id: 'villes', nom: 'Grandes villes', emoji: '🏙️' }
  ],
  emc: [
    { id: 'respect', nom: 'Respect', emoji: '🤝' },
    { id: 'vivre-ensemble', nom: 'Vivre ensemble', emoji: '👥' },
    { id: 'regles', nom: 'Règles de vie', emoji: '📋' },
    { id: 'droits', nom: 'Droits/Devoirs', emoji: '⚖️' },
    { id: 'egalite', nom: 'Égalité', emoji: '🟰' },
    { id: 'environnement', nom: 'Environnement', emoji: '♻️' },
    { id: 'solidarite', nom: 'Solidarité', emoji: '💚' },
    { id: 'citoyennete', nom: 'Citoyenneté', emoji: '🗳️' }
  ]
};

const BADGES = [
  { id: 'debutant', nom: 'Débutant', icon: Star, points: 0, color: 'text-gray-400', desc: 'Commence l\'aventure !' },
  { id: 'apprenti', nom: 'Apprenti', icon: Target, points: 50, color: 'text-blue-500', desc: '50 points' },
  { id: 'bon-eleve', nom: 'Bon élève', icon: Award, points: 100, color: 'text-green-500', desc: '100 points' },
  { id: 'expert', nom: 'Expert', icon: Zap, points: 200, color: 'text-yellow-500', desc: '200 points' },
  { id: 'champion', nom: 'Champion', icon: Trophy, points: 300, color: 'text-orange-500', desc: '300 points' },
  { id: 'maitre', nom: 'Maître', icon: Crown, points: 500, color: 'text-purple-500', desc: '500 points' },
  { id: 'legende', nom: 'Légende', icon: Medal, points: 1000, color: 'text-pink-500', desc: '1000 points' }
];

export default function ProfIA() {
  const [matiere, setMatiere] = useState('');
  const [themeSelectionne, setThemeSelectionne] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [points, setPoints] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState('');
  const [showBadges, setShowBadges] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizCount, setQuizCount] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const celebrate = (text = '') => {
    setCelebrationText(text);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const addPoints = (amount) => {
    const newPoints = points + amount;
    const oldBadge = BADGES.filter(b => b.points <= points).pop();
    const newBadge = BADGES.filter(b => b.points <= newPoints).pop();
    
    setPoints(newPoints);
    
    if (newBadge && newBadge.id !== oldBadge?.id) {
      celebrate(`🎉 Nouveau badge : ${newBadge.nom} ! 🎉`);
    } else {
      celebrate(`+${amount} étoiles ! ⭐`);
    }
  };

  const getCurrentBadge = () => {
    return BADGES.filter(b => b.points <= points).pop() || BADGES[0];
  };

  const getNextBadge = () => {
    return BADGES.find(b => b.points > points);
  };

  useEffect(() => {
    if (matiere && themeSelectionne && messages.length === 0) {
      const themeName = THEMES_PAR_MATIERE[matiere]?.find(t => t.id === themeSelectionne)?.nom || '';
      const welcomeMsg = {
        role: 'assistant',
        content: `Bonjour ! 👋 Je suis ton professeur pour ${MATIERES.find(m => m.id === matiere)?.nom}${themeName ? ` - ${themeName}` : ''} !\n\nGagne des étoiles ⭐ et débloque des badges 🏆 !\n\nCommençons ! 😊`,
        showButtons: true
      };
      setMessages([welcomeMsg]);
    }
  }, [matiere, themeSelectionne]);

  const handleQuickAction = (action) => {
    if (action === 'quiz') {
      cameraInputRef.current?.click();
    } else if (action === 'question') {
      document.querySelector('input[type="text"]')?.focus();
    } else if (action === 'aide') {
      const helpMsg = {
        role: 'user',
        content: "J'ai besoin d'aide pour réviser"
      };
      setMessages(prev => [...prev, helpMsg]);
      getAssistantResponse("J'ai besoin d'aide pour réviser", false);
    } else if (action === 'exercice') {
      const exerciseMsg = {
        role: 'user',
        content: "Peux-tu me donner des exercices ?"
      };
      setMessages(prev => [...prev, exerciseMsg]);
      getAssistantResponse("Peux-tu me donner des exercices ?", false);
    }
  };

  const getAssistantResponse = async (userText, isPhotoMessage = false) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('message', userText);
      formData.append('matiere', matiere);
      formData.append('theme', themeSelectionne || '');
      formData.append('quizMode', quizMode.toString());
      formData.append('quizCount', quizCount.toString());
      
      const recentHistory = messages.slice(-6);
      formData.append('history', JSON.stringify(recentHistory));
      
      if (photo && isPhotoMessage) {
        formData.append('photo', photo);
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.response
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        if (data.gainPoints) {
          addPoints(data.gainPoints);
          if (quizMode) {
            setCorrectAnswers(prev => prev + 1);
          }
        }

        if (data.startQuiz) {
          setQuizMode(true);
          setQuizCount(1);
          setCorrectAnswers(0);
        }

        if (quizMode && quizCount < 10) {
          setQuizCount(prev => prev + 1);
        } else if (quizMode && quizCount >= 10) {
          setQuizMode(false);
          setQuizCount(0);
          const bonus = correctAnswers * 5;
          setTimeout(() => {
            const finalMsg = {
              role: 'assistant',
              content: `🎉 Quiz terminé ! Tu as eu ${correctAnswers}/10 bonnes réponses !\n\n⭐ Bonus : +${bonus} étoiles !\n\nBravo pour ton travail ! Continue comme ça ! 💪`
            };
            setMessages(prev => [...prev, finalMsg]);
            addPoints(bonus);
          }, 1000);
        }
      } else {
        const errorMessage = {
          role: 'assistant',
          content: data.error || 'Oups ! 😅 Une erreur est survenue. Réessaye !'
        };
        setMessages(prev => [...prev, errorMessage]);
      }

      if (isPhotoMessage) {
        removePhoto();
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Oups ! 😅 Une erreur est survenue. Réessaye !'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !photo) return;
    if (!matiere) {
      alert('Choisis d\'abord une matière ! 😊');
      return;
    }

    const userMessage = {
      role: 'user',
      content: photo ? (input || "Voici mon cahier, pose-moi des questions !") : input,
      hasPhoto: !!photo
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    await getAssistantResponse(userMessage.content, !!photo);
  };

  const resetChat = () => {
    setMessages([]);
    setMatiere('');
    setThemeSelectionne('');
    setInput('');
    removePhoto();
    setQuizMode(false);
    setQuizCount(0);
    setCorrectAnswers(0);
  };

  if (!matiere) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 mt-4 sm:mt-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Prof IA CM1</h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600">
              Ton professeur virtuel pour réviser ! 📚
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-lg">{points}</span>
                </div>
                <button
                  onClick={() => setShowBadges(true)}
                  className="flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full hover:bg-purple-200 transition-colors"
                >
                  <Trophy className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-sm">Badges</span>
                </button>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
              Quelle matière veux-tu réviser ? 📚
            </h2>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {MATIERES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMatiere(m.id)}
                  className={`${m.color} hover:opacity-90 text-white rounded-2xl p-4 sm:p-6 transition-all transform active:scale-95 shadow-lg`}
                >
                  <div className="text-3xl sm:text-4xl mb-2">{m.emoji}</div>
                  <div className="text-sm sm:text-xl font-bold">{m.nom}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="font-bold text-base sm:text-lg mb-3 text-gray-800">
              💡 Comment ça marche ?
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
              <li>📸 <strong>Montre ton cahier</strong> → Quiz de 10 questions !</li>
              <li>✍️ Pose des questions libres</li>
              <li>⭐ Gagne des étoiles à chaque bonne réponse</li>
              <li>🏆 Débloque des badges prestigieux !</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (matiere && !themeSelectionne) {
    const currentMatiere = MATIERES.find(m => m.id === matiere);
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
            <button
              onClick={resetChat}
              className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">
            Quel thème veux-tu réviser ? 📚
          </h2>

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
            onClick={() => setThemeSelectionne('general')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-xl p-3 sm:p-4 transition-colors text-sm sm:text-base"
          >
            ✨ Question libre
          </button>
        </div>
      </div>
    );
  }

  const currentMatiere = MATIERES.find(m => m.id === matiere);
  const currentBadge = getCurrentBadge();
  const nextBadge = getNextBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-32 sm:pb-40">
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 animate-bounce">
            <Sparkles className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
            <p className="text-2xl font-bold text-center">{celebrationText}</p>
          </div>
        </div>
      )}

      {showBadges && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🏆 Tes Badges</h2>
              <button onClick={() => setShowBadges(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl">
              <p className="text-center text-lg font-semibold mb-2">Tu as {points} étoiles ⭐</p>
              {nextBadge && (
                <p className="text-center text-sm text-gray-600">
                  Plus que {nextBadge.points - points} étoiles pour débloquer <strong>{nextBadge.nom}</strong> !
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {BADGES.map((badge) => {
                const Icon = badge.icon;
                const unlocked = points >= badge.points;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      unlocked
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                    }`}
                  >
                    <Icon className={`w-12 h-12 mx-auto mb-2 ${unlocked ? badge.color : 'text-gray-300'}`} />
                    <h3 className="font-bold text-center mb-1">{badge.nom}</h3>
                    <p className="text-xs text-center text-gray-600">{badge.desc}</p>
                    {unlocked && <p className="text-center text-green-600 font-semibold mt-2">✓ Débloqué !</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className={`${currentMatiere.color} text-white shadow-lg sticky top-0 z-40`}>
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">{currentMatiere.emoji}</span>
              <div>
                <h1 className="text-sm sm:text-xl font-bold">{currentMatiere.nom}</h1>
                <p className="text-xs sm:text-sm opacity-90">
                  {themeSelectionne && themeSelectionne !== 'general' 
                    ? THEMES_PAR_MATIERE[matiere]?.find(t => t.id === themeSelectionne)?.nom
                    : 'CM1'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowBadges(true)}
                className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors"
              >
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-2 sm:px-3 py-1 rounded-full">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-bold text-xs sm:text-sm">{points}</span>
              </div>
              <button
                onClick={resetChat}
                className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors"
              >
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
              <div
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 shadow-md'
                  }`}
                >
                  {msg.hasPhoto && (
                    <div className="mb-2 text-xs sm:text-sm opacity-75">📸 Photo envoyée</div>
                  )}
                  <div className="whitespace-pre-wrap text-sm sm:text-base">{msg.content}</div>
                </div>
              </div>
              
              {msg.showButtons && (
                <div className="flex justify-start mt-3">
                  <div className="grid grid-cols-2 gap-2 max-w-[85%] sm:max-w-[80%]">
                    <button
                      onClick={() => handleQuickAction('quiz')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-lg text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Camera className="w-5 h-5" />
                        <span className="font-bold text-sm sm:text-base">Quiz Photo</span>
                      </div>
                      <p className="text-xs opacity-90">Montre ton cahier</p>
                    </button>
                    
                    <button
                      onClick={() => handleQuickAction('question')}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-lg text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Send className="w-5 h-5" />
                        <span className="font-bold text-sm sm:text-base">Question</span>
                      </div>
                      <p className="text-xs opacity-90">Pose ta question</p>
                    </button>
                    
                    <button
                      onClick={() => handleQuickAction('aide')}
                      className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-lg text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-bold text-sm sm:text-base">Besoin d'aide</span>
                      </div>
                      <p className="text-xs opacity-90">Réviser une leçon</p>
                    </button>
                    
                    <button
                      onClick={() => handleQuickAction('exercice')}
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
              <img
                src={photoPreview}
                alt="Aperçu"
                className="h-16 sm:h-20 rounded-lg shadow-md"
              />
              <button
                onClick={removePhoto}
                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
            
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
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
