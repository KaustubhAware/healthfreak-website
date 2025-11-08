import { GoogleGenerativeAI } from "@google/generative-ai";

export const openai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
