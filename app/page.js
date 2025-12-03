'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Camera, Send, Trash2, Loader, Mic, MicOff, X, Image as ImageIcon } from 'lucide-react';

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
    { id: 'grands-nombres', nom: 'Nombres jusqu\'à 1 million', emoji: '🔢' },
    { id: 'additions', nom: 'Additions et soustractions', emoji: '➕' },
    { id: 'multiplications', nom: 'Multiplications', emoji: '✖️' },
    { id: 'divisions', nom: 'Divisions', emoji: '➗' },
    { id: 'geometrie', nom: 'Géométrie', emoji: '📐' },
    { id: 'mesures', nom: 'Mesures et unités', emoji: '📏' },
    { id: 'problemes', nom: 'Résolution de problèmes', emoji: '🧩' }
  ],
  francais: [
    { id: 'conjugaison', nom: 'Conjugaison', emoji: '⏰' },
    { id: 'grammaire', nom: 'Grammaire', emoji: '📖' },
    { id: 'orthographe', nom: 'Orthographe', emoji: '✍️' },
    { id: 'vocabulaire', nom: 'Vocabulaire', emoji: '📚' },
    { id: 'lecture', nom: 'Lecture et compréhension', emoji: '📰' },
    { id: 'redaction', nom: 'Rédaction', emoji: '📝' },
    { id: 'cod-coi', nom: 'COD et COI', emoji: '🎯' },
    { id: 'types-phrases', nom: 'Types de phrases', emoji: '❓' }
  ],
  sciences: [
    { id: 'corps-humain', nom: 'Le corps humain', emoji: '🧍' },
    { id: 'digestion', nom: 'La digestion', emoji: '🍎' },
    { id: 'respiration', nom: 'La respiration', emoji: '💨' },
    { id: 'plantes', nom: 'Les plantes', emoji: '🌱' },
    { id: 'animaux', nom: 'Les animaux', emoji: '🦋' },
    { id: 'environnement', nom: 'L\'environnement', emoji: '🌍' },
    { id: 'energie', nom: 'L\'énergie', emoji: '⚡' },
    { id: 'eau', nom: 'L\'eau et ses états', emoji: '💧' }
  ],
  histoire: [
    { id: 'prehistoire', nom: 'La Préhistoire', emoji: '🦴' },
    { id: 'antiquite', nom: 'L\'Antiquité', emoji: '🏛️' },
    { id: 'moyen-age', nom: 'Le Moyen Âge', emoji: '🏰' },
    { id: 'temps-modernes', nom: 'Les Temps modernes', emoji: '⚓' },
    { id: 'france-geo', nom: 'La France (géographie)', emoji: '🗺️' },
    { id: 'regions', nom: 'Les régions françaises', emoji: '🇫🇷' },
    { id: 'relief', nom: 'Relief et paysages', emoji: '⛰️' },
    { id: 'villes', nom: 'Les grandes villes', emoji: '🏙️' }
  ],
  emc: [
    { id: 'respect', nom: 'Le respect', emoji: '🤝' },
    { id: 'vivre-ensemble', nom: 'Vivre ensemble', emoji: '👥' },
    { id: 'regles', nom: 'Les règles de vie', emoji: '📋' },
    { id: 'droits', nom: 'Droits et devoirs', emoji: '⚖️' },
    { id: 'egalite', nom: 'L\'égalité', emoji: '🟰' },
    { id: 'environnement', nom: 'Respect de l\'environnement', emoji: '♻️' },
    { id: 'solidarite', nom: 'La solidarité', emoji: '💚' },
    { id: 'citoyennete', nom: 'La citoyenneté', emoji: '🗳️' }
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
  const [showCamera, setShowCamera] = useState(false);
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (matiere && messages.length === 0) {
      const welcomeMsg = {
        role: 'assistant',
        content: `Bonjour ! 👋 Je suis ton professeur pour ${MATIERES.find(m => m.id === matiere)?.nom}.\n\n${themeSelectionne ? `Super ! On va travailler sur : ${THEMES_PAR_MATIERE[matiere]?.find(t => t.id === themeSelectionne)?.nom}\n\n` : ''}Tu peux :\n📸 Prendre une photo de ton cours\n🎤 Parler avec ta voix\n✍️ Écrire ta question\n\nComment veux-tu qu'on commence ? 😊`
      };
      setMessages([welcomeMsg]);
    }
  }, [matiere, themeSelectionne]);

  // Gestion de l'enregistrement vocal
  const startRecording = async () => {
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
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur microphone:', error);
      alert('Impossible d\'accéder au microphone 🎤');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.webm');
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setInput(data.text);
      }
    } catch (error) {
      console.error('Erreur transcription:', error);
      alert('Erreur lors de la transcription 😅');
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la caméra
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Erreur caméra:', error);
      alert('Impossible d\'accéder à la caméra 📸');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        setPhoto(blob);
        setPhotoPreview(canvas.toDataURL());
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
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
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', input);
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
      } else {
        const errorMessage = {
          role: 'assistant',
          content: data.error || 'Oups ! 😅 J\'ai eu un petit problème. Peux-tu réessayer s\'il te plaît ?'
        };
        setMessages(prev => [...prev, errorMessage]);
      }

      removePhoto();

    } catch (error) {
      console.error('Erreur:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Oups ! 😅 J\'ai eu un petit problème. Peux-tu réessayer s\'il te plaît ?'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setMatiere('');
    setThemeSelectionne('');
    setInput('');
    removePhoto();
  };

  // Page de sélection de matière
  if (!matiere) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 mt-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-12 h-12 text-purple-600" />
              <h1 className="text-4xl font-bold text-gray-800">Prof IA CM1</h1>
            </div>
            <p className="text-lg text-gray-600">
              Ton professeur virtuel pour réviser tes leçons ! 🎓
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
              Quelle matière veux-tu réviser aujourd'hui ? 📚
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MATIERES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMatiere(m.id)}
                  className={`${m.color} hover:opacity-90 text-white rounded-2xl p-6 transition-all transform hover:scale-105 shadow-lg`}
                >
                  <div className="text-4xl mb-2">{m.emoji}</div>
                  <div className="text-xl font-bold">{m.nom}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">
              💡 Comment ça marche ?
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>1️⃣ Choisis ta matière</li>
              <li>2️⃣ Sélectionne un thème (ou pose directement ta question)</li>
              <li>3️⃣ Utilise la voix 🎤, la caméra 📸 ou le clavier ⌨️</li>
              <li>4️⃣ Je t'explique simplement !</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Page de sélection de thème
  if (matiere && !themeSelectionne && messages.length === 0) {
    const currentMatiere = MATIERES.find(m => m.id === matiere);
    const themes = THEMES_PAR_MATIERE[matiere] || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className={`${currentMatiere.color} text-white shadow-lg`}>
          <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentMatiere.emoji}</span>
              <div>
                <h1 className="text-xl font-bold">{currentMatiere.nom}</h1>
                <p className="text-sm opacity-90">CM1 • Programme officiel</p>
              </div>
            </div>
            <button
              onClick={resetChat}
              className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Quel thème veux-tu réviser ? 📚
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setThemeSelectionne(theme.id)}
                className={`${currentMatiere.color} hover:opacity-90 text-white rounded-xl p-4 transition-all transform hover:scale-105 shadow-md`}
              >
                <div className="text-3xl mb-2">{theme.emoji}</div>
                <div className="text-sm font-semibold">{theme.nom}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setThemeSelectionne('general')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-xl p-4 transition-colors"
          >
            ✨ Poser une question libre
          </button>
        </div>
      </div>
    );
  }

  const currentMatiere = MATIERES.find(m => m.id === matiere);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className={`${currentMatiere.color} text-white shadow-lg`}>
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentMatiere.emoji}</span>
            <div>
              <h1 className="text-xl font-bold">Prof IA - {currentMatiere.nom}</h1>
              <p className="text-sm opacity-90">
                {themeSelectionne && themeSelectionne !== 'general' 
                  ? THEMES_PAR_MATIERE[matiere]?.find(t => t.id === themeSelectionne)?.nom
                  : 'CM1 • Programme officiel'
                }
              </p>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="bg-white/20 hover:bg-white/30 rounded-xl p-2 transition-colors"
            title="Changer de matière"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto p-4 pb-40">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                }`}
              >
                {msg.hasPhoto && (
                  <div className="mb-2 text-sm opacity-75">📸 Photo envoyée</div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-4 shadow-md">
                <Loader className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Modal Caméra */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">📸 Prends ton cours en photo</h3>
              <button onClick={stopCamera} className="text-red-500 hover:text-red-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg mb-4"
            />
            <button
              onClick={capturePhoto}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-4 font-bold"
            >
              📸 Capturer
            </button>
          </div>
        </div>
      )}

      {/* Input fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          {photoPreview && (
            <div className="mb-3 relative inline-block">
              <img
                src={photoPreview}
                alt="Aperçu"
                className="h-20 rounded-lg shadow-md"
              />
              <button
                onClick={removePhoto}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
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
            
            {/* Bouton Caméra */}
            <button
              onClick={startCamera}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-3 transition-colors"
              title="Prendre une photo"
            >
              <Camera className="w-6 h-6" />
            </button>

            {/* Bouton Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-xl p-3 transition-colors"
              title="Choisir une photo"
            >
              <ImageIcon className="w-6 h-6" />
            </button>

            {/* Bouton Micro */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-green-500 hover:bg-green-600'} text-white rounded-xl p-3 transition-colors`}
              title={isRecording ? "Arrêter l'enregistrement" : "Enregistrer ta voix"}
            >
              {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tape ta question ici... 🤔"
              className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
              disabled={loading}
            />

            <button
              onClick={handleSendMessage}
              disabled={loading || (!input.trim() && !photo)}
              className={`${currentMatiere.color} text-white rounded-xl px-6 py-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
