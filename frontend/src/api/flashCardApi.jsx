import axiosInstance from "./axiosInstance";

// GET all flashcards
export const fetchFlashcards = async () => {
  const res = await axiosInstance.get("/flashcards");
  return res.data;
};

// CREATE flashcard
export const createFlashcard = async (data) => {
  const res = await axiosInstance.post("/flashcards", data);
  return res.data;
};

// UPDATE flashcard
export const updateFlashcard = async (id, data) => {
  const res = await axiosInstance.put(`/flashcards/${id}`, data);
  return res.data;
};

// DELETE flashcard
export const deleteFlashcard = async (id) => {
  const res = await axiosInstance.delete(`/flashcards/${id}`);
  return res.data;
};

// 🤖 AI generate flashcards
export const generateAIFlashcards = async (payload) => {
  const res = await axiosInstance.post("/flashcards/generate-ai", payload);
  return res.data;
};

export const fetchFlashcardById = async (id) => {
  const res = await axiosInstance.get(`/flashcards/${id}`);
  return res.data;
};
