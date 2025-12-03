import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Camera, Send, Trash2, Loader } from 'lucide-react';

const MATIERES = [
  { id: 'maths', nom: 'Mathématiques', emoji: '🔢', color: 'bg-blue-500' },
  { id: 'francais', nom: 'Français', emoji: '📝', color: 'bg-purple-500' },
  { id: 'sciences', nom: 'Sciences', emoji: '🔬', color: 'bg-green-500' },
  { id: 'histoire', nom: 'Histoire-Géo', emoji: '🌍', color: 'bg-orange-500' },
  { id: 'emc', nom: 'EMC', emoji: '🤝', color: 'bg-pink-500' }
];

export default function ProfIA() {
  const [matiere, setMatiere] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

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
        content: `Bonjour ! 👋 Je suis ton professeur pour ${MATIERES.find(m => m.id === matiere)?.nom}.\n\nAvant de commencer, as-tu ton cahier ou ton cours avec toi ? Si oui, tu peux prendre une photo 📸 pour que je puisse mieux t'aider !\n\nSinon, dis-moi simplement ce que tu veux réviser aujourd'hui ! 😊`
      };
      setMessages([welcomeMsg]);
    }
  }, [matiere]);

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
      formData.append('history', JSON.stringify(messages));
      
      if (photo) {
        formData.append('photo', photo);
      }

      // DEMO MODE - Simulation de réponse
      // En production, décommenter l'appel API ci-dessous
      
      /*
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      */

      // SIMULATION pour démonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let demoResponse = '';
      
      if (photo) {
        demoResponse = `Super ! 📸 J'ai bien vu ta photo !\n\nJe vois que tu travailles sur ce sujet. C'est une très bonne leçon !\n\nVoici ce que je peux t'expliquer :\n\n✨ L'essentiel à retenir :\n• Point important 1\n• Point important 2\n• Point important 3\n\nEst-ce qu'il y a quelque chose en particulier que tu ne comprends pas bien ? Je suis là pour t'aider ! 😊`;
      } else if (input.toLowerCase().includes('fraction')) {
        demoResponse = `Les fractions ! 🍰 C'est comme découper un gâteau !\n\nImagine un gâteau entier = 1\nSi tu le coupes en 4 parts égales, chaque part = 1/4\n\n🎯 Exemple :\n• 1/4 se lit "un quart"\n• 2/4 = "deux quarts" (la moitié du gâteau !)\n• 3/4 = "trois quarts"\n\nEst-ce que tu veux qu'on s'entraîne avec des exemples ? Ou tu as une question précise sur les fractions ?`;
      } else if (input.toLowerCase().includes('conjugaison') || input.toLowerCase().includes('verbe')) {
        demoResponse = `La conjugaison ! 📝 C'est important de bien conjuguer les verbes.\n\n🎯 Petit truc pour t'aider :\n• JE → e (je mange)\n• TU → es (tu manges)\n• IL/ELLE → e (il/elle mange)\n• NOUS → ons (nous mangeons)\n• VOUS → ez (vous mangez)\n• ILS/ELLES → ent (ils/elles mangent)\n\nC'est pour quel temps ? Présent, futur, imparfait ? Dis-moi et on va réviser ensemble ! 😊`;
      } else {
        demoResponse = `D'accord ! Je comprends ta question. 😊\n\n${input.includes('?') ? 'Voici la réponse' : 'Laisse-moi t\'expliquer'} :\n\nC'est un sujet important en ${MATIERES.find(m => m.id === matiere)?.nom} pour le CM1.\n\n💡 L'essentiel à retenir :\n• Premier point important\n• Deuxième point à comprendre\n• Troisième élément clé\n\nEst-ce que c'est plus clair maintenant ? N'hésite pas à me poser d'autres questions ! 🌟`;
      }

      const assistantMessage = {
        role: 'assistant',
        content: demoResponse
      };

      setMessages(prev => [...prev, assistantMessage]);
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
    setInput('');
    removePhoto();
  };

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
              <li>2️⃣ Prends en photo ton cours (facultatif)</li>
              <li>3️⃣ Pose tes questions</li>
              <li>4️⃣ Je t'explique simplement !</li>
            </ul>
          </div>
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
              <p className="text-sm opacity-90">CM1 • Programme officiel</p>
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
      <div className="max-w-4xl mx-auto p-4 pb-32">
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
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-200 hover:bg-gray-300 rounded-xl p-3 transition-colors"
              title="Prendre une photo du cours"
            >
              <Camera className="w-6 h-6 text-gray-700" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pose ta question ici... 🤔"
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
