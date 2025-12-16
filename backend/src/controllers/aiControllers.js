import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIFlashcards = async (req, res) => {
  try {
    const { topic, noteContent } = req.body;

    if (!topic || !noteContent) {
      return res
        .status(400)
        .json({ message: "Topic and noteContent are required" });
    }

    const prompt = `
You are an educational assistant.
Generate 5 flashcards for the topic "${topic}" using these notes:
${noteContent}
Return the flashcards in JSON array format like:
[
  {"question": "...", "answer": "...", "category": "..."}
]
    `;
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json|```/g, "").trim();
    const flashcards = JSON.parse(cleanText);

    res.status(200).json({
      message: "AI Flashcards generated successfully ✅",
      flashcards,
    });
  } catch (error) {
    if (error.message.includes("503")) {
      return res.status(503).json({
        message: "AI is busy right now. Please try again in a few seconds.",
      });
    }
    res.status(500).json({
      message: "Failed to generate AI flashcards",
      error: error.message,
    });
  }
};
