import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Pas de texte à synthétiser' },
        { status: 400 }
      );
    }

    // Utiliser l'API TTS d'OpenAI pour une voix naturelle
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1', // ou 'tts-1-hd' pour meilleure qualité (plus cher)
      voice: 'nova', // Voix féminine douce (autres: alloy, echo, fable, onyx, shimmer)
      input: text,
      speed: 0.95, // Légèrement plus lent pour les enfants
    });

    // Convertir en Buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Retourner l'audio
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Erreur TTS:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la synthèse vocale' 
      },
      { status: 500 }
    );
  }
}
```

## 🎤 **Fonctionnalités du mode vocal**

### ✨ Ce qui est nouveau :

1. **🔊 Le prof parle automatiquement** - Synthèse vocale naturelle avec OpenAI TTS
2. **🎤 Conversation continue** - L'enfant parle, le prof répond vocalement, puis écoute à nouveau
3. **👂 Écoute automatique** - Après chaque réponse du prof, il se remet en écoute
4. **🔘 Bouton micro géant** - Facile à utiliser pour les enfants
5. **📊 Indicateurs visuels** - "Le prof parle..." / "Je t'écoute..."
6. **🔇 Mode vocal on/off** - Possibilité de désactiver pour revenir au mode texte

### 🎯 Flux de conversation :
```
1. 👦 Enfant clique sur le micro
2. 🎤 "Je t'écoute..." s'affiche
3. 👦 Enfant pose sa question oralement
4. 🔄 Transcription automatique
5. 💬 Message affiché dans le chat
6. 🤖 IA génère la réponse
7. 🔊 "Le prof parle..." - Lecture vocale de la réponse
8. ⏸️ Fin de la lecture
9. 🔁 Retour automatique en mode écoute (étape 2)

voice: 'nova',  // Voix féminine douce (recommandée pour enfants)
// Autres options:
// 'alloy'   - Neutre
// 'echo'    - Masculine
// 'fable'   - Britannique
// 'onyx'    - Masculine profonde
// 'shimmer' - Féminine énergique
