import axiosInstance from "./axiosInstance";

export const signupUser = async (data) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const fetchprofile = async () => {
  const res = await axiosInstance.get("/auth/profile");
  return res.data.user;
};

export const updateUser = async (data) => {
  const res = await axiosInstance.put("/auth/update", data);
  return res.data;
};

export const deleteUser = async () => {
  const res = await axiosInstance.delete("/auth/delete");
  return res.data;
};

export const changePassword = async (data) => {
  const res = await axiosInstance.put("/auth/change-password", data);
  return res.data;
};

export const followUserApi = async (id) => {
  const res = await axiosInstance.put(`/auth/follow/${id}`);
  return res.data;
};

export const unfollowUserApi = async (id) => {
  const res = await axiosInstance.put(`/auth/unfollow/${id}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/auth/");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axiosInstance.get(`/auth/${id}`);
  return res.data;
};

export const getUserSuggestions = async () => {
  const res = await axiosInstance.get("/auth/suggestions");
  return res.data;
};

export const getFollowers = async () => {
  const res = await axiosInstance.get("/auth/followers");
  return res.data;
};

export const getFollowing = async () => {
  const res = await axiosInstance.get("/auth/following");
  return res.data;
};

export const logoutUser = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};
