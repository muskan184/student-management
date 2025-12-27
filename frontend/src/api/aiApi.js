import api from "./axiosInstance";

export const getAIResponse = async (prompt, question) => {
  try {
    const response = await api.post("/aiResponse/generate", {
      prompt,
      question,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};
