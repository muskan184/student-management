import mongoose from "mongoose";

const plannerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["study", "work", "personal", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);
const Planner = mongoose.model("Planner", plannerSchema);
export default Planner;
