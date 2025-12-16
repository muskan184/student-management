import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { createFlashcard } from "../../../api/flashCardApi";

export default function CreateFlashcard() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [cards, setCards] = useState([{ question: "", answer: "" }]);
  const [loading, setLoading] = useState(false);

  /* ================= ADD / REMOVE CARD ================= */
  const addCard = () => {
    setCards([...cards, { question: "", answer: "" }]);
  };

  const removeCard = (index) => {
    if (cards.length === 1) {
      toast.error("At least one card is required");
      return;
    }
    setCards(cards.filter((_, i) => i !== index));
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (cards.some((c) => !c.question || !c.answer)) {
      toast.error("All questions & answers required");
      return;
    }

    try {
      setLoading(true);
      await createFlashcard({ title, cards });
      toast.success("Flashcard created");
      navigate("/student/flashcards");
    } catch {
      toast.error("Failed to create flashcard");
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
        <h1 className="text-2xl font-semibold">Create Flashcard</h1>
      </div>

      {/* TITLE */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          placeholder="Eg: DSA Basics"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* CARDS */}
      <div className="space-y-4">
        {cards.map((card, index) => (
          <div key={index} className="bg-white p-4 rounded shadow space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Card {index + 1}</h3>
              <button
                onClick={() => removeCard(index)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Question"
              value={card.question}
              onChange={(e) => handleChange(index, "question", e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />

            <textarea
              placeholder="Answer"
              value={card.answer}
              onChange={(e) => handleChange(index, "answer", e.target.value)}
              className="w-full border px-3 py-2 rounded resize-none"
              rows={3}
            />
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={addCard}
          className="flex items-center gap-2 border px-4 py-2 rounded"
        >
          <Plus size={16} /> Add Card
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded"
        >
          <Save size={16} />
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
