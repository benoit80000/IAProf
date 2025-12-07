import { SUBJECTS } from "./subjects";

export const GAMES = [
  // MATHS
  {
    id: "calcul-rapide",
    subject: "maths",
    title: "Calcul rapide",
    skill: "calculMental",
    difficulty: "Facile à Difficile",
    xpReward: 6,
    description: "Réponds vite à des opérations de base.",
    generateQuestion: (level = 1) => {
      const ops = ["+", "-", "×"];
      const op = ops[Math.floor(Math.random() * ops.length)];
      const max = level <= 2 ? 20 : level <= 4 ? 50 : 99;
      let a = Math.floor(Math.random() * max) + 1;
      let b = Math.floor(Math.random() * max) + 1;
      if (op === "-" && b > a) [a, b] = [b, a];
      let correct;
      if (op === "+") correct = a + b;
      if (op === "-") correct = a - b;
      if (op === "×") correct = a * b;
      const correctStr = String(correct);
      const options = [correctStr];
      while (options.length < 4) {
        const delta = Math.floor(Math.random() * 7) - 3;
        const candidate = String(correct + delta || correct + 1);
        if (!options.includes(candidate)) options.push(candidate);
      }
      options.sort(() => Math.random() - 0.5);
      return {
        prompt: `Calcule : ${a} ${op} ${b}`,
        options,
        correctIndex: options.indexOf(correctStr),
        explanation: `On calcule ${a} ${op} ${b} = ${correct}.`
      };
    }
  },
  {
    id: "defi-tables",
    subject: "maths",
    title: "Défi tables",
    skill: "multiplications",
    difficulty: "Progressif",
    xpReward: 7,
    description: "Teste tes tables de multiplication.",
    generateQuestion: (level = 1) => {
      const tables = level <= 2 ? [2, 3, 4, 5] : level <= 4 ? [6, 7, 8, 9] : [2, 3, 4, 5, 6, 7, 8, 9];
      const t = tables[Math.floor(Math.random() * tables.length)];
      const n = Math.floor(Math.random() * 10) + 1;
      const correct = t * n;
      const correctStr = String(correct);
      const options = [correctStr];
      while (options.length < 4) {
        const delta = (Math.floor(Math.random() * 4) + 1) * (Math.random() < 0.5 ? 1 : -1);
        const candidate = String(correct + delta);
        if (!options.includes(candidate) && Number(candidate) > 0) options.push(candidate);
      }
      options.sort(() => Math.random() - 0.5);
      return {
        prompt: `Combien font ${t} × ${n} ?`,
        options,
        correctIndex: options.indexOf(correctStr),
        explanation: `${t} × ${n} = ${correct}.`
      };
    }
  },
  {
    id: "fraction-ninja",
    subject: "maths",
    title: "Fraction ninja",
    skill: "fractions",
    difficulty: "Initiation",
    xpReward: 8,
    description: "Comprends et compare des fractions simples.",
    generateQuestion: (level = 1) => {
      const fractions = [
        { n: 1, d: 2 },
        { n: 1, d: 3 },
        { n: 2, d: 3 },
        { n: 3, d: 4 },
        { n: 1, d: 4 }
      ];
      const f = fractions[Math.floor(Math.random() * fractions.length)];
      const correct = `${f.n}/${f.d}`;
      const options = [correct];
      const distractors = fractions.filter(fr => fr.n !== f.n || fr.d !== f.d);
      while (options.length < 4 && distractors.length) {
        const idx = Math.floor(Math.random() * distractors.length);
        const fr = distractors.splice(idx, 1)[0];
        options.push(`${fr.n}/${fr.d}`);
      }
      options.sort(() => Math.random() - 0.5);
      return {
        prompt: "Choisis la fraction demandée :",
        options,
        correctIndex: options.indexOf(correct),
        explanation: `Une fraction s'écrit avec le numérateur en haut et le dénominateur en bas : ${correct}.`
      };
    }
  },
  {
    id: "geometrie-puzzle",
    subject: "maths",
    title: "Géométrie puzzle",
    skill: "geometrie",
    difficulty: "Visualisation",
    xpReward: 8,
    description: "Observe et réponds sur des formes géométriques.",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Quelle figure a 3 côtés ?",
          options: ["Carré", "Triangle", "Rectangle", "Cercle"],
          correctIndex: 1,
          explanation: "Un triangle a 3 côtés."
        },
        {
          prompt: "Quelle figure a 4 côtés égaux ?",
          options: ["Carré", "Triangle", "Rectangle", "Cercle"],
          correctIndex: 0,
          explanation: "Un carré possède 4 côtés de même longueur."
        },
        {
          prompt: "Laquelle de ces figures n'a pas d'angles ?",
          options: ["Carré", "Triangle", "Cercle", "Rectangle"],
          correctIndex: 2,
          explanation: "Le cercle n'a ni côté ni angle."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  },

  // FRANCAIS
  {
    id: "mot-mystere",
    subject: "francais",
    title: "Mot mystère",
    skill: "vocabulaire",
    difficulty: "Jeu de mots",
    xpReward: 7,
    description: "Retrouve le mot à partir d'indices.",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Je suis un synonyme de 'heureux'. Qui suis-je ?",
          options: ["Triste", "Content", "Fâché", "Énervé"],
          correctIndex: 1,
          explanation: "'Content' est un synonyme de 'heureux'."
        },
        {
          prompt: "Je suis le contraire de 'lent'. Qui suis-je ?",
          options: ["Rapide", "Calme", "Triste", "Silencieux"],
          correctIndex: 0,
          explanation: "'Rapide' est l'antonyme de 'lent'."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  },
  {
    id: "corrige-phrase",
    subject: "francais",
    title: "Corrige la phrase",
    skill: "orthographe",
    difficulty: "Accords",
    xpReward: 8,
    description: "Repère la phrase correctement écrite.",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Quelle phrase est correctement écrite ?",
          options: [
            "Les chien jouent dans le jardin.",
            "Les chiens joue dans le jardin.",
            "Les chiens jouent dans le jardin.",
            "Les chien joues dans le jardin."
          ],
          correctIndex: 2,
          explanation: "Sujet 'les chiens' → verbe au pluriel 'jouent'."
        },
        {
          prompt: "Quelle phrase est correctement écrite ?",
          options: [
            "La filles est contente.",
            "La fille est contente.",
            "La filles est contents.",
            "Les fille est contente."
          ],
          correctIndex: 1,
          explanation: "'La fille' est au singulier, 'contente' s'accorde avec 'fille'."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  },
  {
    id: "dictee-flash",
    subject: "francais",
    title: "Dictée flash",
    skill: "orthographeUsage",
    difficulty: "Mots courants",
    xpReward: 9,
    description: "Choisis la bonne orthographe parmi les propositions.",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Choisis la bonne orthographe :",
          options: ["Peut-être", "Peut être", "Peux-être", "Peut-êtres"],
          correctIndex: 0,
          explanation: "On écrit 'peut-être' avec un trait d'union."
        },
        {
          prompt: "Choisis la bonne orthographe :",
          options: ["Beaucoups", "Beaucoup", "Bocou", "Beacoup"],
          correctIndex: 1,
          explanation: "La seule forme correcte est 'beaucoup'."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  },
  {
    id: "nature-fonction",
    subject: "francais",
    title: "Nature & fonction",
    skill: "grammaire",
    difficulty: "Identification",
    xpReward: 8,
    description: "Repère la nature des mots dans la phrase.",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Dans la phrase 'Le chat noir dort.', quel mot est un adjectif ?",
          options: ["Le", "chat", "noir", "dort"],
          correctIndex: 2,
          explanation: "'Noir' précise le nom 'chat' : c'est un adjectif."
        },
        {
          prompt: "Dans la phrase 'Ma sœur lit un livre.', quel mot est un verbe ?",
          options: ["Ma", "sœur", "lit", "livre"],
          correctIndex: 2,
          explanation: "'Lit' est le verbe de la phrase."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  },

  // LOGIQUE
  {
    id: "trouve-intrus",
    subject: "logique",
    title: "Trouve l'intrus",
    skill: "classification",
    difficulty: "Observation",
    xpReward: 6,
    description: "Parmi ces éléments, lequel n'est pas comme les autres ?",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Quel est l'intrus ?",
          options: ["Chien", "Chat", "Cheval", "Pommes"],
          correctIndex: 3,
          explanation: "Les trois premiers sont des animaux, 'pommes' est un fruit."
        },
        {
          prompt: "Quel est l'intrus ?",
          options: ["Rouge", "Bleu", "Carré", "Vert"],
          correctIndex: 2,
          explanation: "Rouge, bleu et vert sont des couleurs, carré est une forme."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  },
  {
    id: "suites-logiques",
    subject: "logique",
    title: "Suites logiques",
    skill: "suites",
    difficulty: "Raisonnement",
    xpReward: 8,
    description: "Complète une suite de nombres simple.",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Complète la suite : 2, 4, 6, 8, ... ?",
          options: ["9", "10", "11", "12"],
          correctIndex: 1,
          explanation: "On ajoute 2 à chaque fois : 8 + 2 = 10."
        },
        {
          prompt: "Complète la suite : 5, 10, 15, 20, ... ?",
          options: ["22", "24", "25", "30"],
          correctIndex: 2,
          explanation: "On ajoute 5 à chaque fois : 20 + 5 = 25."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  },
  {
    id: "cadenas-code",
    subject: "logique",
    title: "Cadenas à code",
    skill: "problemesSimples",
    difficulty: "Problèmes",
    xpReward: 9,
    description: "Résous un mini problème pour ouvrir le cadenas.",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Un stylo coûte 2 €. Combien coûtent 4 stylos ?",
          options: ["4 €", "6 €", "8 €", "10 €"],
          correctIndex: 2,
          explanation: "4 × 2 € = 8 €."
        },
        {
          prompt: "Tu as 12 bonbons et tu veux les partager entre 3 amis. Combien chacun reçoit-il ?",
          options: ["3", "4", "5", "6"],
          correctIndex: 1,
          explanation: "12 ÷ 3 = 4."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  },

  // CULTURE
  {
    id: "quiz-monde",
    subject: "culture",
    title: "Quiz Monde",
    skill: "geographie",
    difficulty: "Découverte",
    xpReward: 7,
    description: "Découvre des pays et des villes du monde.",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Quelle est la capitale de la France ?",
          options: ["Londres", "Paris", "Rome", "Berlin"],
          correctIndex: 1,
          explanation: "La capitale de la France est Paris."
        },
        {
          prompt: "Sur quel continent se trouve l'Égypte ?",
          options: ["Europe", "Asie", "Afrique", "Amérique"],
          correctIndex: 2,
          explanation: "L'Égypte se situe au nord de l'Afrique."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  },
  {
    id: "quiz-sciences",
    subject: "culture",
    title: "Quiz Sciences",
    skill: "sciences",
    difficulty: "Curiosité",
    xpReward: 7,
    description: "Teste ta culture scientifique.",
    generateQuestion: () => {
      const questions = [
        {
          prompt: "Quel est l'état de l'eau dans un glaçon ?",
          options: ["Liquide", "Solide", "Gazeux", "Plasma"],
          correctIndex: 1,
          explanation: "Un glaçon est de l'eau à l'état solide."
        },
        {
          prompt: "De quoi ont besoin les plantes pour fabriquer leur nourriture ?",
          options: ["Lait", "Lumière", "Sucre", "Métal"],
          correctIndex: 1,
          explanation: "Les plantes ont besoin de lumière pour faire la photosynthèse."
        }
      ];
      return questions[Math.floor(Math.random() * questions.length)];
    }
  }
];

export function getGameById(id) {
  return GAMES.find(g => g.id === id);
}

export function gamesBySubject(subjectId) {
  return GAMES.filter(g => g.subject === subjectId);
}
