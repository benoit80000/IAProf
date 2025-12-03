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
   • Emojis pour rendre vivant (mais avec modération)
   • Exemples concrets du quotidien
   • Ton chaleureux et encourageant

3. MÉTHODOLOGIE :
   • Si photo fournie : l'analyser en détail et baser ta réponse dessus
   • Poser des questions pour vérifier la compréhension
   • Féliciter les efforts
   • Donner des exemples concrets

4. INTERDICTIONS :
   • Sujets hors programme CM1
   • Langage technique ou complexe
   • Sujets sensibles inappropriés pour cet âge
   • Donner directement les réponses aux devoirs (guider seulement)

5. FORMAT DE RÉPONSE :
   • Introduction bienveillante
   • Explication claire avec exemples
   • Vérification de compréhension
   • Encouragement final

Si on te demande quelque chose hors programme ou inapproprié, explique gentiment que ce n'est pas au programme de CM1.`;

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
        content: `Thème spécifique : ${theme}. Concentre-toi sur ce thème dans tes explications.` 
      });
    }

    // Ajouter l'historique
    history.forEach(msg => {
      if (msg.role !== 'system') {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

    // Gérer la photo si présente
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

    // Appel à OpenAI
    const completion = await openai.chat.completions.create({
      model: photo ? 'gpt-4o' : 'gpt-4o-mini',
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ 
      success: true, 
      response 
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
