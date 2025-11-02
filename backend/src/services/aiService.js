import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const generateAIResponse = async (prompt) => {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    console.log("GEMINI_API_KEY:", GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(endpoint, {
      contents: [{ parts: [{ text: prompt }] }],
    });

    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return aiText || "No response from AI.";
  } catch (error) {
    console.error("Error generating AI response:", error.message);
    return "Error generating AI response.";
  }
};
