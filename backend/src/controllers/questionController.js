import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import genAI from "../config/openaiConfig.js";

export const createQuestion = async (req, res) => {
  try {
    console.log("createQuestion called");

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Question text is required" });
    }

    // Save question in DB
    const question = await Question.create({
      text,
      askedBy: req.user._id,
    });

    // ------------------------
    // Generate AI Answer (Gemini)
    // ------------------------
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `Provide a detailed answer to the following question:\n\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    // Save AI answer in DB
    await Answer.create({
      questionId: question._id,
      role: "AI",
      content: aiText,
    });

    return res.status(201).json({
      success: true,
      message: "Question created and answered by AI",
      questionId: question._id,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
