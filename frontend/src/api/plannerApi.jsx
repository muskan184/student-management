import axiosInstance from "./axiosInstance";

/* ================= CREATE TASK ================= */
export const createPlanner = async (data) => {
  const res = await axiosInstance.post("/planner", data);
  return res.data;
};

/* ================= GET ALL TASKS ================= */
export const fetchPlanners = async () => {
  const res = await axiosInstance.get("/planner");
  return res.data;
};

/* ================= UPDATE TASK ================= */
export const updatePlanner = async (id, data) => {
  const res = await axiosInstance.put(`/planner/${id}`, data);
  return res.data;
};

/* ================= DELETE TASK ================= */
export const deletePlanner = async (id) => {
  const res = await axiosInstance.delete(`/planner/${id}`);
  return res.data;
};
