import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { fetchQuestions } from "../../../api/forumApi";

export default function ForumHome() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const res = await fetchQuestions();
      setQuestions(res.questions);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Q/A Forum</h1>

        <button
          onClick={() => navigate("/student/questions/ask")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus size={18} /> Ask Question
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-500">No questions yet</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q._id}
              onClick={() => navigate(`/student/forum/${q._id}`)}
              className="bg-white p-4 rounded shadow cursor-pointer"
            >
              <h3 className="font-medium">{q.text}</h3>
              <p className="text-xs text-gray-500">
                Asked by: {q.askedBy?.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
