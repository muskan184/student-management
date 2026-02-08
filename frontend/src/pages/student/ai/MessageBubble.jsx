import {
  User,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

export default function MessageBubble({ msg }) {
  const isUser = msg.sender === "user";
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    // Here you would typically send feedback to your backend
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`max-w-3xl w-full flex ${
          isUser ? "flex-row-reverse" : "flex-row"
        } items-start space-x-3`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-gradient-to-r from-blue-500 to-indigo-600"
              : "bg-gradient-to-r from-emerald-500 to-teal-600"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`flex-1 min-w-0 ${isUser ? "items-end" : "items-start"}`}
        >
          <div
            className={`rounded-2xl px-5 py-4 ${
              isUser
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-none"
                : "bg-white border border-gray-200 shadow-sm rounded-tl-none"
            }`}
          >
            <div
              className={`prose prose-sm max-w-none ${
                isUser ? "text-white" : "text-gray-800"
              }`}
            >
              {msg.text.split("\n").map((line, i) => (
                <p key={i} className={i > 0 ? "mt-3" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Message Actions */}
          <div
            className={`flex items-center space-x-2 mt-2 ${
              isUser ? "justify-end" : "justify-start"
            } opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            {!isUser && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy"
                >
                  {copied ? (
                    <span className="text-xs text-green-600">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleFeedback("like")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === "like"
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  title="Helpful"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleFeedback("dislike")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === "dislike"
                      ? "text-red-600 bg-red-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                  title="Not helpful"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </>
            )}
            <span
              className={`text-xs ${
                isUser ? "text-blue-400" : "text-gray-500"
              }`}
            >
              {formatTime(msg.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
