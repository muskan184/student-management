import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../../api/questionApi";
import { FaUserCircle, FaCalendarAlt, FaCommentAlt } from "react-icons/fa";
import { LuMessageSquare } from "react-icons/lu";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Student Questions
            </h1>
            <p className="text-gray-600 mt-2">
              Answer questions from your students
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <LuMessageSquare className="text-lg" />
            <span className="font-semibold">{questions.length} Questions</span>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCommentAlt className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No questions yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Students haven't asked any questions yet. They'll appear here when they do.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex gap-4">
                    {/* Profile Section */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={q.askedBy?.profilePic || "/default-avatar.png"}
                          alt={q.askedBy?.name || "User"}
                          className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 cursor-pointer hover:border-blue-300 transition-colors"
                          onClick={() =>
                            navigate(`/profile/${q.askedBy?._id}`)
                          }
                        />
                        {q.askedBy?.role === "teacher" && (
                          <div className="absolute -bottom-1 -right-1 bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                            Teacher
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      {/* Question Text */}
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                        {q.text}
                      </h2>

                      {/* Asked By Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => navigate(`/profile/${q.askedBy?._id}`)}
                        >
                          {q.askedBy?.profilePic ? (
                            <img
                              src={q.askedBy.profilePic}
                              alt={q.askedBy.name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <FaUserCircle className="text-gray-500 text-lg" />
                          )}
                          <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                            {q.askedBy?.name || "Unknown User"}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <FaCalendarAlt className="text-xs" />
                          <span>{formatDate(q.createdAt)}</span>
                        </div>

                        {/* Role Badge */}
                        {q.askedBy?.role && (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              q.askedBy.role === "teacher"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {q.askedBy.role}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => navigate(`/teacher/question/${q._id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-2"
                        >
                          <LuMessageSquare className="text-lg" />
                          Answer Question
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                
          
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {questions.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 flex items-center justify-center gap-6">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>{questions.length} total questions</span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>
                  {questions.filter((q) => q.answered).length} answered
                </span>
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>
                  {questions.filter((q) => !q.answered).length} pending
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}