import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchNotesById, updateNote } from "../../../api/noteApi";

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [file, setFile] = useState(null);

  const loadNote = async () => {
    try {
      const res = await fetchNotesById(id);
      setTitle(res.title);
      setContent(res.content);
      setCategory(res.category);
    } catch (error) {
      toast.error("Error loading note");
    }
  };

  useEffect(() => {
    loadNote();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (file) formData.append("file", file);

    try {
      await updateNote(id, formData);
      toast.success("Note updated!");
      navigate(`/student/notes/${id}`);
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Note</h2>

      <form onSubmit={handleUpdate}>
        <label className="block mb-2">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows="4"
        />

        <label className="block mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option>General</option>
          <option>Study</option>
          <option>Important</option>
        </select>

        <label className="block mb-2">Upload New File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Update Note
        </button>
      </form>
    </div>
  );
}
