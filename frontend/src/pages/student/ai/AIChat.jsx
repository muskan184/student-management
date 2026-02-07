import { useEffect, useRef, useState, useCallback } from "react";
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef(null);
  
  // Use a ref to track if we're currently sending a message
  const isSendingRef = useRef(false);

  // 🔹 Load ALL chats on page load
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const res = await getAllChats();
      setChats(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load chats", err);
      setChats([]);
    }
  };

  // 🔹 Load messages when chat changes
  useEffect(() => {
    // Skip if we're currently sending a message
    if (isSendingRef.current) {
      return;
    }

    if (!activeChatId) {
      setMessages([]);
      setIsInitialLoad(false);
      return;
    }

    const loadChat = async () => {
      try {
        const res = await getChatById(activeChatId);
  
        const chatMessages = Array.isArray(res?.messages) ? res.messages : [];
        
        setMessages(chatMessages);
        
        setIsInitialLoad(false);
      } catch (err) {
        console.error("Failed to load chat", err);
        setMessages([]);
        setIsInitialLoad(false);
      }
    };

    setIsInitialLoad(true);
    loadChat();
  }, [activeChatId]);

  // 🔹 Auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!input.trim() || loading || isSendingRef.current) return;

    const userText = input;
    setInput("");
    setLoading(true);
    isSendingRef.current = true;

    let currentChatId = activeChatId;
    let createdNewChat = false;
    
    // If no active chat, create a new one first
    if (!currentChatId) {
      try {
        const res = await createNewChat();
        console.log("Created new chat:", res);
        currentChatId = res?.chatId || res?._id;
        createdNewChat = true;
        
        // Add to chats list
        const newChat = {
          _id: currentChatId,
          title: "New Chat",
        };
        setChats((prev) => [newChat, ...prev]);
      } catch (err) {
        console.error("Failed to create chat", err);
        setLoading(false);
        isSendingRef.current = false;
        return;
      }
    }

    // Create user message object
    const userMsg = { 
      sender: "user", 
      text: userText,
      timestamp: new Date().toISOString(),
      _id: `temp-user-${Date.now()}` // Temporary ID
    };

    // Add user message to state immediately
    setMessages((prev) => {
      const updatedMessages = [...prev, userMsg];
      return updatedMessages;
    });

    // Save user message to backend
    await saveChatMessage(currentChatId, "user", userText);

    try {
      // Get AI response
      const aiReply = await getAIResponse(userText);

      const aiMsg = {
        sender: "ai",
        text: aiReply || "🤔 I couldn't understand that.",
        timestamp: new Date().toISOString(),
        _id: `temp-ai-${Date.now()}` // Temporary ID
      };

      // Add AI message to state
      setMessages((prev) => {
        const updatedMessages = [...prev, aiMsg];
        return updatedMessages;
      });

      // Save AI message to backend
      await saveChatMessage(currentChatId, "ai", aiMsg.text);

      // Update chat title if it's a new chat
      if (createdNewChat) {
        const title = userText.length > 30 
          ? userText.substring(0, 30) + "..."
          : userText;
        
        setChats((prev) => 
          prev.map(chat => 
            chat._id === currentChatId
              ? { ...chat, title }
              : chat
          )
        );
        
        // Now set the active chat ID AFTER we've added messages
        setActiveChatId(currentChatId);
      }

      // Refresh chats list
      await loadChats();
      
      // After everything is done, trigger a reload of messages from backend
      // to get the permanent message IDs
      setTimeout(async () => {
        try {
          const res = await getChatById(currentChatId);
          const chatMessages = Array.isArray(res?.messages) ? res.messages : [];
          setMessages(chatMessages);
        } catch (err) {
          console.error("Failed to refresh messages:", err);
        }
      }, 500);
      
    } catch (err) {
      console.error("Error getting AI response:", err);
      
      // Add error message to UI
      const errorMsg = {
        sender: "ai",
        text: "❌ AI server error. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true,
        _id: `temp-error-${Date.now()}`
      };
      
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  };

  // 🔹 New chat
  const handleNewChat = async () => {
    try {
      const res = await createNewChat();
      
      const newChat = {
        _id: res.chatId || res._id,
        title: "New Chat",
      };

      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat._id);
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
          {isInitialLoad && activeChatId ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg mb-2">Start a conversation with AI</p>
              <p className="text-sm">Ask anything you'd like!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble 
                key={msg._id || `${msg.sender}-${i}-${msg.timestamp}`} 
                msg={msg} 
              />
            ))
          )}
          <div ref={messagesEndRef} />
          
          {/* Loading indicator when waiting for AI response */}
          {loading && messages.length > 0 && (
            <div className="flex items-center space-x-2 p-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-300"></div>
            </div>
          )}
        </div>

        {/* ✍️ Input */}
        <div className="border-t bg-white p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask AI..."
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`px-4 rounded text-white ${
              loading || !input.trim()
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