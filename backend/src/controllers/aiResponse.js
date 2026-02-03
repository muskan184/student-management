import dotenv from "dotenv";
import fs from "fs";
import { createRequire } from "module";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// ✅ Init Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    const file = req.file;

    // ❌ validation
    if (!prompt && !file) {
      return res.status(400).json({
        success: false,
        message: "Please provide a prompt or a file.",
      });
    }

    // ❌ API key check
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key missing",
      });
    }

    let extractedText = "";

    // 📄 PDF parsing
    if (file) {
      const fileBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(fileBuffer);
      extractedText = data.text;
    }

    // 🧠 STRONG + CLEAN PROMPT
    const finalPrompt = `
You are an AI tutor.
Answer in simple plain text.
No markdown.
No headings.
No bullet points.
Keep response clear and readable.

Question:
${prompt || ""}

${extractedText}
    `;

    // ✅ Correct model
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
    });

    // 🤖 Generate content
    const result = await model.generateContent(finalPrompt);
    const response = result.response;

    let aiText = response.text();

    // 🧹 CLEAN Gemini formatting
    aiText = aiText
      .replace(/\n{3,}/g, "\n\n") // extra new lines
      .replace(/\*\*/g, "") // remove **
      .replace(/###?/g, "") // remove ###
      .trim();

    return res.status(200).json({
      success: true,
      message: "AI response generated successfully ✅",
      data: aiText,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error.message);

    // ⏳ Busy handling
    if (error.message.includes("503")) {
      return res.status(503).json({
        success: false,
        message: "AI is busy right now. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
      error: error.message,
    });
  }
};
