import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Send } from "lucide-react";

import { createQuestion } from "../../../api/questionApi";

export default function AskQuestion() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await createQuestion({ text });
      toast.success("Question posted successfully");
      navigate("/student/forum");
    } catch (error) {
      toast.error("Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border rounded">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-semibold">Ask a Question</h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-2xl"
      >
        <label className="block mb-2 font-medium">Your Question</label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your question here..."
          rows={5}
          className="w-full border px-3 py-2 rounded resize-none"
        />

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded"
          >
            <Send size={16} />
            {loading ? "Posting..." : "Post Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
