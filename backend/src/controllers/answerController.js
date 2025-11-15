import Answer from "../models/Answer.js";

export const addAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;

    if (!content)
      return res.status(400).json({ message: "Answer content is required" });

    const answer = await Answer.create({
      questionId,
      answeredBy: req.user._id,
      role: "student",
      content,
    });
    res
      .status(201)
      .json({ message: "Answer added successfully", answerId: answer._id });
  } catch (error) {
    console.error("Error adding answer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.find({ questionId })
      .populate("answeredBy", "name role")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, answers });
  } catch (error) {
    console.error("Error fetching answers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
