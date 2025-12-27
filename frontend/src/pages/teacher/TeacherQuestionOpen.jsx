import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, Star } from "lucide-react";

import { fetchQuestionById } from "../../api/questionApi";
import {
  fetchAnswers,
  addAnswer,
  deleteAnswer,
  updateAnswer,
  markBestAnswer,
} from "../../api/answerApi";
import { useAuth } from "../../context/AuthContext";

export default function TeacherQuestionOpen() {
  const { id } = useParams();
  const { user } = useAuth();
  console.log("Current User 👉", user?.role);

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const q = await fetchQuestionById(id);
      const a = await fetchAnswers(id);
      setQuestion(q.question);
      setAnswers(a.answers);
    } catch (err) {
      console.error(err);
    }
  };

  // Post or Update Answer
  const submitAnswer = async () => {
    if (!content.trim()) return alert("Answer cannot be empty");

    try {
      setLoading(true);

      if (editId) {
        await updateAnswer(editId, { content });
      } else {
        await addAnswer(id, { content });
      }

      setContent("");
      setEditId(null);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving answer");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (aid) => {
    if (!window.confirm("Delete this answer?")) return;
    await deleteAnswer(aid);
    loadData();
  };

  const handleBest = async (answerId) => {
    try {
      await markBestAnswer(answerId);
      loadData();
    } catch (err) {
      alert("Only teacher can select best answer");
    }
  };

  if (!question) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Question */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h1 className="text-xl font-bold">{question.text}</h1>
        <p className="text-sm text-gray-500">
          Asked by {question.askedBy?.name} ({question.askedBy?.role})
        </p>
      </div>

      {/* Answers */}
      <div className="mb-6">
        <h2 className="text-lg font-semiboldf mb-3">All Answers</h2>

        {answers.length === 0 && (
          <p className="text-gray-500">No answers yet</p>
        )}

        {answers.map((a) => {
          console.log("Answer 👉", a._id);
          const answerUserId =
            typeof a.answeredBy === "string" ? a.answeredBy : a.answeredBy?._id;

          const isOwner = String(answerUserId) === String(user?.id);

          return (
            <div
              key={a._id}
              className={`bg-white p-4 rounded shadow mb-3 relative border-2 ${
                a.isBest ? "border-yellow-400" : "border-transparent"
              }`}
            >
              {a.isBest && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-white px-2 py-1 rounded text-xs">
                  ⭐ Best
                </div>
              )}

              <p className="text-gray-800">{a.content}</p>

              <p className="text-sm text-gray-500 mt-1">
                — {a.answeredBy?.name} ({a.answeredBy?.role})
              </p>

              <div className="flex gap-4 mt-2 items-center">
                {/* Teacher can mark best */}
                {user?.role === "teacher" && (
                  <button
                    onClick={() => handleBest(a._id)}
                    className={`${
                      a.isBest ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    <Star fill={a.isBest ? "gold" : "none"} />
                  </button>
                )}
                {isOwner && (
                  <>
                    <button
                      onClick={() => {
                        setContent(a.content);
                        setEditId(a._id);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(a._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Answer Box */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">
          {editId ? "Edit Your Answer" : "Your Answer"}
        </h3>

        <textarea
          className="w-full border p-3 rounded"
          rows="4"
          placeholder="Write your answer..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={submitAnswer}
          disabled={loading}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update Answer" : "Post Answer"}
        </button>
      </div>
    </div>
  );
}
