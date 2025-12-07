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
    { id: "dictionnaire", nom: "Dictionnaire", emoji: "📖" },
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
  { id: "francais-verbe", nom: "Trouve le verbe", emoji: "🧠", desc: "Clique sur le verbe dans la phrase", levelRequired: 2 },
  { id: "anglais-memory", nom: "Memory anglais", emoji: "🔤", desc: "Associe les mots anglais et français", levelRequired: 2 },
];
\n\n
export const MINI_GAMES_BY_THEME = {
  // Maths
  "fractions": ["calcul-mental", "comparaison-maths"],
  "grands-nombres": ["comparaison-maths", "calcul-mental"],
  "additions": ["calcul-mental"],
  "multiplications": ["calcul-mental"],
  "divisions": ["calcul-mental"],
  "geometrie": ["quiz-rapide"],
  "mesures": ["quiz-rapide"],
  "problemes": ["quiz-rapide"],

  // Français
  "conjugaison": ["vrai-faux", "quiz-rapide"],
  "grammaire": ["vrai-faux"],
  "orthographe": ["pendu", "vrai-faux"],
  "vocabulaire": ["pendu", "quiz-rapide"],
  "lecture": ["quiz-rapide"],
  "redaction": ["quiz-rapide"],
  "cod-coi": ["vrai-faux"],
  "types-phrases": ["vrai-faux"],

  // Dictée
  "sons-difficiles": ["vrai-faux"],
  "accords": ["vrai-faux"],
  "mots-outils": ["pendu"],

  // Anglais
  "vocabulaire-quotidien": ["anglais-memory"],
  "verbes-irreguliers": ["anglais-memory"],
  "compréhension-orale": ["quiz-rapide"],
  "dictionnaire": ["anglais-memory"],

  // Sciences
  "corps-humain": ["vrai-faux", "quiz-rapide"],
  "digestion": ["quiz-rapide"],
  "respiration": ["vrai-faux"],
  "plantes": ["vrai-faux"],
  "animaux": ["vrai-faux", "quiz-rapide"],
  "environnement": ["vrai-faux"],
  "energie": ["vrai-faux"],
  "eau": ["vrai-faux"],

  // Histoire
  "prehistoire": ["quiz-rapide"],
  "antiquite": ["quiz-rapide"],
  "moyen-age": ["quiz-rapide"],
  "temps-modernes": ["quiz-rapide"],

  // Géographie
  "france-geo": ["quiz-rapide"],
  "regions": ["quiz-rapide"],
  "monde": ["quiz-rapide"],

  // Arts plastiques
  "couleurs": ["quiz-rapide"],
  "palette-graphique": [],
  "formes-composition": ["quiz-rapide"],

  // EMC
  "vivre-ensemble": ["vrai-faux"],
  "regles": ["vrai-faux"],
  "droits": ["vrai-faux"],
  "egalite": ["vrai-faux"],
  "environnement-emc": ["vrai-faux"],
  "solidarite": ["vrai-faux"],
  "citoyennete": ["vrai-faux"],
};
\n
export const LEVEL_THRESHOLDS = {
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
};

export const SKILL_TREE = {
  maths: [
    { id: "addition", nom: "Addition" },
    { id: "soustraction", nom: "Soustraction" },
    { id: "multiplication", nom: "Multiplication" },
    { id: "problemes", nom: "Problèmes" },
    { id: "geometrie", nom: "Géométrie" },
    { id: "fractions", nom: "Fractions" },
  ],
  francais: [
    { id: "conjugaison", nom: "Conjugaison" },
    { id: "grammaire", nom: "Grammaire" },
    { id: "orthographe", nom: "Orthographe" },
    { id: "lecture", nom: "Lecture" },
    { id: "redaction", nom: "Rédaction" },
  ],
  anglais: [
    { id: "vocabulaire", nom: "Vocabulaire" },
    { id: "phrases-simples", nom: "Phrases simples" },
    { id: "compréhension", nom: "Compréhension" },
  ],
  histoire: [
    { id: "chronologie", nom: "Chronologie" },
    { id: "personnages", nom: "Personnages clés" },
  ],
  sciences: [
    { id: "corps-humain", nom: "Corps humain" },
    { id: "plantes", nom: "Plantes" },
    { id: "energie", nom: "Énergie" },
  ],
};

export const UI_THEMES = [
  { id: "standard", nom: "Classique", className: "from-purple-500 via-indigo-500 to-blue-500" },
  { id: "foret", nom: "Forêt magique", className: "from-emerald-500 via-lime-500 to-green-600" },
  { id: "espace", nom: "Espace", className: "from-gray-900 via-purple-900 to-indigo-800" },
  { id: "ocean", nom: "Océan", className: "from-sky-500 via-cyan-500 to-blue-700" },
  { id: "egypte", nom: "Égypte ancienne", className: "from-yellow-500 via-amber-500 to-orange-600" },
];

export const AVATAR_FRAMES = [
  { id: "none", nom: "Aucun cadre", className: "ring-0" },
  { id: "or", nom: "Cadre or", className: "ring-2 ring-yellow-400" },
  { id: "epique", nom: "Cadre épique", className: "ring-2 ring-purple-400" },
  { id: "galactique", nom: "Cadre galactique", className: "ring-2 ring-sky-400" },
];

export const HONOR_EMOJIS = [
  { id: "none", nom: "Aucun", emoji: "" },
  { id: "etoile", nom: "Étoile d'honneur", emoji: "⭐" },
  { id: "couronne", nom: "Couronne", emoji: "👑" },
  { id: "feu", nom: "Flamme", emoji: "🔥" },
];
