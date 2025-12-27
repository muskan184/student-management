import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchFlashcardById, updateFlashcard } from "../../../api/flashCardApi";

export default function EditFlashcard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchFlashcardById(id).then((data) => {
      setTitle(data.title);
      setCards(data.cards);
    });
  }, [id]);

  const save = async () => {
    try {
      await updateFlashcard(id, { title, cards });
      toast.success("Updated");
      navigate("/student/flashcards");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Flashcard</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      {cards.map((c, i) => (
        <div key={i} className="mb-3">
          <input
            value={c.question}
            onChange={(e) => {
              const copy = [...cards];
              copy[i].question = e.target.value;
              setCards(copy);
            }}
            className="border p-2 w-full mb-1"
          />
          <input
            value={c.answer}
            onChange={(e) => {
              const copy = [...cards];
              copy[i].answer = e.target.value;
              setCards(copy);
            }}
            className="border p-2 w-full"
          />
        </div>
      ))}

      <button
        onClick={save}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
