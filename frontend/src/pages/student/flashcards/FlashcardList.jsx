import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Plus, Trash2, Play, Brain } from "lucide-react";
import { deleteFlashcard, fetchFlashcards } from "../../../api/flashCardApi";

export default function FlashcardList() {
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH FLASHCARDS ================= */
  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const data = await fetchFlashcards();
      setFlashcards(data);
    } catch (error) {
      toast.error("Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flashcard set?")) return;

    try {
      await deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((f) => f._id !== id));
      toast.success("Flashcard deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Flashcards</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/student/flashcards/create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Plus size={18} /> Create
          </button>

          <button
            onClick={() => navigate("/student/flashcards/ai")}
            className="flex items-center gap-2 border px-4 py-2 rounded"
          >
            <Brain size={18} /> AI Generate
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>Loading...</p>
      ) : flashcards.length === 0 ? (
        <p className="text-gray-500">No flashcards found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {flashcards.map((set) => (
            <div
              key={set._id}
              className="bg-white p-4 rounded shadow space-y-3"
            >
              <h3 className="font-semibold text-lg">{set.title}</h3>

              <p className="text-sm text-gray-600">
                {set.cards?.length || 0} cards
              </p>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() =>
                    navigate(`/student/flashcards/play/${set._id}`)
                  }
                  className="flex items-center gap-1 text-blue-600"
                >
                  <Play size={16} /> Play
                </button>

                <button
                  onClick={() => handleDelete(set._id)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
