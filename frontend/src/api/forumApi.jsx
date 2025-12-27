import axiosInstance from "./axiosInstance";

export const createQuestion = async (text) => {
  const res = await axiosInstance.post("/questions/create", { text });
  return res.data;
};

// Get Answers of Question
export const fetchAnswers = async (questionId) => {
  const res = await axiosInstance.get(`/answers/${questionId}`);
  return res.data.answers;
};

// Add Answer
export const addAnswer = async (questionId, content) => {
  const res = await axiosInstance.post(`/answers/${questionId}`, {
    content,
  });
  return res.data;
};

export const fetchQuestions = async () => {
  const res = await axiosInstance.get("/questions/");
  return res.data;
};
