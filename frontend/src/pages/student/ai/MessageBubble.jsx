export default function MessageBubble({ msg }) {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
          isUser
            ? "bg-green-600 text-white rounded-br-none"
            : "bg-white border rounded-bl-none"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}
