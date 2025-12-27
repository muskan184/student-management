import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Send, Trash2, Edit } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { fetchQuestionById } from "../../../api/questionApi";
import {
  addAnswer,
  deleteAnswer,
  fetchAnswers,
  updateAnswer,
} from "../../../api/answerApi";

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

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const q = await fetchQuestionById(id);
      setQuestion(q.question);
      setAnswers(q.answers || []); // backend se answers hi aa rahe hain
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
    } catch (err) {
      toast.error("Failed to add answer");
      console.error(err);
    }
  };

  /* ================= UPDATE ANSWER ================= */
  const handleAnswerUpdate = async (answerId) => {
    if (!editAnswerText.trim()) return toast.error("Answer cannot be empty");

    try {
      await updateAnswer(answerId, { content: editAnswerText });
      toast.success("Answer updated");
      setEditingAnswerId(null);
      setEditAnswerText("");
      loadData();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  /* ================= DELETE ANSWER ================= */
  const handleAnswerDelete = async (answerId) => {
    if (!window.confirm("Delete this answer?")) return;

    try {
      await deleteAnswer(answerId);
      toast.success("Answer deleted");
      loadData();
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!question) return null;

  /* ================= UI ================= */
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
        <p className="text-gray-700">{question.text || "No question text"}</p>
      </div>

      {/* ANSWERS */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-lg">Answers</h3>

        {answers.length === 0 ? (
          <p className="text-gray-500">No answers yet</p>
        ) : (
          answers.map((ans) => {
            const isOwner =
              ans.answeredBy?._id?.toString() === user?._id?.toString() &&
              ans.role !== "AI";

            return (
              <div key={ans._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm text-gray-500">
                    {ans.answeredBy?.name ||
                      (ans.role === "AI" ? "AI" : "Anonymous")}
                  </p>

                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingAnswerId(ans._id);
                          setEditAnswerText(ans.content);
                        }}
                        className="text-blue-600"
                      >
                        <Edit size={14} />
                      </button>

                      <button
                        onClick={() => handleAnswerDelete(ans._id)}
                        className="text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {editingAnswerId === ans._id ? (
                  <>
                    <textarea
                      value={editAnswerText}
                      onChange={(e) => setEditAnswerText(e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                    <button
                      onClick={() => handleAnswerUpdate(ans._id)}
                      className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </>
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
