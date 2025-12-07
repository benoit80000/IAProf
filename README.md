# IAProf CM1 – Refonte (Prototype)

Ce dossier contient une **refonte complète** de l'application IAProf orientée CM1, avec :

- Un **accueil élève** gamifié (missions du jour, mini-jeux populaires, avatar, XP / niveau).
- Un écran **Missions**.
- Un écran **Mini-jeux** (Maths, Français, Logique, Culture).
- Un écran **Profil & Badges**.
- 12 **mini-jeux pédagogiques** (questions à choix multiples) correspondant aux domaines clés du CM1.
- Un **système de progression** avec XP, niveaux et difficulté adaptative par compétence.

## ⚙️ Stack

- React 18 + Vite
- CSS simple (pas de Tailwind pour garder le prototype léger)

## ▶️ Lancer le projet

Dans un terminal :

```bash
npm install
npm run dev
```

Puis ouvre l'URL indiquée (par défaut : http://localhost:5173).

## 🧠 Structure pédagogique

Les mini-jeux sont définis dans `src/data/games.js`.  
Ils sont regroupés par matière (Maths, Français, Logique, Culture) avec un générateur de question par jeu.

Tu peux facilement :

- ajouter de nouvelles questions,
- ajouter de nouveaux mini-jeux,
- affiner les explications et les feedbacks.

## 🔁 Difficulté adaptative

Chaque mini-jeu est associé à une compétence (`skill`).  
Le niveau de cette compétence augmente ou diminue selon les réponses de l'élève :

- +1 niveau après plusieurs bonnes réponses,
- -1 niveau après plusieurs erreurs.

La valeur est stockée dans `player.skillLevels`.

## ✅ À adapter / étendre

Ce prototype est volontairement léger mais complet, pour servir de base à :

- une intégration dans ton projet Next.js existant,
- une extension avec un **mode enseignant**, gestion de classe, export, etc.,
- un design plus poussé (icônes custom, animations, avatars, etc.).

Tu peux copier-coller la logique et les contenus vers ton application actuelle.
