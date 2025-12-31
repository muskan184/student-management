import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Star, Save, X } from "lucide-react";
import toast from "react-hot-toast";

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
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const q = await fetchQuestionById(id);
      const a = await fetchAnswers(id);
      setQuestion(q.question);
      setAnswers(a.answers);
    } catch {
      toast.error("Failed to load data");
      navigate(-1);
    }
  };

  const submitAnswer = async () => {
    if (!content.trim()) return toast.error("Answer cannot be empty");

    try {
      setLoading(true);
      await addAnswer(id, { content });
      toast.success("Answer posted");
      setContent("");
      loadData();
    } catch {
      toast.error("Failed to post answer");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (answerId) => {
    if (!window.confirm("Delete this answer?")) return;
    try {
      await deleteAnswer(answerId);
      toast.success("Answer deleted");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdate = async (answerId) => {
    if (!editText.trim()) return toast.error("Answer cannot be empty");

    try {
      await updateAnswer(answerId, { content: editText });
      toast.success("Answer updated");
      setEditingId(null);
      setEditText("");
      loadData();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleBest = async (answerId) => {
    try {
      await markBestAnswer(answerId);
      toast.success("Marked as best");
      loadData();
    } catch {
      toast.error("Only teacher can select best");
    }
  };

  if (!question) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* QUESTION */}
      <div className="bg-white p-5 rounded shadow mb-6 flex gap-4">
        <img
          src={question.askedBy?.avatar || "/default-avatar.png"}
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
          onClick={() => navigate(`/profile/${question.askedBy?._id}`)}
        />

        <div>
          <h1 className="text-xl font-bold">{question.text}</h1>
          <p className="text-sm text-gray-500">
            Asked by{" "}
            <span
              onClick={() => navigate(`/profile/${question.askedBy?._id}`)}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {question.askedBy?.name}
            </span>{" "}
            <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 rounded">
              {question.askedBy?.role}
            </span>
          </p>
        </div>
      </div>

      {/* ANSWERS */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">All Answers</h2>

        {answers.map((a) => {
          const answerUserId =
            typeof a.answeredBy === "string" ? a.answeredBy : a.answeredBy?._id;

          const isOwner = String(answerUserId) === String(user?.id);
          const isEditing = editingId === a._id;

          return (
            <div
              key={a._id}
              className={`bg-white p-4 rounded shadow mb-3 border-2 ${
                a.isBest ? "border-yellow-400" : "border-transparent"
              }`}
            >
              {a.isBest && (
                <div className="text-yellow-500 font-semibold mb-2">
                  ⭐ Best Answer
                </div>
              )}

              {/* USER */}
              <div className="flex gap-3 items-center mb-2">
                <img
                  src={a.answeredBy?.avatar || "/default-avatar.png"}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => navigate(`/profile/${a.answeredBy?._id}`)}
                />
                <div>
                  <p
                    onClick={() => navigate(`/profile/${a.answeredBy?._id}`)}
                    className="font-semibold text-blue-600 cursor-pointer"
                  >
                    {a.answeredBy?.name || "AI"}
                  </p>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                    {a.answeredBy?.role || "AI"}
                  </span>
                </div>
              </div>

              {/* TEXT */}
              {isEditing ? (
                <textarea
                  className="w-full border p-2 rounded"
                  rows="3"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-line">{a.content}</p>
              )}

              {/* ACTIONS */}
              <div className="flex gap-4 mt-3 items-center">
                {user?.role === "teacher" && (
                  <button
                    onClick={() => handleBest(a._id)}
                    className={a.isBest ? "text-yellow-400" : "text-gray-400"}
                  >
                    <Star fill={a.isBest ? "gold" : "none"} />
                  </button>
                )}

                {isOwner && (
                  <>
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleUpdate(a._id)}
                          className="text-green-600"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText("");
                          }}
                          className="text-gray-500"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(a._id);
                            setEditText(a.content);
                          }}
                          className="text-blue-600"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD ANSWER */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-2">Your Answer</h3>
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
          Post Answer
        </button>
      </div>
    </div>
  );
}
