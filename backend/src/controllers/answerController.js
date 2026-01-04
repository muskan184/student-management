import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Question from "../models/Question.js";
import Answer from "../models/Answer.js";
import { sendGlobalNotification } from "../utils/sendNotification.js";

export const addAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    if (!content)
      return res.status(400).json({ message: "Answer content is required" });

    // 1️⃣ Create Answer
    const answer = await Answer.create({
      questionId,
      answeredBy: req.user._id,
      role: req.user.role,
      content,
    });

    // 2️⃣ Get question for message
    const question = await Question.findById(questionId);

    // 3️⃣ Get ALL users except who posted the answer
    const users = await User.find({
      _id: { $ne: req.user._id },
    });

    // 4️⃣ Create notifications for everyone
    const notifications = users.map((u) => ({
      user: u._id,
      title: "New Answer",
      message: `${req.user.name} answered a question`,
      type: "answer",
      questionId,
      answerId: answer._id,
      isRead: false,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Answer added & notifications sent",
      answer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.find({ questionId })
      .populate("answeredBy", "name role profilePic")
      .sort({ createdAt: -1 });
      console.log("Answers: ",answers)
    res.status(200).json({ success: true, answers });
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id; // ✅ URL se ID le rahe hai
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // AI answers cannot be deleted
    if (answer.role === "AI") {
      return res.status(403).json({ message: "AI answers cannot be deleted" });
    }

    // Only the user who created the answer can delete
    if (answer.answeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await answer.deleteOne();
    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE ANSWER =================
export const updateAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Answer content is required" });
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // AI answers cannot be updated
    if (answer.role === "AI") {
      return res.status(403).json({ message: "AI answers cannot be updated" });
    }

    // Only the user who created the answer can update
    if (answer.answeredBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    answer.content = content;
    await answer.save();

    res.status(200).json({ message: "Answer updated successfully", answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markBestAnswer = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log("User Role 👉", req.user.role);

    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teacher can select best answer" });
    }

    const { id } = req.params;
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const questionId = answer.questionId;
    await Answer.updateMany({ questionId }, { $set: { isBest: false } });

    answer.isBest = true;
    await answer.save();

    await sendGlobalNotification({
      title: "Best Answer Selected",
      message: `${req.user.firstName} selected a best answer`,
      link: `/qa/${questionId}`,
      actorId: req.user._id,
      questionId,
    });

    res.status(200).json({
      success: true,
      message: "Best answer selected successfully",
      answer,
    });
  } catch (error) {
    console.error("Mark Best Answer Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
