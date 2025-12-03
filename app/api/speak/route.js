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
      model: 'tts-1',
      voice: 'nova',
      input: text,
      speed: 0.95,
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
