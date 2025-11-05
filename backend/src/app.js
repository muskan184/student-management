import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/authRoutes.js";
import noteRouter from "./routes/notesRoutes.js";
import plannerRouter from "./routes/plannerRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import aiResponseRouter from "./routes/aiResponseRoutes.js";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/api/notes", noteRouter);
app.use("/api/planner", plannerRouter);
app.use("/api/ai", aiRouter);
app.use("/api/aiResponse", aiResponseRouter);
app.use("/uploads", express.static(path.join("uploads")));
connectDB();

export default app;
