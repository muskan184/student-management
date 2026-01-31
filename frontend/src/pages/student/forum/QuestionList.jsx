import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Eye,
  MessageCircle,
  Clock,
  User,
  ChevronRight,
  Filter,
} from "lucide-react";
import { fetchQuestions } from "../../../api/questionApi";

export default function QuestionList() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH QUESTIONS ================= */
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const data = await fetchQuestions();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Q&A Forum
            </h1>
            <p className="text-gray-600 mt-2">
              Ask questions and get answers from the community
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow">
              <Filter size={18} className="text-gray-600" />
              <span className="font-medium">Filter</span>
            </button>

            <button
              onClick={() => navigate("/student/qa/ask")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={20} />
              Ask Question
            </button>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {questions.length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MessageCircle className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    questions.filter((q) => {
                      const today = new Date();
                      const qDate = new Date(q.createdAt);
                      return qDate.toDateString() === today.toDateString();
                    }).length
                  }
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Clock className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Teachers Online</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    new Set(
                      questions.map((q) => q.askedBy?._id).filter((id) => id),
                    ).size
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <User className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageCircle size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No questions yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Be the first to ask a question! Click the "Ask Question" button to
              get started.
            </p>
            <button
              onClick={() => navigate("/student/qa/ask")}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Ask First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <div
                key={q._id}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  {/* USER AVATAR */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-white shadow-md hover:scale-105 transition-transform duration-200"
                        onClick={() => navigate(`/profile/${q.askedBy?._id}`)}
                      >
                        {q.askedBy?.profilePic ? (
                          <img
                            src={q.askedBy.profilePic}
                            alt={q.askedBy?.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={28} className="text-blue-600" />
                        )}
                      </div>
                      {q.askedBy?.role === "teacher" && (
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                          Teacher
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QUESTION CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                          {q.text}
                        </h3>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <User size={14} />
                            <span className="font-medium">
                              {q.askedBy?.name || "Anonymous"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Clock size={14} />
                            <span>
                              {q.createdAt
                                ? new Date(q.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "N/A"}
                            </span>
                          </div>
                          {q.answers && q.answers.length > 0 && (
                            <div className="flex items-center gap-1.5 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                              <MessageCircle size={14} />
                              <span>{q.answers.length} answers</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* VIEW BUTTON */}
                      <button
                        onClick={() => navigate(`/student/forum/${q._id}`)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium px-4 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 group/button"
                      >
                        <span>View Discussion</span>
                        <ChevronRight
                          size={18}
                          className="group-hover/button:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>

                    {/* TAGS (if available) */}
                    {q.tags && q.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                        {q.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                        {q.tags.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                            +{q.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FOOTER NOTE */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Have a question? Don't hesitate to ask! Our community is here to
            help.
          </p>
        </div>
      </div>
    </div>
  );
}
