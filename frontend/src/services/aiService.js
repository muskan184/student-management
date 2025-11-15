import api from "./api";

export const getAIResponse = async (prompt) => {
  try {
    const response = await api.post("/aiResponse/generate", { prompt });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};
