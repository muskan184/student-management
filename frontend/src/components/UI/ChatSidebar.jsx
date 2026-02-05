import { useEffect } from "react";
import { deleteChat, getAllChats } from "../../api/aiApi";

export default function ChatSidebar({
  activeChatId,
  setActiveChatId,
  onNewChat,
  chats,
  setChats,
}) {
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await getAllChats();
      setChats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load chats", err);
      setChats([]);
    }
  };

  // 🔥 SMART Chat Title (works with ANY backend)
  const getChatTitle = (chat) => {
    let text = "";
    console.log("chat", chat);

    console.log(text);
    if (chat?.prompt) {
      text = chat.prompt;
    } else if (chat?.lastMessage) {
      text = chat.lastMessage;
    } else if (chat?.messages?.length) {
      const firstUserMsg = chat.messages.find((m) => m.sender === "user");
      text = firstUserMsg?.text || "";
    }

    if (!text) return "New Chat";

    const cleanText = text.replace(/[?.!]/g, "");

    return cleanText.length > 30 ? cleanText.slice(0, 30) + "..." : cleanText;
  };

  const handleDelete = async (id) => {
    setChats((prev) => prev.filter((chat) => chat._id !== id));

    if (id === activeChatId) {
      setActiveChatId(null);
    }

    try {
      await deleteChat(id);
    } catch (err) {
      console.error("Delete failed", err);
      loadChats();
    }
  };

  return (
    <div className="w-64 border-r bg-white p-3 flex flex-col">
      <button
        onClick={() => {
          onNewChat();
          loadChats();
        }}
        className="w-full bg-green-600 text-white py-2 rounded mb-3"
      >
        + New Chat
      </button>

      <div className="space-y-2 overflow-y-auto">
        {chats.length === 0 && (
          <p className="text-sm text-gray-400 text-center">No chats yet</p>
        )}

        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setActiveChatId(chat._id)}
            className={`p-2 rounded cursor-pointer flex justify-between items-center ${
              activeChatId === chat._id ? "bg-green-100" : "hover:bg-gray-100"
            }`}
          >
            <span className="text-sm truncate">{getChatTitle(chat)}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(chat._id);
              }}
              className="text-red-500 text-xs hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
