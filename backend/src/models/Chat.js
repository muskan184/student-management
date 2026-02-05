import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔥 NEW FIELD (sidebar keyword)
    title: {
      type: String,
      default: "New Chat",
    },

    messages: [messageSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Chat", chatSchema);
