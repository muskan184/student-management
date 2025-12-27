import { useState } from "react";
import MessageBubble from "./MessageBubble";
import { getAIResponse } from "../../../api/aiApi";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi 👋 I am your AI Tutor. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const aiReply = await getAIResponse(input, currentQuestion);

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: aiReply || "I couldn't understand 😕" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "❌ AI server error" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <MessageBubble key={index} msg={msg} />
        ))}
      </div>

      {/* Input */}
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
          className="bg-green-600 hover:bg-green-700 text-white px-4 rounded"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
