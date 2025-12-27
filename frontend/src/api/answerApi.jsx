import axiosInstance from "./axiosInstance";

export const addAnswer = async (questionId, data) => {
  const res = await axiosInstance.post(`/answers/${questionId}`, data);
  return res.data;
};

export const fetchAnswers = async (questionId) => {
  const res = await axiosInstance.get(`/answers/${questionId}`);
  return res.data;
};

export const deleteAnswer = async (id) => {
  const res = await axiosInstance.delete(`/answers/${id}`);
  return res.data;
};

export const updateAnswer = async (id, data) => {
  const res = await axiosInstance.put(`/answers/${id}`, data);
  return res.data;
};

export const markBestAnswer = async (id) => {
  const res = await axiosInstance.put(`/answers/best/${id}`);
  console.log(id);
  return res.data;
};
