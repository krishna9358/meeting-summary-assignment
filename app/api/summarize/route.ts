import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: Request) {
  try {
    const { transcript, prompt } = await req.json();

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({ error: 'Missing transcript' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'You are an assistant that summarizes meeting transcripts into clear, structured notes.' },
        { role: 'user', content: `Instruction: ${prompt}\n\nTranscript:\n${transcript}` },
      ],
      temperature: 0.2,
    });

    const summary = completion.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ summary });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Summarization failed' }, { status: 500 });
  }
}