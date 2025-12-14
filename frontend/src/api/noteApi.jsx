import axiosInstance from "./axiosInstance";

export const fetchNotes = async () => {
  const res = await axiosInstance.get("/notes/");
  return res.data;
};

export const fetchNotesById = async (id) => {
  const res = await axiosInstance.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (formData) => {
  const res = await axiosInstance.post("/notes/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateNote = async (id, formData) => {
  const res = await axiosInstance.put(`/notes/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteNote = async (id) => {
  const res = await axiosInstance.delete(`/notes/${id}`);
  return res.data;
};

export const toggleStar = (id) => {
  const res = axiosInstance.patch(`/notes/${id}/star`);
  return res.data;
};

export const togglePin = (id) => {
  const res = axiosInstance.patch(`/notes/${id}/pin`);
  return res.data;
};
