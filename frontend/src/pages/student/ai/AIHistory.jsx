import { useNavigate } from "react-router-dom";

export default function AIHistory() {
  const navigate = useNavigate();

  const chats = [
    { id: 1, title: "Stack Interview Doubts" },
    { id: 2, title: "OOPS Concepts" },
    { id: 3, title: "Linked List Help" },
    { id: 4, title: "DBMS Queries" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4 text-xl font-bold">
        🕘 AI Chat History
      </div>

      <div className="p-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/student/ai-chat/${chat.id}`)}
            className="bg-white p-4 mb-3 rounded shadow cursor-pointer hover:bg-blue-50"
          >
            {chat.title}
          </div>
        ))}
      </div>
    </div>
  );
}
