import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Eye } from "lucide-react";
import { fetchQuestions } from "../../../api/questionApi";

export default function QuestionList() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]); // must be array
  const [loading, setLoading] = useState(true);

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions();

      console.log("API Response:", data);

      // 🔥 VERY IMPORTANT FIX
      // Backend is sending: { success, questions }
      // We only store the array
      setQuestions(Array.isArray(data?.questions) ? data.questions : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Q / A Forum</h1>

        <button
          onClick={() => navigate("/student/qa/ask")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus size={18} /> Ask Question
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-500">No questions asked yet</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{q.text}</h3>
                <p className="text-xs text-gray-500">
                  Asked on{" "}
                  {q.createdAt
                    ? new Date(q.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <button
                onClick={() => navigate(`/student/forum/${q._id}`)}
                className="flex items-center gap-1 text-blue-600"
              >
                <Eye size={16} /> View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
