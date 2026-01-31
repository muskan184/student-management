import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/authRoutes.js";
import noteRouter from "./routes/notesRoutes.js";
import plannerRouter from "./routes/plannerRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import questionRouter from "./routes/questionRoutes.js";
import answerRouter from "./routes/answerRoutes.js";
import aiResponseRouter from "./routes/aiResponseRoutes.js";
import flashRouter from "./routes/flashcardRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import path from "path";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/auth", userRouter);
app.use("/api/notes", noteRouter);
app.use("/api/planner", plannerRouter);
app.use("/api/ai", aiRouter);
app.use("/api/questions", questionRouter);
app.use("/api/flashcards", flashRouter);
app.use("/api/answers", answerRouter);
app.use("/api/aiResponse", aiResponseRouter);
app.use("/api/notifications", notificationRouter);

connectDB();

export default app;
