import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useOutletContext,
  Link,
} from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Send,
  Trash2,
  Edit,
  XCircle,
  User,
  Bot,
  Calendar,
  Check,
} from "lucide-react";
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

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-slate-600 font-medium text-lg">
            Loading question...
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Fetching the best answers for you
          </p>
        </div>
      </div>
    );

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
      {/* Floating Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-300"
              >
                <div className="relative">
                  <ArrowLeft
                    size={18}
                    className="text-slate-700 group-hover:text-blue-600 transition-colors"
                  />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                  Back
                </span>
              </button>

              <div className="ml-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Question Details
                </h1>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <Calendar size={14} />
                  Exploring knowledge • {answers.length} answers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Question Card - Elegant Design */}
        <div className="relative mb-12">
          <div className="absolute -top-4 left-6 z-10">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="font-semibold text-sm">QUESTION</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
            <div className="p-8 pt-12">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl flex items-center justify-center border border-blue-100">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Q</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
                      {question.text}
                    </h2>
                    <p className="text-slate-500 mt-3 text-sm flex items-center gap-2">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium">
                        Needs Answer
                      </span>
                      <span>•</span>
                      <span>Help others by sharing your knowledge</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">
                        General Question
                      </span>
                    </div>
                    <div className="px-4 py-1.5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                      <span className="text-sm font-medium text-emerald-700">
                        Education
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Community Answers
              </h3>
              <p className="text-slate-500">
                Insights from teachers and AI assistant
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white border border-slate-300 rounded-xl px-4 py-2.5">
                <span className="text-sm font-medium text-slate-700">
                  Total:{" "}
                  <span className="text-blue-600 font-bold">
                    {answers.length}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {answers.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-slate-50/50 rounded-3xl border-2 border-dashed border-slate-300 p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="text-blue-400" size={36} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">
                No Answers Yet
              </h4>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                This question is waiting for your expertise. Be the first to
                share your knowledge and help others learn.
              </p>
              <button
                onClick={() => document.querySelector("textarea")?.focus()}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Send size={18} />
                Write First Answer
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {answers.map((ans, index) => {
                const isOwner =
                  ans.answeredBy?._id === user?.id && ans.role !== "AI";
                const isEditing = editingAnswerId === ans._id;

                return (
                  <div
                    key={ans?._id}
                    className={`bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                      index === 0
                        ? "border-blue-200 ring-1 ring-blue-100"
                        : "border-slate-200"
                    }`}
                  >
                    {/* Header - Premium Design */}
                    <div className="p-6 border-b border-slate-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            {ans?.role !== "AI" ? (
                              <div className="relative">
                                <img
                                  src={
                                    ans?.answeredBy?.profilePic ||
                                    "/default-avatar.png"
                                  }
                                  alt="User avatar"
                                  className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-lg"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-1 rounded-full">
                                  <User size={10} />
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                                  <Bot className="text-white" size={20} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white p-1 rounded-full">
                                  <Check size={10} />
                                </div>
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-slate-900 text-lg">
                                {ans.answeredBy?.name ||
                                  (ans.role === "AI"
                                    ? "AI Assistant"
                                    : "Anonymous")}
                              </h4>
                              {ans.role === "AI" && (
                                <span className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                                  AI VERIFIED
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-sm flex items-center gap-2">
                              <span>Answered</span>
                              <span>•</span>
                              <span className="text-slate-400">Just now</span>
                            </p>
                          </div>
                        </div>

                        {isOwner && (
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => handleUpdate(ans._id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:shadow-md transition-all"
                                  title="Save"
                                >
                                  <PiFloppyDisk size={18} />
                                  <span className="text-sm font-medium">
                                    Save
                                  </span>
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingAnswerId(null);
                                    setEditAnswerText("");
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                  title="Cancel"
                                >
                                  <XCircle size={18} />
                                  <span className="text-sm font-medium">
                                    Cancel
                                  </span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingAnswerId(ans._id);
                                    setEditAnswerText(ans.content);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg hover:shadow-sm transition-all"
                                  title="Edit"
                                >
                                  <Edit size={18} />
                                  <span className="text-sm font-medium">
                                    Edit
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleDelete(ans._id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 rounded-lg hover:shadow-sm transition-all"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                  <span className="text-sm font-medium">
                                    Delete
                                  </span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content - Premium Design */}
                    <div className="p-6">
                      {isEditing ? (
                        <div className="space-y-4">
                          <textarea
                            value={editAnswerText}
                            onChange={(e) => setEditAnswerText(e.target.value)}
                            rows={6}
                            className="w-full border-2 border-slate-300 rounded-xl p-5 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-base leading-relaxed"
                            placeholder="Edit your answer..."
                          />
                          <div className="flex justify-end">
                            <div className="text-sm text-slate-500">
                              {editAnswerText.length}/2000 characters
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></div>
                          <div className="pl-6">
                            <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
                              {ans.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Answer - Premium Design */}
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Share Your Knowledge
            </h3>
            <p className="text-slate-500">
              Provide a clear and helpful answer to this question
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-slate-700 font-semibold text-lg">
                    Your Answer
                  </label>
                  <span className="text-sm text-slate-500">
                    {content.length}/2000 characters
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Write your detailed answer here. Be clear, concise, and helpful. You can use markdown formatting..."
                  className="w-full border-2 border-slate-300 rounded-2xl p-6 text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all text-base leading-relaxed resize-none bg-white"
                  maxLength={2000}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    <span>Be respectful</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                    <span>Provide sources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    <span>Clear explanation</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!content.trim()}
                  className={`relative overflow-hidden group flex items-center gap-4 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    content.trim()
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-2xl hover:scale-105"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    <Send size={20} />
                    <span className="text-lg">Post Answer</span>
                  </div>
                  {content.trim() && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const MiniCard = ({ teacher, isFollowing, onFollow }) => {
  if (!teacher) return null;

  return (
    <div className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={teacher.profilePic || "/default-avatar.png"}
              alt={teacher.name}
              className="w-16 h-16 rounded-xl object-cover border-4 border-white/20"
            />
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white p-1.5 rounded-full shadow-lg">
              <Check size={10} />
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white text-lg">{teacher.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-white/20 text-white/90 text-xs font-medium rounded-full backdrop-blur-sm">
                {teacher.role}
              </span>
              {teacher.subject && (
                <span className="px-2 py-0.5 bg-white/20 text-white/90 text-xs font-medium rounded-full backdrop-blur-sm">
                  {teacher.subject}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">
              {teacher.followers?.length || 0}
            </div>
            <div className="text-xs text-blue-600 font-medium mt-1">
              Followers
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {teacher.following?.length || 0}
            </div>
            <div className="text-xs text-emerald-600 font-medium mt-1">
              Following
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-700">
              {teacher.experience || 0}
            </div>
            <div className="text-xs text-amber-600 font-medium mt-1">
              Years Exp
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onFollow}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              isFollowing
                ? "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:shadow-md"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {isFollowing ? "Following" : "Follow Teacher"}
          </button>

          <Link
            to={`/profile/${teacher._id}`}
            className="block w-full py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold text-center hover:bg-blue-50 transition-all duration-300 hover:scale-[1.02]"
          >
            View Full Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
