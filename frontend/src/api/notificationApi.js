import axiosInstance from "./axiosInstance";

export const fetchMyNotifications = async () => {
  const { data } = await axiosInstance.get("/notifications");
  return data;
};

export const markNotificationRead = async (id) => {
  await axiosInstance.put(`/notifications/${id}/read`);
};
