import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  cards: [
    {
      question: String,
      answer: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAIgenerated: {
    type: Boolean,
    default: false,
  },
});

const Flash = mongoose.model("Flashcard", flashcardSchema);
export default Flash;
