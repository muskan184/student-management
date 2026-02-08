import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../../api/questionApi";
import {
  FaUserCircle,
  FaCalendarAlt,
  FaCommentAlt,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";
import {
  CheckCircle,
  Clock,
  MessageSquare,
  ChevronRight,
  Users,
  BookOpen,
} from "lucide-react";

export default function TeacherQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchQuestions();
        setQuestions(res.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <MessageSquare className="w-10 h-10 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-gray-900">
            Loading Questions
          </h2>
          <p className="text-gray-600 mt-2">Gathering student inquiries</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalQuestions = questions.length;
  const answeredQuestions = questions.filter((q) => q.answered).length;
  const pendingQuestions = questions.filter((q) => !q.answered).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/50">
      {/* Header Section */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-sm">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Student Questions
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Answer questions from your students
              </p>
            </div>

            {/* Stats Badge */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <LuMessageSquare className="text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalQuestions}</div>
                  <div className="text-sm opacity-90">Total Questions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {answeredQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Answered</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-amber-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-600">
                    {pendingQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {questions.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaCommentAlt className="text-6xl text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No questions yet
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Students haven't asked any questions yet. They'll appear here
                when they do.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Waiting for students
                  </h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Questions from your students will appear here automatically.
                  You'll be notified when new questions arrive.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((q) => (
              <div
                key={q._id}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-blue-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Profile Section */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                          {q.askedBy?.name?.charAt(0) || "S"}
                        </div>
                        {q.askedBy?.role === "teacher" && (
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Teacher
                          </div>
                        )}
                        {q.answered && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Answered
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          {/* Question Title */}
                          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {q.text}
                          </h2>

                          {/* Student Info */}
                          <div className="flex items-center flex-wrap gap-4 mb-4">
                            <div
                              className="flex items-center gap-2 cursor-pointer group"
                              onClick={() =>
                                navigate(`/profile/${q.askedBy?._id}`)
                              }
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                  {q.askedBy?.profilePic ? (
                                    <img
                                      src={q.askedBy.profilePic}
                                      alt={q.askedBy.name}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <FaUserCircle className="text-blue-500 text-xl" />
                                  )}
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {q.askedBy?.name || "Unknown User"}
                                  </span>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <FaCalendarAlt className="text-xs" />
                                      <span>{formatDate(q.createdAt)}</span>
                                    </div>
                                    <span>•</span>
                                    <span className="text-blue-500">
                                      {formatTimeAgo(q.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Role Badge */}
                            {q.askedBy?.role && (
                              <span
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                  q.askedBy.role === "teacher"
                                    ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                                    : "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700"
                                }`}
                              >
                                {q.askedBy.role}
                              </span>
                            )}
                          </div>

                          {/* Question Status */}
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                                q.answered
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {q.answered ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  <span className="font-medium">Answered</span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-4 h-4" />
                                  <span className="font-medium">
                                    Pending Answer
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Additional Info */}
                            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span>Course: {q.course || "General"}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="lg:flex-shrink-0">
                          <button
                            onClick={() =>
                              navigate(`/teacher/question/${q._id}`)
                            }
                            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
                          >
                            <MessageSquare className="w-5 h-5" />
                            <span>
                              {q.answered ? "View Answer" : "Answer Question"}
                            </span>
                            <FaArrowRight className="text-sm transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="px-6">
                  <div className="border-t border-gray-100"></div>
                </div>

                {/* Footer Stats */}
                <div className="px-6 py-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Question ID: {q._id?.substring(0, 8)}...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>
                          Last updated:{" "}
                          {formatTimeAgo(q.updatedAt || q.createdAt)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/teacher/question/${q._id}`)}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 group"
                    >
                      <span>
                        {q.answered ? "View Details" : "Start Answering"}
                      </span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Footer Stats */}
        {questions.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Question Overview
                </h3>
                <p className="text-gray-600">
                  You're helping {questions.length} students with their learning
                  journey
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-2xl font-bold text-gray-900">
                      {totalQuestions}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-2xl font-bold text-emerald-600">
                      {answeredQuestions}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Answered</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-2xl font-bold text-amber-600">
                      {pendingQuestions}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Answer Progress</span>
                <span>
                  {Math.round((answeredQuestions / totalQuestions) * 100)}%
                  Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${(answeredQuestions / totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
