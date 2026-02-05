import Chat from "../models/Chat.js";

export const createNewChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      userId: req.user._id, // 🔥 REQUIRED
      messages: [],
    });

    res.status(201).json({
      success: true,
      chatId: chat._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create new chat",
      error: error.message,
    });
  }
};

export const saveChatMessage = async (req, res) => {
  try {
    const { chatId, sender, text } = req.body;

    if (!chatId || !sender || !text) {
      return res.status(400).json({
        success: false,
        message: "chatId, sender and text are required",
      });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // 🔥 SET TITLE ONLY ON FIRST USER MESSAGE
    if (sender === "user" && chat.messages.length === 0) {
      chat.title = text.length > 30 ? text.slice(0, 30) + "..." : text;
    }
    console.log("sender: ",sender, "  chat.messaes : ", chat.messages)
    console.log("chat title: ", chat.title);

    chat.messages.push({ sender, text });
    await chat.save();

    res.status(200).json({
      success: true,
      message: "Message saved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save message",
      error: error.message,
    });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      messages: chat.messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
      error: error.message,
    });
  }
};

export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select("_id title updatedAt");

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
      error: error.message,
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    await Chat.findOneAndDelete({
      _id: req.params.chatId,
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Chat deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
      error: error.message,
    });
  }
};
