import Flash from "../models/Flashcard.js";

// ➕ Create Flashcard
export const createFlashcard = async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newFlashcard = new Flash({
      user: req.user.id,
      question,
      answer,
      category,
    });

    await newFlashcard.save();

    res.status(201).json({
      message: "Flashcard created successfully",
      flashcard: newFlashcard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating flashcard",
      error: error.message,
    });
  }
};

// 📖 Get all flashcards
export const getFlashcards = async (req, res) => {
  try {
    const flashcards = await Flash.find({ user: req.user.id });
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching flashcards",
      error: error.message,
    });
  }
};

// ✏️ Update flashcard
export const updateFlashcard = async (req, res) => {
  try {
    const flashcard = await Flash.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    res.status(200).json({
      message: "Flashcard updated successfully",
      flashcard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating flashcard",
      error: error.message,
    });
  }
};

// ❌ Delete flashcard
export const deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flash.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!flashcard) {
      return res.status(404).json({ message: "Flashcard not found" });
    }

    res.status(200).json({ message: "Flashcard deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting flashcard",
      error: error.message,
    });
  }
};
