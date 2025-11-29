import axiosInstance from "./axiosInstance";

export const signupUser = (data) => {
  const res = axiosInstance.post("/auth/register", data);
  return res.data;
};
export const loginUser = (data) => {
  const res = axiosInstance.post("/auth/login", data);
  return res.data;
};
export const fetchprofile = () => {
  const res = axiosInstance.get("/auth/profile");
  return res.data;
};
export const updateUser = (data) => {
  const res = axiosInstance.put("/auth/update", data);
  return res.data;
};
export const deleteUser = () => {
  const res = axiosInstance.delete("/auth/delete");
  return res.data;
};
export const changePassword = (data) => {
  const res = axiosInstance.put("/auth/change-password", data);
  return res.data;
};
export const followUserApi = (id) => {
  const res = axiosInstance.put(`/auth/follow/${id}`);
  return res.data;
};
export const unfollowUserApi = (id) => {
  const res = axiosInstance.put(`/auth/unfollow/${id}`);
  return res.data;
};
export const getAllUsers = () => {
  const res = axiosInstance.get("/auth/");
  return res.data;
};
export const getUserById = (id) => {
  const res = axiosInstance.get(`/auth/${id}`);
  return res.data;
};
export const getUserSuggestions = () => {
  const res = axiosInstance.get("/auth/suggestions");
  return res.data;
};
export const getFollowers = () => {
  const res = axiosInstance.get("/auth/followers");
  return res.data;
};
export const getFollowing = () => {
  const res = axiosInstance.get("/auth/following");
  return res.data;
};
export const logoutUser = () => {
  const res = axiosInstance.post("/auth/logout");
  return res.data;
};
