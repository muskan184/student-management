import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import genAI from "../config/openaiConfig.js";
import { sendGlobalNotification } from "../utils/sendNotification.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

/* ================= CREATE QUESTION (already done) ================= */
export const createQuestion = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Question text is required" });
    }

    const question = await Question.create({
      text,
      askedBy: req.user._id,
    });

    // AI Answer
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `Provide a detailed answer to the following question:\n\n${text}`;
    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    await Answer.create({
      questionId: question._id,
      role: "AI",
      content: aiText,
    });

    // await sendGlobalNotification({
    //   title: "New Question",
    //   message: `${req.user.name} posted a new question`,
    //   link: `/qa/${question._id}`,
    //   actorId: req.user._id,
    //   type: "question",
    //   questionId: question._id,
    // });
    const users = await User.find({
      _id: { $ne: req.user._id },
    });
    const notifications = users.map((u) => ({
      user: u._id,
      title: "new question",
      message: `${req.user.name} posted a new question`,
      type: "question",
      questionId: question._id,
      isRead: false,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Question created",
      questionId: question._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/* ================= GET ALL QUESTIONS ================= */
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("askedBy", "name role profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GET SINGLE QUESTION ================= */
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "askedBy",
      "name role _id"
    );

    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const answers = await Answer.find({ questionId: question._id })
      .populate("answeredBy")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      question, // 👈 question object
      answers, // 👈 answers array
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE QUESTION ================= */
export const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id; // ✅ URL se ID le rahe hai
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Only the user who asked the question can delete
    if (question.askedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete all answers related to this question
    await Answer.deleteMany({ questionId: question._id });
    await question.deleteOne();

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE QUESTION ================= */
export const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id; // ✅ URL se ID le rahe hai
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Question text is required" });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Only the user who asked the question can update
    if (question.askedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    question.text = text;
    await question.save();

    res
      .status(200)
      .json({ message: "Question updated successfully", question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
