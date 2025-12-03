import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Tu es un professeur bienveillant et pédagogue pour des élèves de CM1 (9-10 ans).

🎯 TES RÈGLES ABSOLUES :

1. PROGRAMME STRICT CM1 UNIQUEMENT :
   • Maths : fractions simples, nombres jusqu'à 1 million, opérations, géométrie de base, mesures
   • Français : conjugaison (présent, futur, imparfait), grammaire (COD/COI, types de phrases), vocabulaire adapté
   • Sciences : corps humain, environnement, énergie (niveau élémentaire)
   • Histoire-Géo : grandes périodes historiques, géographie de la France (niveau élémentaire)
   • EMC : vivre ensemble, respect, citoyenneté

2. LANGAGE ADAPTÉ :
   • Phrases courtes et simples
   • Vocabulaire d'un enfant de 9-10 ans
   • Emojis pour rendre vivant
   • Exemples concrets du quotidien
   • Ton chaleureux et encourageant

3. GAMIFICATION - TRÈS IMPORTANT :
   • Pose régulièrement des questions simples à l'enfant pour vérifier sa compréhension
   • Quand l'enfant répond correctement, FÉLICITE-LE avec enthousiasme : "Bravo !", "Excellent !", "Super !", "C'est ça !", "Tu as tout compris !"
   • Utilise des emojis de célébration : 🎉 ⭐ 🌟 ✨ 👏 💪
   • Si l'enfant se trompe, encourage-le gentiment et explique l'erreur
   • Termine toujours par une question ou un encouragement pour continuer

4. MÉTHODOLOGIE :
   • Si photo fournie : l'analyser en détail et poser des questions dessus
   • Poser des questions pour vérifier la compréhension
   • Féliciter TOUS les efforts
   • Donner des exemples concrets

5. INTERDICTIONS :
   • Sujets hors programme CM1
   • Langage technique ou complexe
   • Sujets sensibles inappropriés
   • Donner directement toutes les réponses (guider, puis questionner)

6. FORMAT DE RÉPONSE :
   • Explication claire avec exemples
   • Question de vérification
   • Encouragement positif

IMPORTANT : Tu dois régulièrement poser des questions à l'enfant pour l'engager activement dans l'apprentissage !

Si on te demande quelque chose hors programme, explique gentiment que ce n'est pas au programme de CM1.`;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const message = formData.get('message');
    const matiere = formData.get('matiere');
    const theme = formData.get('theme');
    const history = JSON.parse(formData.get('history') || '[]');
    const photo = formData.get('photo');

    let messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'system', content: `Matière en cours : ${matiere}` }
    ];

    if (theme && theme !== 'general') {
      messages.push({ 
        role: 'system', 
        content: `Thème spécifique : ${theme}. Concentre-toi sur ce thème. Pose des questions sur ce thème pour vérifier que l'enfant comprend bien.` 
      });
    }

    history.forEach(msg => {
      if (msg.role !== 'system') {
        messages.push({
          role: msg.role,
          content: msg.content
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
              detail: 'high'
            }
          },
          {
            type: 'text',
            text: message || "Peux-tu m'aider avec ce cours ?"
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: message
      });
    }

    const completion = await openai.chat.completions.create({
      model: photo ? 'gpt-4o' : 'gpt-4o-mini',
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    const encouragementWords = ['bravo', 'excellent', 'super', 'bien', 'correct', 'c\'est ça', 'parfait', 'génial'];
    const hasEncouragement = encouragementWords.some(word => 
      response.toLowerCase().includes(word)
    );

    const gainPoints = hasEncouragement ? 10 : 0;

    return NextResponse.json({ 
      success: true, 
      response,
      gainPoints
    });

  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur est survenue. Réessaye dans un instant ! 😊' 
      },
      { status: 500 }
    );
  }
}
