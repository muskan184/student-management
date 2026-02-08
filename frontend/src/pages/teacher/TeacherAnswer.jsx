import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Send,
  ArrowLeft,
  BookOpen,
  User,
  Clock,
  ThumbsUp,
  MessageSquare,
  Edit2,
  Trash2,
  CheckCircle,
  Star,
  Award,
  Brain,
  Lightbulb,
  Zap,
  Sparkles,
  Hash,
  Bold,
  Italic,
  ListOrdered,
  List,
  Link,
  Image,
  Code,
  Paperclip,
  Smile,
  Eye,
  EyeOff,
  Download,
  Share2,
  Bookmark,
  Volume2,
  MoreVertical,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Target,
  GraduationCap,
  BookText,
} from "lucide-react";
import { fetchQuestionById } from "../../api/questionApi";
import {
  addAnswer,
  fetchAnswers,
  updateAnswer,
  deleteAnswer,
} from "../../api/answerApi";

export default function TeacherAnswer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("write"); // write or preview
  const [filter, setFilter] = useState("all"); // all, mine, best
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showFormatting, setShowFormatting] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);

  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    loadData();

    // Focus textarea on load
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 500);
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [q, a] = await Promise.all([
        fetchQuestionById(id),
        fetchAnswers(id),
      ]);
      setQuestion(q);
      setAnswers(a);
    } catch (error) {
      toast.error("Failed to load question and answers", {
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      toast.error("Please write an answer before submitting", {
        icon: "📝",
      });
      return;
    }

    try {
      setSubmitting(true);
      await addAnswer(id, {
        content: answer,
        metadata: {
          timestamp: new Date().toISOString(),
          formatted: true,
          attachments: [],
        },
      });

      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>Answer submitted successfully! 🎯</span>
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

      const updated = await fetchAnswers(id);
      setAnswers(updated);
      setAnswer("");

      // Switch to preview tab
      setActiveTab("preview");
    } catch (error) {
      toast.error("Failed to submit answer", {
        icon: "❌",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const startEditAnswer = (answer) => {
    setEditingAnswerId(answer._id);
    setEditContent(answer.content);
  };

  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditContent("");
  };

  const saveEdit = async (answerId) => {
    try {
      await updateAnswer(answerId, { content: editContent });
      toast.success("Answer updated", {
        icon: "✏️",
      });
      setEditingAnswerId(null);
      loadData();
    } catch (error) {
      toast.error("Failed to update answer");
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm("Are you sure you want to delete this answer?")) {
      try {
        await deleteAnswer(answerId);
        toast.success("Answer deleted", {
          icon: "🗑️",
        });
        loadData();
      } catch (error) {
        toast.error("Failed to delete answer");
      }
    }
  };

  const formatText = (command) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = answer.substring(start, end);

    let formattedText = "";
    let newCursorPos = start;

    switch (command) {
      case "bold":
        formattedText = `**${selectedText}**`;
        newCursorPos = start + 2;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        newCursorPos = start + 1;
        break;
      case "code":
        formattedText = `\`${selectedText}\``;
        newCursorPos = start + 1;
        break;
      case "link":
        formattedText = `[${selectedText}](url)`;
        newCursorPos = start + 1;
        break;
      case "ol":
        formattedText = `1. ${selectedText}`;
        newCursorPos = start + 3;
        break;
      case "ul":
        formattedText = `- ${selectedText}`;
        newCursorPos = start + 2;
        break;
      default:
        return;
    }

    const newText =
      answer.substring(0, start) + formattedText + answer.substring(end);
    setAnswer(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        newCursorPos,
        newCursorPos + selectedText.length,
      );
    }, 0);
  };

  const markAsBestAnswer = async (answerId) => {
    try {
      // This would be an API call to mark answer as best
      toast.success(
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <span>Marked as best answer! 🏆</span>
        </div>,
        {
          duration: 3000,
        },
      );
    } catch (error) {
      toast.error("Failed to mark as best answer");
    }
  };

  const filteredAnswers = answers
    .filter((a) => {
      if (filter === "mine") return a.isMine;
      if (filter === "best") return a.isBest;
      return true;
    })
    .filter(
      (a) =>
        a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  // Calculate statistics
  const totalAnswers = answers.length;
  const myAnswers = answers.filter((a) => a.isMine).length;
  const bestAnswers = answers.filter((a) => a.isBest).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <Brain className="w-12 h-12 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-gray-900">
            Loading Question...
          </h2>
          <p className="text-gray-600 mt-2">Preparing teaching interface</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gray-400" />
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
                    Teacher Answer
                  </h1>
                  <p className="text-sm text-gray-600">
                    Share your knowledge with students
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                title="Show statistics"
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
                <BookText className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">
                  Question Details
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Subject
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {question.subject || "General"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Difficulty
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        question.difficulty === "easy"
                          ? "text-emerald-600"
                          : question.difficulty === "medium"
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {question.difficulty || "Medium"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Asked by
                    </span>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-bold text-gray-900">
                        {question.author?.name || "Student"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                    {question.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {question.description}
                  </p>
                </div>

                {/* Question Tags */}
                {question.tags && question.tags.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            {(showStatistics || myAnswers > 0) && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">
                    Answer Statistics
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900">
                        {totalAnswers}
                      </div>
                      <div className="text-xs text-gray-600">Total Answers</div>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-xl">
                      <div className="text-2xl font-bold text-emerald-600">
                        {myAnswers}
                      </div>
                      <div className="text-xs text-gray-600">Your Answers</div>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-yellow-50 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-600">
                      {bestAnswers}
                    </div>
                    <div className="text-xs text-gray-600">Best Answers</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips for Teachers */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Teaching Tips</h3>
              </div>

              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Provide clear, step-by-step explanations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Include examples to illustrate concepts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Brain className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Encourage critical thinking with follow-up questions
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Zap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Use formatting to make answers more readable</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Answers Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Answers ({totalAnswers})
                  </h2>
                  <p className="text-sm text-gray-600">
                    Share your knowledge and help students learn
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search answers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Answers</option>
                    <option value="mine">My Answers</option>
                    <option value="best">Best Answers</option>
                  </select>
                </div>
              </div>

              {/* Answers List */}
              <div className="space-y-4">
                {filteredAnswers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No answers yet
                    </h3>
                    <p className="text-gray-600">
                      Be the first to answer this question!
                    </p>
                  </div>
                ) : (
                  filteredAnswers.map((ans) => (
                    <div
                      key={ans._id}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-5"
                    >
                      {editingAnswerId === ans._id ? (
                        <div className="space-y-4">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-40 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Edit your answer..."
                          />
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEdit(ans._id)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Answer Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                {ans.author?.name?.charAt(0) || "T"}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {ans.author?.name || "Teacher"}
                                </h4>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {new Date(
                                      ans.createdAt,
                                    ).toLocaleDateString()}
                                  </span>
                                  {ans.isBest && (
                                    <>
                                      <span>•</span>
                                      <div className="flex items-center text-yellow-600">
                                        <Award className="w-3 h-3 mr-1" />
                                        <span>Best Answer</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {ans.isMine && (
                                <>
                                  <button
                                    onClick={() => startEditAnswer(ans)}
                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAnswer(ans._id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => markAsBestAnswer(ans._id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  ans.isBest
                                    ? "text-yellow-600 bg-yellow-50"
                                    : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                                }`}
                                title="Mark as best answer"
                              >
                                <Award className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Answer Content */}
                          <div className="prose prose-sm max-w-none text-gray-800 mb-4">
                            {ans.content}
                          </div>

                          {/* Answer Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-sm">
                                  {ans.likes || 0}
                                </span>
                              </button>
                              <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm">Reply</span>
                              </button>
                            </div>

                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <button className="hover:text-gray-700 transition-colors">
                                <Share2 className="w-4 h-4" />
                              </button>
                              <button className="hover:text-gray-700 transition-colors">
                                <Bookmark className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Write Answer Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Your Answer
                  </h3>
                  <p className="text-sm text-gray-600">
                    Help students understand this question
                  </p>
                </div>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveTab("write")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === "write"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Write
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === "preview"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              {activeTab === "write" && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => formatText("bold")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatText("italic")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatText("code")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="Code"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatText("link")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="Link"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <button
                      onClick={() => formatText("ol")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="Ordered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => formatText("ul")}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      title="Unordered List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowFormatting(!showFormatting)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded ml-auto"
                      title="More Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Answer Input / Preview */}
              <div className="mb-6">
                {activeTab === "write" ? (
                  <textarea
                    ref={textareaRef}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full h-64 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
                    placeholder="Write your detailed answer here. Use markdown formatting to make it more readable..."
                    rows={10}
                  />
                ) : (
                  <div className="h-64 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl overflow-y-auto">
                    <div className="prose prose-sm max-w-none">
                      {answer ? (
                        <div className="space-y-4">
                          <p className="text-gray-800 whitespace-pre-wrap">
                            {answer}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>Write something to see the preview</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <Image className="w-4 h-4" />
                      <span>Add Image</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <Paperclip className="w-4 h-4" />
                      <span>Attach File</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                      <Code className="w-4 h-4" />
                      <span>Insert Code</span>
                    </button>
                  </div>
                  <span>{answer.length} characters</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Your answer will be visible to all students</span>
                </div>

                <button
                  onClick={submitAnswer}
                  disabled={submitting || !answer.trim()}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-semibold">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span className="font-semibold">Submit Answer</span>
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
