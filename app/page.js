'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Camera, Send, Trash2, Loader, Mic, MicOff, X, Upload, Volume2, VolumeX, Star, Trophy, Sparkles } from 'lucide-react';

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

export default function ProfIA() {
  const [matiere, setMatiere] = useState('');
  const [themeSelectionne, setThemeSelectionne] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [points, setPoints] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const currentAudioRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const celebrate = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const addPoints = (amount) => {
    setPoints(prev => prev + amount);
    celebrate();
  };

  useEffect(() => {
    if (matiere && themeSelectionne && messages.length === 0) {
      const themeName = THEMES_PAR_MATIERE[matiere]?.find(t => t.id === themeSelectionne)?.nom || '';
      const welcomeMsg = {
        role: 'assistant',
        content: `Bonjour ! 👋 Je suis ton professeur pour ${MATIERES.find(m => m.id === matiere)?.nom}${themeName ? ` - ${themeName}` : ''} !\n\nTu gagnes des étoiles ⭐ quand tu réponds bien !\n\nTu peux :\n🎤 Me parler directement\n📸 Me montrer ton cahier\n✍️ Écrire ta question\n\nCommençons ! 😊`
      };
      setMessages([welcomeMsg]);
      if (autoSpeak) {
        speakText(welcomeMsg.content);
      }
    }
  }, [matiere, themeSelectionne]);

  const speakText = async (text) => {
    if (!autoSpeak || !text) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(true);

    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          if (autoSpeak) {
            setTimeout(() => startListening(), 500);
          }
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          speakWithWebAPI(text);
        };
        await audio.play();
      } else {
        speakWithWebAPI(text);
      }
    } catch (error) {
      console.error('Erreur TTS:', error);
      speakWithWebAPI(text);
    }
  };

  const speakWithWebAPI = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.onend = () => {
      setIsSpeaking(false);
      if (autoSpeak) {
        setTimeout(() => startListening(), 500);
      }
    };
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startListening = async () => {
    if (isRecording || isListening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAndRespond(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsListening(true);
    } catch (error) {
      console.error('Erreur microphone:', error);
      alert('Impossible d\'accéder au microphone 🎤');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    }
  };

  const transcribeAndRespond = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success && data.text.trim()) {
        const userMessage = {
          role: 'user',
          content: data.text
        };
        setMessages(prev => [...prev, userMessage]);
        await getAssistantResponse(data.text);
      } else {
        if (autoSpeak && !loading) {
          setTimeout(() => startListening(), 500);
        }
      }
    } catch (error) {
      console.error('Erreur transcription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssistantResponse = async (userText) => {
    try {
      const formData = new FormData();
      formData.append('message', userText);
      formData.append('matiere', matiere);
      formData.append('theme', themeSelectionne || '');
      formData.append('history', JSON.stringify(messages));
      
      if (photo) {
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
        }
        
        if (autoSpeak) {
          await speakText(data.response);
        }
      }

      removePhoto();
    } catch (error) {
      console.error('Erreur:', error);
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
      content: input,
      hasPhoto: !!photo
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    await getAssistantResponse(input);
  };

  const resetChat = () => {
    stopSpeaking();
    stopListening();
    setMessages([]);
    setMatiere('');
    setThemeSelectionne('');
    setInput('');
    removePhoto();
  };

  const toggleAutoSpeak = () => {
    const newState = !autoSpeak;
    setAutoSpeak(newState);
    if (!newState) {
      stopSpeaking();
      stopListening();
    }
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
              Ton professeur vocal ! 🎤🔊
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8">
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

          <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h3 className="font-bold text-base sm:text-lg mb-3 text-gray-800">
              💡 Comment ça marche ?
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
              <li>🎤 Parle au professeur</li>
              <li>📚 Choisis ta matière et ton thème</li>
              <li>⭐ Gagne des points !</li>
              <li>📸 Montre ton cahier</li>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-32 sm:pb-40">
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-bounce">
            <Sparkles className="w-32 h-32 text-yellow-400" />
          </div>
        </div>
      )}

      <div className={`${currentMatiere.color} text-white shadow-lg sticky top-0 z-40`}>
        <div className="max-w-4xl mx-auto p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl">{currentMatiere.emoji}</span>
            <div>
              <h1 className="text-sm sm:text-xl font-bold">{currentMatiere.nom}</h1>
              <p className="text-xs sm:text-sm opacity-90">
                {themeSelectionne && themeSelectionne !== 'general' 
                  ? THEMES_PAR_MATIERE[matiere]?.find(t => t.id === themeSelectionne)?.nom
                  : 'Mode vocal'
                }
              </p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 bg-yellow-400 text-gray-800 px-2 sm:px-3 py-1 rounded-full">
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-bold text-xs sm:text-sm">{points}</span>
            </div>
            <button
              onClick={toggleAutoSpeak}
              className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors"
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button
              onClick={resetChat}
              className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
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

      {autoSpeak && (
        <div className="fixed top-20 sm:top-24 left-1/2 transform -translate-x-1/2 z-40">
          {isSpeaking && (
            <div className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-xs sm:text-base">Le prof parle...</span>
            </div>
          )}
          {isListening && !isSpeaking && (
            <div className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-xs sm:text-base">Je t'écoute...</span>
            </div>
          )}
        </div>
      )}

      {autoSpeak && (
        <div className="fixed bottom-28 sm:bottom-32 left-1/2 transform -translate-x-1/2 z-30">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking || loading}
            className={`${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-green-500 hover:bg-green-600'
            } text-white rounded-full p-6 sm:p-8 shadow-2xl transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 sm:w-12 sm:h-12" />
            ) : (
              <Mic className="w-8 h-8 sm:w-12 sm:h-12" />
            )}
          </button>
        </div>
      )}

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
