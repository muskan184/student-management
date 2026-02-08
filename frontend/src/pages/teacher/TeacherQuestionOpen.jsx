import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  Star,
  Save,
  X,
  ArrowLeft,
  MessageSquare,
  User,
  Calendar,
  BookOpen,
  Brain,
  Lightbulb,
  ThumbsUp,
  Share2,
  Bookmark,
  Copy,
  Flag,
  MoreVertical,
  Send,
  Clock,
  Award,
  GraduationCap,
  Sparkles,
  Code,
  Calculator,
  Globe,
  Music,
  Filter,
  Search,
  TrendingUp,
  Eye,
  EyeOff,
  Download,
  CheckCircle,
  AlertCircle,
  Hash,
  Users,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

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
  const [loadingPage, setLoadingPage] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, best, teacher, student
  const [sortBy, setSortBy] = useState("newest");
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoadingPage(true);
      const [q, a] = await Promise.all([
        fetchQuestionById(id),
        fetchAnswers(id),
      ]);
      setQuestion(q.question);
      setAnswers(a.answers || []);

      toast.success(
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <span>Question and answers loaded successfully 📚</span>
        </div>,
        {
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#3b82f6",
            color: "#fff",
          },
        },
      );
    } catch {
      toast.error("Failed to load question data", {
        icon: "❌",
      });
      navigate(-1);
    } finally {
      setLoadingPage(false);
    }
  };

  const submitAnswer = async () => {
    if (!content.trim()) {
      toast.error("Please write an answer before submitting", {
        icon: "📝",
      });
      return;
    }

    try {
      setLoading(true);
      await addAnswer(id, {
        content,
        metadata: {
          timestamp: new Date().toISOString(),
          formatted: true,
        },
      });

      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>Answer posted successfully! 🎯</span>
        </div>,
        {
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#10b981",
            color: "#fff",
          },
        },
      );

      setContent("");
      loadData();
    } catch {
      toast.error("Failed to post answer", {
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (answerId) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;

    try {
      await deleteAnswer(answerId);
      toast.success("Answer deleted successfully", {
        icon: "🗑️",
      });
      loadData();
    } catch {
      toast.error("Failed to delete answer", {
        icon: "❌",
      });
    }
  };

  const handleUpdate = async (answerId) => {
    if (!editText.trim()) {
      toast.error("Answer cannot be empty", {
        icon: "⚠️",
      });
      return;
    }

    try {
      await updateAnswer(answerId, { content: editText });
      toast.success("Answer updated successfully", {
        icon: "✏️",
      });
      setEditingId(null);
      setEditText("");
      loadData();
    } catch {
      toast.error("Failed to update answer", {
        icon: "❌",
      });
    }
  };

  const handleBest = async (answerId) => {
    try {
      await markBestAnswer(answerId);
      toast.success(
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <span>Marked as best answer! 🏆</span>
        </div>,
        {
          duration: 3000,
        },
      );
      loadData();
    } catch {
      toast.error("Only teacher can select best answer", {
        icon: "👨‍🏫",
      });
    }
  };

  const filteredAnswers = answers
    .filter((answer) => {
      if (activeTab === "best") return answer.isBest;
      if (activeTab === "teacher") return answer.answeredBy?.role === "teacher";
      if (activeTab === "student") return answer.answeredBy?.role === "student";
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "best") return (b.likes || 0) - (a.likes || 0);
      return 0;
    });

  const bestAnswer = answers.find((a) => a.isBest);
  const teacherAnswers = answers.filter(
    (a) => a.answeredBy?.role === "teacher",
  ).length;
  const studentAnswers = answers.filter(
    (a) => a.answeredBy?.role === "student",
  ).length;
  const aiAnswers = answers.filter((a) => a.role === "AI").length;

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <MessageSquare className="w-12 h-12 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-gray-900">
            Loading Question...
          </h2>
          <p className="text-gray-600 mt-2">Preparing discussion interface</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Question Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The question you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-sm">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Question Discussion
                  </h1>
                  <p className="text-sm text-gray-600">
                    Share knowledge and help students learn
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                title="Toggle statistics"
              >
                <TrendingUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => window.print()}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                title="Print"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Question & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Question Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">
                  Question Details
                </h3>
              </div>

              <div className="space-y-4">
                {/* Question Header */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        question.askedBy?.profilePic || "/default-avatar.png"
                      }
                      alt={question.askedBy?.name || "User"}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-blue-100 cursor-pointer hover:border-blue-300 transition-colors"
                      onClick={() =>
                        navigate(`/profile/${question.askedBy?._id}`)
                      }
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {question.askedBy?.name || "Student"}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          question.askedBy?.role === "teacher"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {question.askedBy?.role || "Student"}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="pt-4 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 leading-relaxed">
                    {question.text}
                  </h2>

                  {question.description && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700 whitespace-pre-line">
                        {question.description}
                      </p>
                    </div>
                  )}

                  {/* Question Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {question.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {showStats && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">
                    Discussion Stats
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">
                        {answers.length}
                      </div>
                      <div className="text-xs text-gray-600">Total Answers</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-xl">
                      <div className="text-2xl font-bold text-yellow-600">
                        {bestAnswer ? 1 : 0}
                      </div>
                      <div className="text-xs text-gray-600">Best Answer</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">
                          Teacher Answers
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {teacherAnswers}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">
                          Student Answers
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {studentAnswers}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-gray-700">
                          AI Answers
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {aiAnswers}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips for Answering */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Answering Tips</h3>
              </div>

              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Be clear and concise in your explanation</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Provide examples to illustrate concepts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Hash className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Use proper formatting for better readability</span>
                </li>
                <li className="flex items-start space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Cite sources when appropriate</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content - Answers */}
          <div className="lg:col-span-2">
            {/* Answers Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Answers ({answers.length})
                  </h2>
                  <p className="text-sm text-gray-600">
                    Browse through all responses
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    {["all", "best", "teacher", "student"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          activeTab === tab
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="best">Most Liked</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Best Answer Highlight */}
            {bestAnswer && activeTab === "all" && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-gray-900">Best Answer</h3>
                </div>

                <AnswerCard
                  answer={bestAnswer}
                  user={user}
                  editingId={editingId}
                  editText={editText}
                  setEditingId={setEditingId}
                  setEditText={setEditText}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleBest={handleBest}
                  isBest={true}
                />
              </div>
            )}

            {/* Answers List */}
            <div className="space-y-4">
              {filteredAnswers.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No answers yet
                  </h3>
                  <p className="text-gray-600">
                    {activeTab !== "all"
                      ? `No ${activeTab} answers found`
                      : "Be the first to answer this question!"}
                  </p>
                </div>
              ) : (
                filteredAnswers
                  .filter((a) => !bestAnswer || a._id !== bestAnswer._id)
                  .map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      answer={answer}
                      user={user}
                      editingId={editingId}
                      editText={editText}
                      setEditingId={setEditingId}
                      setEditText={setEditText}
                      handleUpdate={handleUpdate}
                      handleDelete={handleDelete}
                      handleBest={handleBest}
                      isBest={answer.isBest}
                    />
                  ))
              )}
            </div>

            {/* Add Answer Section */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2.5 bg-blue-100 rounded-lg">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Your Answer
                  </h3>
                  <p className="text-sm text-gray-600">
                    Share your knowledge with the community
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <textarea
                  className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
                  placeholder="Write your detailed answer here. You can use markdown formatting..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                />
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <span className="text-lg font-bold">B</span>
                      <span>Bold</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <span className="italic">I</span>
                      <span>Italic</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <Code className="w-4 h-4" />
                      <span>Code</span>
                    </button>
                  </div>
                  <span>{content.length} characters</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Your answer will be visible to everyone</span>
                </div>

                <button
                  onClick={submitAnswer}
                  disabled={loading || !content.trim()}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-semibold">Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span className="font-semibold">Post Answer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Answer Card Component
const AnswerCard = ({
  answer,
  user,
  editingId,
  editText,
  setEditingId,
  setEditText,
  handleUpdate,
  handleDelete,
  handleBest,
  isBest,
}) => {
  const answerUserId =
    typeof answer.answeredBy === "string"
      ? answer.answeredBy
      : answer.answeredBy?._id;
  const isOwner = String(answerUserId) === String(user?.id);
  const isEditing = editingId === answer._id;

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
        isBest ? "border-2 border-yellow-400 shadow-lg" : ""
      }`}
    >
      {/* Answer Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <UserProfileLink
              answeredBy={answer.answeredBy}
              role={answer.role}
            />

            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {answer.answeredBy?.name ||
                    (answer.role === "AI" ? "AI Assistant" : "Anonymous")}
                </h4>
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    answer.answeredBy?.role === "teacher"
                      ? "bg-purple-100 text-purple-700"
                      : answer.role === "AI"
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {answer.answeredBy?.role || answer.role || "Student"}
                </div>
                {isBest && (
                  <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium">
                    <Award className="w-3 h-3" />
                    <span>Best Answer</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(answer.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Answer Content */}
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditText("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(answer._id)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-800 mb-4">
            <p className="whitespace-pre-line leading-relaxed">
              {answer.content}
            </p>
          </div>
        )}

        {/* Answer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {user?.role === "teacher" && !isBest && (
              <button
                onClick={() => handleBest(answer._id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isBest
                    ? "text-yellow-600 bg-yellow-50"
                    : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                }`}
                title="Mark as best answer"
              >
                <Star
                  className={`w-4 h-4 ${isBest ? "fill-yellow-400" : ""}`}
                />
                <span className="text-sm">Best</span>
              </button>
            )}

            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">{answer.likes || 0}</span>
            </button>

            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Reply</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {isOwner && !isEditing && (
              <>
                <button
                  onClick={() => {
                    setEditingId(answer._id);
                    setEditText(answer.content);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(answer._id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
            </button>

            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Profile Link Component
const UserProfileLink = ({ answeredBy, role }) => {
  if (!answeredBy && role !== "AI") return null;

  return (
    <Link
      to={role !== "AI" ? `/profile/${answeredBy?._id}` : ""}
      className="relative group"
    >
      {role === "AI" ? (
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          AI
        </div>
      ) : (
        <div className="relative">
          <img
            src={answeredBy?.profilePic || "/default-avatar.png"}
            alt={answeredBy?.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-colors"
          />
          {answeredBy?.role === "teacher" && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
      )}

      {answeredBy && (
        <div className="absolute z-20 top-full left-0 mt-2 hidden group-hover:block">
          <MiniCard
            answeredBy={answeredBy}
            isFollowing={false}
            onFollow={() => console.log("Follow clicked")}
          />
        </div>
      )}
    </Link>
  );
};

// Mini Card Component
const MiniCard = ({ answeredBy, isFollowing, onFollow }) => {
  if (!answeredBy) return null;

  return (
    <div className="w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={answeredBy.profilePic || "/default-avatar.png"}
            alt={answeredBy.name}
            className="w-16 h-16 rounded-xl object-cover border-2 border-blue-100"
          />
          {answeredBy.role === "teacher" && (
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              Teacher
            </div>
          )}
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-gray-900">{answeredBy.name}</h4>
          <div className="flex items-center space-x-2 mt-1">
            <div
              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                answeredBy.role === "teacher"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {answeredBy.role}
            </div>
            <div className="text-xs text-gray-500">
              {answeredBy.subject || "General"}
            </div>
          </div>
          {answeredBy.bio && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {answeredBy.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {answeredBy.followers?.length || 0}
          </div>
          <div className="text-xs text-gray-600">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {answeredBy.following?.length || 0}
          </div>
          <div className="text-xs text-gray-600">Following</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {answeredBy.experience || "0"}+
          </div>
          <div className="text-xs text-gray-600">Years</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onFollow}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm py-2.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
        <Link
          to={`/profile/${answeredBy._id}`}
          className="flex-1 text-center border border-gray-300 text-gray-700 text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};
