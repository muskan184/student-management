import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Trash2, Play, Brain, Pencil } from "lucide-react";
import { deleteFlashcard, fetchFlashcards } from "../../../api/flashCardApi";

export default function FlashcardList() {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const data = await fetchFlashcards();
      setFlashcards(data);
    } catch {
      toast.error("Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this flashcard?")) return;
    try {
      await deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((f) => f._id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Flashcards</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/student/flashcards/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded flex gap-2"
          >
            <Plus size={18} /> Create
          </button>
          <button
            onClick={() => navigate("/student/flashcards/ai")}
            className="border px-4 py-2 rounded flex gap-2"
          >
            <Brain size={18} /> AI
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {flashcards.map((set) => (
          <div key={set._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{set.title}</h3>
            <p className="text-sm text-gray-500">{set.cards.length} cards</p>

            <div className="flex justify-between mt-3">
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    navigate(`/student/flashcards/play/${set._id}`)
                  }
                  className="text-blue-600 flex gap-1"
                >
                  <Play size={16} /> Play
                </button>

                <button
                  onClick={() =>
                    navigate(`/student/flashcards/edit/${set._id}`)
                  }
                  className="text-green-600 flex gap-1"
                >
                  <Pencil size={16} /> Edit
                </button>
              </div>

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
    </div>
  );
}
