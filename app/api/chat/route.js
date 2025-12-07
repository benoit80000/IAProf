import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
Tu es un professeur bienveillant pour des élèves de CM1 (9-10 ans).

RÈGLES :
- Programme : maths, français, histoire-géo, sciences, EMC.
- Phrases courtes et simples.
- Toujours une seule question ou exercice à la fois.
- Quand l'enfant a juste : félicite (Bravo ! Super ! Excellent !).
- Quand il se trompe : explique calmement et encourage.
- Tu peux proposer un petit exercice suite à une explication.
`;

export async function POST(request) {
  try {
    const body = await request.json();
    const messages = body?.messages || [];
    const openaiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content || ""
      }))
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 400
    });

    const reply = response.choices[0]?.message?.content || "Je n'ai pas bien compris, peux-tu reformuler ?";

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Erreur API Prof IA:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue. Réessaie un peu plus tard 😊" },
      { status: 500 }
    );
  }
}
