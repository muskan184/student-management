import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Send, HelpCircle } from "lucide-react";

import { createQuestion } from "../../../api/questionApi";

export default function AskQuestion() {
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  /* ================= CHARACTER COUNT ================= */
  useEffect(() => {
    setCharCount(text.length);
  }, [text]);

  /* ================= AUTO-RESIZE TEXTAREA ================= */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    if (text.length < 10) {
      toast.error("Please provide more details in your question");
      return;
    }

    try {
      setLoading(true);
      await createQuestion({ text });
      toast.success("Question posted successfully!");
      setTimeout(() => navigate("/student/forum"), 1000);
    } catch (error) {
      toast.error("Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to Forum</span>
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
              <HelpCircle size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ask a Question
              </h1>
              <p className="text-gray-600 mt-1">
                Share your query with the community
              </p>
            </div>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* FORM HEADER */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h2 className="text-xl font-semibold text-gray-800">
                Question Details
              </h2>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Be clear and specific to get better answers
            </p>
          </div>

          {/* FORM BODY */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-lg font-semibold text-gray-800">
                  Your Question
                </label>
                <div
                  className={`text-sm ${
                    charCount > 500 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {charCount}/500 characters
                </div>
              </div>

              <div className="relative group">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your question here... Be as detailed as possible to get the best answers."
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 text-gray-700 placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           transition-all duration-200 resize-none overflow-hidden
                           hover:border-gray-400 min-h-[180px]"
                  rows={4}
                />

                {/* DECORATIVE ELEMENTS */}
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-gray-200 rounded-bl-xl"></div>
                <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-gray-200 rounded-tr-xl"></div>
              </div>

              {/* CHARACTER COUNTER BAR */}
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    charCount > 400
                      ? "bg-red-500"
                      : charCount > 250
                      ? "bg-yellow-500"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                  style={{
                    width: `${Math.min(100, (charCount / 500) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* TIPS SECTION */}
            <div className="mb-8 p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-blue-100 rounded-lg">
                  <Send size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">
                    Tips for better responses
                  </h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Provide context and background information</li>
                    <li>• Mention what you've already tried</li>
                    <li>• Be specific about what you need help with</li>
                    <li>• Use clear and concise language</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Your question will be visible to the entire community
              </div>
              <button
                type="submit"
                disabled={loading || text.trim().length < 10}
                className={`
                  relative flex items-center justify-center gap-3 
                  px-8 py-3.5 rounded-xl font-semibold text-white
                  transition-all duration-300 transform
                  ${
                    loading || text.trim().length < 10
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  }
                  overflow-hidden group
                `}
              >
                {/* ANIMATED BACKGROUND */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* BUTTON CONTENT */}
                <div className="relative flex items-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                      <span>Post Question</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Need immediate help? Check our{" "}
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">
              FAQ section
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
