import api from "./axiosInstance";

// 🤖 AI response
export const getAIResponse = async (prompt) => {
  const response = await api.post("/aiResponse/generate", { prompt });
  return response.data.data;
};

// 💾 save message in a specific chat
export const saveChatMessage = async (chatId, sender, text) => {
  await api.post("/chat", {
    chatId,
    sender,
    text,
  });
};

// 📥 get messages of a specific chat
export const getChatById = async (chatId) => {
  const res = await api.get(`/chat/${chatId}`);
  return res.data || [];
};

// 📚 all chats (sidebar history)
export const getAllChats = async () => {
  const res = await api.get("/chat/all");
  return res.data?.chats || [];
};

// ➕ create new chat
export const createNewChat = async () => {
  const res = await api.post("/chat/new");
  return res.data; // { success, chatId }
};

// 🗑 delete chat
export const deleteChat = async (chatId) => {
  await api.delete(`/chat/${chatId}`);
};
