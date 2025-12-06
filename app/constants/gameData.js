"use client";

import { Star, Trophy, Award, Target, Zap, Crown, Medal } from "lucide-react";

export const MATIERES = [
  { id: "francais", nom: "Français", emoji: "📝", color: "bg-purple-500" },
  { id: "dictee", nom: "Dictée", emoji: "✍️", color: "bg-indigo-500" },
  { id: "maths", nom: "Mathématiques", emoji: "🔢", color: "bg-blue-500" },
  { id: "anglais", nom: "Anglais", emoji: "🇬🇧", color: "bg-red-500" },

  { id: "histoire", nom: "Histoire", emoji: "📜", color: "bg-orange-500" },
  { id: "geographie", nom: "Géographie", emoji: "🗺️", color: "bg-emerald-500" },
  { id: "sciences", nom: "Sciences & techno", emoji: "🔬", color: "bg-green-500" },

  { id: "arts-plastiques", nom: "Arts plastiques", emoji: "🎨", color: "bg-pink-500" },
  { id: "education-musicale", nom: "Éducation musicale", emoji: "🎵", color: "bg-rose-500" },
  { id: "histoire-des-arts", nom: "Histoire des arts", emoji: "🏛️", color: "bg-yellow-500" },

  { id: "eps", nom: "EPS", emoji: "🏃", color: "bg-teal-500" },
  { id: "emc", nom: "EMC", emoji: "🤝", color: "bg-sky-500" },
];

export const THEMES_PAR_MATIERE = {
  maths: [
    { id: "fractions", nom: "Les fractions", emoji: "🍕" },
    { id: "grands-nombres", nom: "Grands nombres", emoji: "🔢" },
    { id: "additions", nom: "Additions", emoji: "➕" },
    { id: "multiplications", nom: "Multiplications", emoji: "✖️" },
    { id: "divisions", nom: "Divisions", emoji: "➗" },
    { id: "geometrie", nom: "Géométrie", emoji: "📐" },
    { id: "mesures", nom: "Mesures", emoji: "📏" },
    { id: "problemes", nom: "Problèmes", emoji: "🧩" },
  ],
  francais: [
    { id: "conjugaison", nom: "Conjugaison", emoji: "⏰" },
    { id: "grammaire", nom: "Grammaire", emoji: "📖" },
    { id: "orthographe", nom: "Orthographe", emoji: "✍️" },
    { id: "vocabulaire", nom: "Vocabulaire", emoji: "📚" },
    { id: "lecture", nom: "Lecture", emoji: "📰" },
    { id: "redaction", nom: "Rédaction", emoji: "📝" },
    { id: "cod-coi", nom: "COD/COI", emoji: "🎯" },
    { id: "types-phrases", nom: "Types phrases", emoji: "❓" },
  ],
  dictee: [
    { id: "sons-difficiles", nom: "Sons difficiles", emoji: "🌀" },
    { id: "accords", nom: "Accords", emoji: "✅" },
    { id: "mots-outils", nom: "Mots outils", emoji: "🧩" },
  ],
  anglais: [
    { id: "vocabulaire-quotidien", nom: "Vocabulaire du quotidien", emoji: "🗣️" },
    { id: "verbes-irreguliers", nom: "Verbes irréguliers", emoji: "📚" },
    { id: "compréhension-orale", nom: "Compréhension orale", emoji: "🎧" },
  ],
  sciences: [
    { id: "corps-humain", nom: "Corps humain", emoji: "🧍" },
    { id: "digestion", nom: "Digestion", emoji: "🍎" },
    { id: "respiration", nom: "Respiration", emoji: "💨" },
    { id: "plantes", nom: "Plantes", emoji: "🌱" },
    { id: "animaux", nom: "Animaux", emoji: "🦋" },
    { id: "environnement", nom: "Environnement", emoji: "🌍" },
    { id: "energie", nom: "Énergie", emoji: "⚡" },
    { id: "eau", nom: "L'eau", emoji: "💧" },
  ],
  histoire: [
    { id: "prehistoire", nom: "Préhistoire", emoji: "🦴" },
    { id: "antiquite", nom: "Antiquité", emoji: "🏛️" },
    { id: "moyen-age", nom: "Moyen Âge", emoji: "🏰" },
    { id: "temps-modernes", nom: "Temps modernes", emoji: "⚓" },
  ],
  geographie: [
    { id: "france-geo", nom: "Géo France", emoji: "🗺️" },
    { id: "regions", nom: "Régions", emoji: "🇫🇷" },
    { id: "monde", nom: "Le monde", emoji: "🌍" },
  ],
  "arts-plastiques": [
    { id: "couleurs", nom: "Couleurs et mélanges", emoji: "🎨" },
    { id: "palette-graphique", nom: "Palette graphique", emoji: "🖌️" },
    { id: "formes-composition", nom: "Formes et composition", emoji: "🟦" },
  ],
  emc: [
    { id: "vivre-ensemble", nom: "Vivre ensemble", emoji: "👥" },
    { id: "regles", nom: "Règles de vie", emoji: "📋" },
    { id: "droits", nom: "Droits/Devoirs", emoji: "⚖️" },
    { id: "egalite", nom: "Égalité", emoji: "🟰" },
    { id: "environnement", nom: "Environnement", emoji: "♻️" },
    { id: "solidarite", nom: "Solidarité", emoji: "💚" },
    { id: "citoyennete", nom: "Citoyenneté", emoji: "🗳️" },
  ],
};

export const BADGES = [
  { id: "debutant", nom: "Débutant", icon: Star, points: 0, color: "text-gray-400", desc: "Commence l'aventure !" },
  { id: "apprenti", nom: "Apprenti", icon: Target, points: 50, color: "text-blue-500", desc: "50 points" },
  { id: "bon-eleve", nom: "Bon élève", icon: Award, points: 100, color: "text-green-500", desc: "100 points" },
  { id: "expert", nom: "Expert", icon: Zap, points: 200, color: "text-yellow-500", desc: "200 points" },
  { id: "champion", nom: "Champion", icon: Trophy, points: 300, color: "text-orange-500", desc: "300 points" },
  { id: "maitre", nom: "Maître", icon: Crown, points: 500, color: "text-purple-500", desc: "500 points" },
  { id: "grand-maitre", nom: "Grand Maître", icon: Crown, points: 1000, color: "text-indigo-500", desc: "1000 points" },
  { id: "etoile", nom: "Étoile montante", icon: Star, points: 2000, color: "text-yellow-400", desc: "2000 points" },
  { id: "ultra-legende", nom: "Ultra Légende", icon: Medal, points: 3000, color: "text-pink-500", desc: "3000 points" },
  { id: "mythique", nom: "Mythique", icon: Trophy, points: 5000, color: "text-emerald-500", desc: "5000 points" },
  { id: "cosmique", nom: "Cosmique", icon: Zap, points: 7500, color: "text-sky-500", desc: "7500 points" },
  { id: "ultime", nom: "Ultime", icon: Medal, points: 10000, color: "text-red-500", desc: "10000 points" },
];

export const AVATARS = [
  { id: "cat", emoji: "🐱", nom: "Chat", cost: 0 },
  { id: "dog", emoji: "🐶", nom: "Chien", cost: 0 },
  { id: "rabbit", emoji: "🐰", nom: "Lapin", cost: 0 },
  { id: "fox", emoji: "🦊", nom: "Renard", cost: 50 },
  { id: "lion", emoji: "🦁", nom: "Lion", cost: 100 },
  { id: "unicorn", emoji: "🦄", nom: "Licorne", cost: 150 },
  { id: "dragon", emoji: "🐲", nom: "Dragon", cost: 200 },
  { id: "robot", emoji: "🤖", nom: "Robot", cost: 250 },
  { id: "alien", emoji: "👽", nom: "Alien", cost: 300 },
  { id: "superhero", emoji: "🦸", nom: "Super-héros", cost: 500 },
  { id: "wizard", emoji: "🧙‍♂️", nom: "Magicien", cost: 800 },
  { id: "pharaoh", emoji: "🧑‍🦳", nom: "Pharaon", cost: 1200 },
  { id: "astronaut", emoji: "🧑‍🚀", nom: "Astronaute", cost: 2000 },
  { id: "phoenix", emoji: "🔥", nom: "Phénix", cost: 3000 },
  { id: "griffin", emoji: "🦅", nom: "Griffon", cost: 5000 },
  { id: "galaxy", emoji: "🌌", nom: "Galaxie", cost: 7500 },
  { id: "ultimate-crown", emoji: "👑", nom: "Couronne ultime", cost: 10000 },
];

export const AVATAR_COLORS = [
  { id: "blue", color: "bg-blue-500", nom: "Bleu", cost: 0 },
  { id: "purple", color: "bg-purple-500", nom: "Violet", cost: 0 },
  { id: "green", color: "bg-green-500", nom: "Vert", cost: 30 },
  { id: "orange", color: "bg-orange-500", nom: "Orange", cost: 30 },
  { id: "pink", color: "bg-pink-500", nom: "Rose", cost: 50 },
  { id: "yellow", color: "bg-yellow-500", nom: "Jaune", cost: 50 },
  { id: "red", color: "bg-red-500", nom: "Rouge", cost: 75 },
  { id: "rainbow", color: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500", nom: "Arc-en-ciel", cost: 200 },
];

export const MINI_GAMES = [
  { id: "calcul-mental", nom: "Calcul Mental", emoji: "🧮", desc: "Réponds vite aux calculs !", levelRequired: 1 },
  { id: "pendu", nom: "Le Pendu", emoji: "📝", desc: "Trouve le mot mystère", levelRequired: 2 },
  { id: "vrai-faux", nom: "Vrai ou Faux", emoji: "✅", desc: "Teste tes connaissances", levelRequired: 3 },
  { id: "quiz-rapide", nom: "Quiz Rapide", emoji: "⚡", desc: "Réponds à un quiz éclair", levelRequired: 4 },
  { id: "comparaison-maths", nom: "Comparaison de nombres", emoji: "🔢", desc: "Choisis le plus grand nombre", levelRequired: 2 },
];
