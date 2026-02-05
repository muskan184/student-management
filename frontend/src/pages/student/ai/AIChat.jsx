import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatSidebar from "../../../components/UI/ChatSidebar";

import {
  getAIResponse,
  getChatById,
  saveChatMessage,
  createNewChat,
  getAllChats,
} from "../../../api/aiApi";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const messagesEndRef = useRef(null);

  // 🔹 Load ALL chats on page load
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const res = await getAllChats();
      setChats(Array.isArray(res?.chats) ? res.chats : []);
    } catch (err) {
      console.error("Failed to load chats", err);
      setChats([]);
    }
  };

  // 🔹 Load messages when chat changes
  useEffect(() => {
    if (!activeChatId) return;

    const loadChat = async () => {
      try {
        const res = await getChatById(activeChatId);
        // backend { success, messages }
        setMessages(Array.isArray(res?.messages) ? res.messages : []);
      } catch (err) {
        console.error("Failed to load chat", err);
        setMessages([]);
      }
    };

    loadChat();
  }, [activeChatId]);

  // 🔹 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!input.trim() || loading || !activeChatId) return;

    const userText = input;
    setInput("");
    setLoading(true);

    const userMsg = { sender: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);

    await saveChatMessage(activeChatId, "user", userText);

    try {
      const aiReply = await getAIResponse(userText);

      const aiMsg = {
        sender: "ai",
        text: aiReply || "🤔 I couldn't understand that.",
      };

      setMessages((prev) => [...prev, aiMsg]);
      await saveChatMessage(activeChatId, "ai", aiMsg.text);

      // 🔥 refresh sidebar title after first message
      loadChats();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ AI server error" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 New chat
  const handleNewChat = async () => {
    try {
      const res = await createNewChat();

      const newChat = {
        _id: res.chatId,
        title: "New Chat",
      };

      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(res.chatId);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create chat", err);
    }
  };

  return (
    <div className="flex flex-1 h-full min-h-0">
      {/* 📚 Sidebar */}
      <ChatSidebar
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        onNewChat={handleNewChat}
        chats={chats}
        setChats={setChats}
      />

      {/* 🤖 Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* ✍️ Input */}
        <div className="border-t bg-white p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI..."
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`px-4 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
