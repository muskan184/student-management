import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
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
