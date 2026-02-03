import { useEffect, useState } from "react";
import { deleteChat, getAllChats } from "../../api/aiApi";

export default function ChatSidebar({
  activeChatId,
  setActiveChatId,
  onNewChat,
}) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await getAllChats();

      // ✅ ensure array
      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load chats", err);
      setChats([]);
    }
  };

  const handleDelete = async (id) => {
    await deleteChat(id);
    loadChats();

    if (id === activeChatId) {
      setActiveChatId(null);
      localStorage.removeItem("activeChatId");
    }
  };

  return (
    <div className="w-64 border-r bg-white p-3">
      <button
        onClick={onNewChat}
        className="w-full bg-green-600 text-white py-2 rounded mb-3"
      >
        + New Chat
      </button>

      <div className="space-y-2">
        {chats.length === 0 && (
          <p className="text-sm text-gray-400 text-center">No chats yet</p>
        )}

        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => {
              setActiveChatId(chat._id);
              localStorage.setItem("activeChatId", chat._id);
            }}
            className={`p-2 rounded cursor-pointer flex justify-between items-center ${
              activeChatId === chat._id ? "bg-green-100" : "hover:bg-gray-100"
            }`}
          >
            {/* ❌ chat.title removed */}
            <span className="text-sm truncate">AI Chat</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(chat._id);
              }}
              className="text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
