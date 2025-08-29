import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Correct import and class name
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

export async function explainCode(code, mode, level, language) {
  if (!API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set.");
    return "❌ Failed to generate explanation: API key missing.";
  }

  // Correctly instantiate the GoogleGenerativeAI client
  const genAI = new GoogleGenerativeAI(API_KEY);

  const prompt = `
    Code:
    ${code}
    Mode: ${mode}
    Level: ${level}
    Language: ${language}

    Please provide a clear, step-by-step explanation.
    `;

  try {
    // Access the model and generate content
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini error:", error);
    return "❌ Failed to generate explanation.";
  }
}