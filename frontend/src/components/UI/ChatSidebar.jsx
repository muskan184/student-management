import { deleteChat, getAllChats } from "../../api/aiApi";

export default function ChatSidebar({
  activeChatId,
  setActiveChatId,
  onNewChat,
  chats,
  setChats,
}) {
  // Function to load chats (can be called from parent)
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
    // If chat already has a title and it's not "New Chat", use it
    if (chat?.title && chat.title !== "New Chat") {
      return chat.title;
    }

    // Try to extract title from messages
    let text = "";

    if (chat?.prompt) {
      text = chat.prompt;
    } else if (chat?.lastMessage) {
      text = chat.lastMessage;
    } else if (chat?.messages?.length) {
      // Find first user message
      const firstUserMsg = chat.messages.find((m) => m.sender === "user");
      text = firstUserMsg?.text || "";
    } else if (chat?.firstMessage) {
      text = chat.firstMessage;
    }

    if (!text || text.trim() === "") return "New Chat";

    // Clean and truncate
    const cleanText = text.replace(/[?.!]/g, "").trim();
    return cleanText.length > 30 ? cleanText.slice(0, 30) + "..." : cleanText;
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent triggering chat selection

    // Optimistic update
    const previousChats = [...chats];
    setChats((prev) => prev.filter((chat) => chat._id !== id));

    if (id === activeChatId) {
      // Find another chat to activate, or set to null
      const otherChat = chats.find((chat) => chat._id !== id);
      setActiveChatId(otherChat ? otherChat._id : null);
    }

    try {
      await deleteChat(id);
    } catch (err) {
      console.error("Delete failed", err);
      // Revert on error
      setChats(previousChats);
      // Reload chats from server
      loadChats();
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleNewChatClick = async () => {
    await onNewChat();
    // Optional: reload chats after creating new one
    // await loadChats();
  };

  return (
    <div className="w-64 border-r bg-white p-3 flex flex-col h-full">
      <button
        onClick={handleNewChatClick}
        className="w-full bg-green-600 text-white py-2 rounded mb-3 hover:bg-green-700 transition-colors"
      >
        + New Chat
      </button>

      <div className="space-y-2 overflow-y-auto flex-1">
        {chats.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No chats yet</p>
        )}

        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => handleChatSelect(chat._id)}
            className={`p-3 rounded cursor-pointer flex justify-between items-center group transition-colors ${
              activeChatId === chat._id
                ? "bg-green-100 border border-green-200"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-sm truncate flex-1 mr-2">
              {getChatTitle(chat)}
            </span>

            <button
              onClick={(e) => handleDelete(e, chat._id)}
              className="text-gray-400 text-xs hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete chat"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Optional: Footer with user info or settings */}
      <div className="pt-3 border-t mt-3">
        <p className="text-xs text-gray-500 text-center">
          {chats.length} chat{chats.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
