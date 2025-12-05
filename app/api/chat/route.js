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
