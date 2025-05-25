// backend/services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY environment variable");
  process.exit(1);
}

let _ai: GoogleGenerativeAI | null = null;

export async function getAiClient(): Promise<GoogleGenerativeAI> {
  if (!_ai) {
    console.log('Initializing Gemini AI client...');
    _ai = new GoogleGenerativeAI(apiKey as string);
  }
  return _ai;
}