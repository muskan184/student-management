// src/pages/student/flashcards/FlashcardPlayer.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { fetchFlashcardById } from "../../../api/flashCardApi";

export default function FlashcardPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flashcard, setFlashcard] = useState(null);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FLASHCARD ================= */
  useEffect(() => {
    loadFlashcard();
  }, []);

  const loadFlashcard = async () => {
    try {
      const data = await fetchFlashcardById(id);
      setFlashcard(data);
    } catch (error) {
      toast.error("Failed to load flashcard");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) return <p className="p-6">Loading...</p>;
  if (!flashcard || !flashcard.cards?.length)
    return <p className="p-6">No cards found</p>;

  const totalCards = flashcard.cards.length;

  /* ================= HANDLERS ================= */
  const next = () => {
    if (index < totalCards - 1) {
      setIndex((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const prev = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  const restart = () => {
    setIndex(0);
    setShowAnswer(false);
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full max-w-xl flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 border rounded">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-semibold">{flashcard.title}</h1>
      </div>

      {/* PROGRESS */}
      <p className="mb-3 text-sm text-gray-600">
        Card {index + 1} / {totalCards}
      </p>

      {/* FLASHCARD */}
      <div
        key={`${index}-${showAnswer}`} // 🔥 important
        onClick={() => setShowAnswer((prev) => !prev)}
        className="w-full max-w-xl bg-white p-6 rounded shadow text-center cursor-pointer min-h-[200px] flex items-center justify-center transition"
      >
        <p className="text-lg font-medium">
          {showAnswer
            ? flashcard.cards[index]?.answer
            : flashcard.cards[index]?.question}
        </p>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Click card to flip (Question ↔ Answer)
      </p>

      {/* CONTROLS */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={prev}
          disabled={index === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        {index === totalCards - 1 ? (
          <button
            onClick={restart}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded"
          >
            <RotateCcw size={16} /> Restart
          </button>
        ) : (
          <button
            onClick={next}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
