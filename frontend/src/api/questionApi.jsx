import axios from "./axiosInstance";

/* Create */
export const createQuestion = async (data) => {
  const res = await axios.post("/questions/create", data);
  return res.data;
};

/* All */
export const fetchQuestions = async () => {
  const res = await axios.get("/questions");
  return res.data;
};

/* Single */
export const fetchQuestionById = async (id) => {
  const res = await axios.get(`/questions/${id}`);
  return res.data;
};


export const deleteQuestion = async (id) => {
  const res = await axios.delete(`/questions/${id}`);
  return res.data;
};


export const updateQuestion = async (id, data) => {
  const res = await axios.put(`/questions/${id}`, data);
  return res.data;
};
