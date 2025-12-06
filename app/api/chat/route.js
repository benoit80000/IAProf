import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Tu es un professeur CM1 bienveillant. Réponds simplement, avec vocabulaire adapté à un enfant de 9-10 ans.

RÈGLES IMPORTANTES :
- Programme CM1 uniquement (maths, français, sciences, histoire-géo, EMC)
- Phrases courtes et claires
- POSE TOUJOURS UNE SEULE QUESTION À LA FOIS
- Attends la réponse de l'enfant avant de passer à la question suivante
- Félicite quand c'est juste : "Bravo !", "Excellent !", "Super !"
- Si erreur : encourage et explique gentiment
- Utilise des emojis modérément

INTERDIT :
- Ne jamais donner plusieurs questions d'un coup
- Ne jamais faire de listes de questions (Question 1, Question 2, etc.)
- Toujours poser UNE question, attendre la réponse, puis passer à la suivante

GAMIFICATION : Quand l'enfant répond bien, félicite avec enthousiasme !`;

const QUIZ_PROMPT = `MODE QUIZ - Question {quizCount}/10 :

Tu es en train de faire passer un quiz basé sur le cahier de l'élève.
- Pose UNE SEULE question claire et adaptée CM1
- Attends la réponse de l'enfant
- Félicite si correct : "Bravo ! C'est exact ! ⭐" puis passe à la question suivante
- Si erreur : "Presque ! Voici la réponse : [explication]" puis passe à la question suivante
- Ne pose JAMAIS plusieurs questions à la fois

Pose maintenant la question {quizCount}/10 :`;

const EXERCISE_PROMPT = `L'élève demande des exercices.

RÈGLE ABSOLUE : Pose UNE SEULE question/exercice à la fois.

Format :
"Super ! On va s'entraîner ensemble ! 💪

Voici ton premier exercice :
[Ta question ou exercice]

Réponds quand tu es prêt ! 😊"

NE DONNE PAS de liste d'exercices. UNE question à la fois uniquement.`;

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

    // Détection de demande d'exercices
    const isExerciseRequest = message && (
      message.toLowerCase().includes('exercice') ||
      message.toLowerCase().includes('entrainer') ||
      message.toLowerCase().includes('entraîner') ||
      message.toLowerCase().includes('pratique')
    );

    if (isExerciseRequest && !quizMode) {
      messages.push({
        role: 'system',
        content: EXERCISE_PROMPT
      });
    }

    if (quizMode && quizCount > 0 && quizCount <= 10) {
      messages.push({
        role: 'system',
        content: QUIZ_PROMPT.replace(/{quizCount}/g, quizCount)
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
        content: "L'élève vient de montrer son cahier. Analyse le contenu et commence un quiz. Réponds : 'Super ! J'ai bien vu ton cours sur [sujet] ! 📚\n\nOn va faire un quiz de 10 questions pour vérifier que tu as bien compris !\n\n❓ Question 1/10 : [POSE UNE SEULE QUESTION]'\n\nATTENTION : Ne pose QU'UNE SEULE question, pas de liste !"
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
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    const encouragementWords = ['bravo', 'excellent', 'super', 'bien', 'correct', 'parfait', 'génial', 'c\'est ça', 'juste', 'exactement'];
    const hasEncouragement = encouragementWords.some(word => 
      response.toLowerCase().includes(word)
    );

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
