import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import { createRequire } from "module";

dotenv.config();

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const generateAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    const file = req.file;

    if (!prompt && !file) {
      return res.status(400).json({
        success: false,
        message: "Please provide a prompt or a file.",
      });
    }

    let extractedText = "";

    if (file) {
      const fileBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(fileBuffer);
      extractedText = data.text;
    }

    const finalPrompt = prompt
      ? `${prompt}\n\n${extractedText}`
      : extractedText;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    console.log("GEMINI_API_KEY:", GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

    // ✅ Correct endpoint
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await axios.post(endpoint, {
      contents: [{ parts: [{ text: finalPrompt }] }],
    });

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI response generated.";

    return res.status(200).json({
      success: true,
      message: "AI response generated successfully.",
      data: aiText,
    });
  } catch (error) {
    console.error("AI Service Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to connect with Gemini API",
      error: error.message,
    });
  }
};
