# Prof IA CM1 – Refonte Next.js

Cette version combine :

- le **style visuel** moderne (fond sombre, cartes, barre de navigation en bas)
- avec une application complète Next.js :
  - mini-jeux par matière (maths, français, logique, culture)
  - missions du jour
  - progression avec XP / niveau
  - un **Prof IA** via l'API `/api/chat`

## Lancer en local

```bash
npm install
npm run dev
```

puis ouvre http://localhost:3000

## Configuration de l'API Prof IA

Dans Vercel (ou en local dans un fichier `.env.local`), définis :

```bash
OPENAI_API_KEY=ta_cle_api
```

L'API est dans `app/api/chat/route.js` et le chat est utilisé dans le composant `ChatOverlay`.

## Déploiement sur Vercel

- Projet : Next.js 14
- Commande de build : `npm run build`
- Dossier de sortie : `.next`
