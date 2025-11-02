import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

console.log("ENV LOADED:", process.env.GEMINI_API_KEY ? "YES" : "NO");
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
