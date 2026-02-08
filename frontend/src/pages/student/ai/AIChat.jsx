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
import {
  Send,
  Bot,
  User,
  Sparkles,
  Clock,
  Brain,
  Zap,
  Shield,
  Download,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const isSendingRef = useRef(false);

  // Suggested prompts
  const suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Write a Python function to reverse a string",
    "How to improve my productivity?",
    "Give me a recipe for vegan lasagna",
    "What are the latest trends in AI?",
  ];

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

  useEffect(() => {
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

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || isSendingRef.current) return;

    const userText = input;
    setInput("");
    setLoading(true);
    isSendingRef.current = true;

    let currentChatId = activeChatId;
    let createdNewChat = false;

    if (!currentChatId) {
      try {
        const res = await createNewChat();
        currentChatId = res?.chatId || res?._id;
        createdNewChat = true;

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

    const userMsg = {
      sender: "user",
      text: userText,
      timestamp: new Date().toISOString(),
      _id: `temp-user-${Date.now()}`,
    };

    setMessages((prev) => [...prev, userMsg]);
    await saveChatMessage(currentChatId, "user", userText);

    try {
      setIsTyping(true);
      const aiReply = await getAIResponse(userText);

      // Simulate typing delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsTyping(false);

      const aiMsg = {
        sender: "ai",
        text: aiReply || "🤔 I couldn't understand that.",
        timestamp: new Date().toISOString(),
        _id: `temp-ai-${Date.now()}`,
      };

      setMessages((prev) => [...prev, aiMsg]);
      await saveChatMessage(currentChatId, "ai", aiMsg.text);

      if (createdNewChat) {
        const title =
          userText.length > 30 ? userText.substring(0, 30) + "..." : userText;

        setChats((prev) =>
          prev.map((chat) =>
            chat._id === currentChatId ? { ...chat, title } : chat,
          ),
        );
        setActiveChatId(currentChatId);
      }

      await loadChats();

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
      setIsTyping(false);

      const errorMsg = {
        sender: "ai",
        text: "❌ AI server error. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true,
        _id: `temp-error-${Date.now()}`,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      isSendingRef.current = false;
    }
  };

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <ChatSidebar
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        onNewChat={handleNewChat}
        chats={chats}
        setChats={setChats}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  AI Assistant
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span>Online</span>
                  </div>
                  <span>•</span>
                  <span>Powered by GPT-4</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export Chat</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isInitialLoad && activeChatId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mb-6">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                How can I help you today?
              </h2>
              <p className="text-gray-600 mb-8">
                Ask me anything. I'm here to assist with your questions, ideas,
                and tasks.
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 w-full">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Capabilities */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Bot className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Code Generation
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Creative Writing
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Problem Solving
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Brain className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Learning</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full space-y-6">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg._id || `${msg.sender}-${i}-${msg.timestamp}`}
                  msg={msg}
                />
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message AI Assistant..."
                  rows="1"
                  className="w-full pl-12 pr-12 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none placeholder-gray-500"
                  disabled={loading}
                  style={{ minHeight: "56px" }}
                />
                <button
                  onClick={() => setInput("")}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                    !input ? "opacity-0" : "opacity-100"
                  } transition-opacity`}
                >
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                    <span className="text-xs">✕</span>
                  </div>
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`px-6 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  loading || !input.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            {/* Quick Tips */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Press Enter to send</span>
                <span>Shift + Enter for new line</span>
              </div>
              <span>
                AI can make mistakes. Consider checking important information.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
