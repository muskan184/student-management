import { useState } from "react";
import { deleteChat, getAllChats } from "../../api/aiApi";
import {
  MessageSquare,
  Plus,
  Trash2,
  Clock,
  Search,
  Settings,
} from "lucide-react";

export default function ChatSidebar({
  activeChatId,
  setActiveChatId,
  onNewChat,
  chats,
  setChats,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔄 reload chats (fallback)
  const loadChats = async () => {
    try {
      const data = await getAllChats();
      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load chats", err);
      setChats([]);
    }
  };

  // 🏷️ chat title logic
  const getChatTitle = (chat) => {
    if (chat?.title && chat.title !== "New Chat") return chat.title;

    let text =
      chat?.prompt ||
      chat?.lastMessage ||
      chat?.messages?.find((m) => m.sender === "user")?.text ||
      chat?.firstMessage ||
      "";

    if (!text.trim()) return "New Chat";

    const cleanText = text.replace(/[?.!]/g, "").trim();
    return cleanText.length > 30 ? cleanText.slice(0, 30) + "..." : cleanText;
  };

  // 🕒 date formatter
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // 🗑️ delete chat
  const handleDelete = async (e, id) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?",
    );
    if (!confirmDelete) return;

    const previousChats = [...chats];

    setChats((prev) => prev.filter((chat) => chat._id !== id));

    if (id === activeChatId) {
      const otherChat = chats.find((chat) => chat._id !== id);
      setActiveChatId(otherChat ? otherChat._id : null);
    }

    try {
      await deleteChat(id);
    } catch (err) {
      console.error("Delete failed", err);
      setChats(previousChats);
      loadChats();
    }
  };

  // 🔍 search filter
  const filteredChats = chats.filter(
    (chat) =>
      getChatTitle(chat).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chat.lastMessage &&
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="w-80 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white flex flex-col h-screen">
      {/* HEADER */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Chat History</h1>
          <button
            onClick={onNewChat}
            className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            No conversations yet
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setActiveChatId(chat._id)}
              className={`group p-4 rounded-xl cursor-pointer transition-all flex flex-col ${
                activeChatId === chat._id
                  ? "bg-emerald-50 border border-emerald-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activeChatId === chat._id
                        ? "bg-emerald-500"
                        : "bg-gray-100"
                    }`}
                  >
                    <MessageSquare
                      className={`w-4 h-4 ${
                        activeChatId === chat._id
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    />
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-[160px]">
                      {getChatTitle(chat)}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(chat.createdAt || chat.timestamp)}
                    </p>
                  </div>
                </div>

                {/* DELETE */}
                <button
                  onClick={(e) => handleDelete(e, chat._id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* LAST MESSAGE */}
              {chat.lastMessage && (
                <p className="text-sm text-gray-600 truncate ml-14 mt-1">
                  {chat.lastMessage.length > 50
                    ? chat.lastMessage.slice(0, 50) + "..."
                    : chat.lastMessage}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t flex justify-between text-sm text-gray-600">
        <span>{chats.length} conversations</span>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
