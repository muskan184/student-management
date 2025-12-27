import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../../api/questionApi";

export default function TeacherQuestions() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchQuestions();

        console.log("API 👉", res);

        // ✅ Correct extraction
        setQuestions(res.questions);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">👨‍🏫 Student Questions</h1>

      {questions.length === 0 && (
        <p className="text-gray-500">No questions found</p>
      )}

      {questions.map((q) => (
        <div
          key={q._id}
          className="bg-white p-4 rounded shadow mb-3 flex justify-between items-center"
        >
          <div>
            <h2 className="font-semibold">{q.text}</h2>
          </div>

          <button
            onClick={() => navigate(`/teacher/question/${q._id}`)}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            Open
          </button>
        </div>
      ))}
    </div>
  );
}
