import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Send, Trash2, Edit, XCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { fetchQuestionById } from "../../../api/questionApi";
import { addAnswer, deleteAnswer, updateAnswer } from "../../../api/answerApi";
import { PiFloppyDisk } from "react-icons/pi";

export default function QuestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentQuestion } = useOutletContext();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editAnswerText, setEditAnswerText] = useState("");

  /* ================= FETCH QUESTION & ANSWERS ================= */
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchQuestionById(id);
      setQuestion(res.question);
      setAnswers(res.answers || []);
    } catch (err) {
      toast.error("Failed to load question");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (question?.text) {
      setCurrentQuestion(question.text);
    }
  }, [question]);

  /* ================= ADD ANSWER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error("Answer cannot be empty");

    try {
      await addAnswer(id, { content });
      toast.success("Answer added");
      setContent("");
      loadData();
    } catch {
      toast.error("Failed to add answer");
    }
  };

  /* ================= UPDATE ANSWER ================= */
  const handleUpdate = async (answerId) => {
    if (!editAnswerText.trim()) return toast.error("Answer cannot be empty");

    try {
      await updateAnswer(answerId, { content: editAnswerText });
      toast.success("Answer updated");
      setEditingAnswerId(null);
      setEditAnswerText("");
      loadData();
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= DELETE ANSWER ================= */
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!question) return null;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border rounded">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-semibold">Question Details</h1>
      </div>

      {/* QUESTION */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h2 className="font-semibold text-lg mb-2">Question</h2>
        <p className="text-gray-700">{question.text}</p>
      </div>

      {/* ANSWERS */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-lg">Answers</h3>

        {answers.length === 0 ? (
          <p className="text-gray-500">No answers yet</p>
        ) : (
          answers.map((ans) => {
            const isOwner =
              ans.answeredBy?._id === user?.id && ans.role !== "AI";

            const isEditing = editingAnswerId === ans._id;

            return (
              <div key={ans._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-500">
                    {ans.answeredBy?.name ||
                      (ans.role === "AI" ? "AI" : "Anonymous")}
                  </p>

                  {isOwner && (
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleUpdate(ans._id)}
                            className="text-green-600"
                          >
                            <PiFloppyDisk size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingAnswerId(null);
                              setEditAnswerText("");
                            }}
                            className="text-gray-500"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingAnswerId(ans._id);
                              setEditAnswerText(ans.content);
                            }}
                            className="text-blue-600"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(ans._id)}
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <textarea
                    value={editAnswerText}
                    onChange={(e) => setEditAnswerText(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">
                    {ans.content}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD ANSWER */}
      <form onSubmit={handleSubmit} className="bg-white p-5 rounded shadow">
        <label className="block mb-2 font-medium">Add your answer</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Write your answer..."
          className="w-full border px-3 py-2 rounded resize-none"
        />

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded"
          >
            <Send size={16} /> Submit
          </button>
        </div>
      </form>
    </div>
  );
}
