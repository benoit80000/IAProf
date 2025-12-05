import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Tu es un professeur CM1 bienveillant. Réponds simplement, avec vocabulaire adapté à un enfant de 9-10 ans.

RÈGLES :
- Programme CM1 uniquement (maths, français, sciences, histoire-géo, EMC)
- Phrases courtes et claires
- Pose des questions pour vérifier la compréhension
- Félicite quand c'est juste : "Bravo !", "Excellent !", "Super !"
- Si erreur : encourage et explique gentiment
- Utilise des emojis modérément

GAMIFICATION : Quand l'enfant répond bien, félicite avec enthousiasme !`;

const QUIZ_PROMPT = `MODE QUIZ ACTIVÉ - 10 QUESTIONS :
Tu dois poser des questions basées sur le contenu de la photo du cahier.
- Pose UNE SEULE question à la fois
- Question claire et adaptée CM1
- Attends la réponse de l'enfant
- Félicite si correct, encourage si erreur
- Passe à la question suivante

Question {quizCount}/10 :`;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const message = formData.get('message');
    const matiere = formData.get('matiere');
    const theme = formData.get('theme');
    const history = JSON.parse(formData.get('history') || '[]');
    const photo = formData.get('photo');
    const quizMode = formData.get('quizMode') === 'true';
    const quizCount = parseInt(formData.get('quizCount') || '0');

    let messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    if (theme && theme !== 'general') {
      messages.push({ 
        role: 'system', 
        content: `Matière: ${matiere}, Thème: ${theme}` 
      });
    } else {
      messages.push({ 
        role: 'system', 
        content: `Matière: ${matiere}` 
      });
    }

    // Mode Quiz
    if (quizMode && quizCount > 0 && quizCount <= 10) {
      messages.push({
        role: 'system',
        content: QUIZ_PROMPT.replace('{quizCount}', quizCount)
      });
    }

    const limitedHistory = history.slice(-6);
    limitedHistory.forEach(msg => {
      if (msg.role !== 'system') {
        messages.push({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content.substring(0, 500) : msg.content
        });
      }
    });

    // Gérer la photo (déclenchement du quiz)
    if (photo) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const mimeType = photo.type;

      messages.push({
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64}`,
              detail: 'low'
            }
          },
          {
            type: 'text',
            text: message || "Voici mon cahier"
          }
        ]
      });

      messages.push({
        role: 'system',
        content: "L'élève vient de montrer son cahier. Analyse le contenu et lance un quiz de 10 questions progressives sur ce cours. Commence par : 'Super ! J'ai bien vu ton cours sur [sujet] ! 📚\n\nOn va faire un quiz de 10 questions pour vérifier que tu as bien compris ! Es-tu prêt ? 😊\n\n❓ Question 1/10 : [ta première question]'"
      });
    } else {
      messages.push({
        role: 'user',
        content: message
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 400,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    // Détection de félicitations
    const encouragementWords = ['bravo', 'excellent', 'super', 'bien', 'correct', 'parfait', 'génial', 'c\'est ça', 'juste', 'exactement'];
    const hasEncouragement = encouragementWords.some(word => 
      response.toLowerCase().includes(word)
    );

    // Si photo envoyée, on démarre le quiz
    const startQuiz = !!photo;

    return NextResponse.json({ 
      success: true, 
      response,
      gainPoints: hasEncouragement ? 10 : 0,
      startQuiz
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur est survenue. Réessaye ! 😊' 
      },
      { status: 500 }
    );
  }
}
```

## 🎮 **Résumé des améliorations gamifiées**

### ✨ **Ce qui a été ajouté :**

1. **🏆 Système de badges à 7 niveaux** :
   - Débutant (0 pts)
   - Apprenti (50 pts)
   - Bon élève (100 pts)
   - Expert (200 pts)
   - Champion (300 pts)
   - Maître (500 pts)
   - Légende (1000 pts)

2. **📸 Quiz automatique de 10 questions** :
   - L'enfant montre son cahier
   - L'IA analyse le contenu
   - Lance automatiquement 10 questions
   - Compteur de progression (Question 1/10, 2/10...)
   - Bonus d'étoiles à la fin selon le score

3. **🎉 Animations de célébration** :
   - Popup animée à chaque gain de points
   - Message spécial pour nouveau badge
   - Animation bounce avec sparkles

4. **📊 Page des badges** :
   - Affiche tous les badges
   - Indique ceux débloqués/verrouillés
   - Montre la progression vers le prochain badge
   - Accessible via bouton trophée

5. **⭐ Système de points enrichi** :
   - +10 points par bonne réponse
   - Bonus de 5 points × nombre de bonnes réponses à la fin du quiz
   - Progression visible en temps réel

### 🎯 **Flux du quiz :**
```
1. 👦 Enfant prend photo du cahier
2. 📸 Envoie la photo
3. 🤖 IA analyse : "Super ! J'ai vu ton cours sur [sujet] !"
4. 🎯 "Question 1/10 : [question]"
5. 👦 Enfant répond
6. ✅ "Bravo !" → +10 étoiles
7. 🎯 "Question 2/10 : [question]"
... (jusqu'à 10)
8. 🎉 "Quiz terminé ! Tu as eu 8/10 !"
9. ⭐ Bonus : +40 étoiles (8×5)
10. 🏆 Peut débloquer un nouveau badge !
