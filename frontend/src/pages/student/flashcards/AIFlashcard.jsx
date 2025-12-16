import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Brain, ArrowLeft } from "lucide-react";
import { generateAIFlashcards } from "../../../api/flashCardApi";

export default function AIFlashcard() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);

  /* ================= GENERATE ================= */
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Topic is required");
      return;
    }

    try {
      setLoading(true);
      await generateAIFlashcards({
        topic,
        noteContent: `Generate ${count} flashcards on ${topic}`,
      });
      toast.success("AI flashcards generated");
      navigate("/student/flashcards");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "AI is busy, try again after some time"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border rounded">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-semibold">AI Flashcard Generator</h1>
      </div>

      {/* FORM */}
      <div className="max-w-xl bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block mb-1 font-medium">Topic</label>
          <input
            type="text"
            placeholder="Eg: Stack in DSA"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Number of Cards</label>
          <input
            type="number"
            min="3"
            max="15"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-purple-600 text-white py-2 rounded"
        >
          <Brain size={18} />
          {loading ? "Generating..." : "Generate with AI"}
        </button>
      </div>
    </div>
  );
}
