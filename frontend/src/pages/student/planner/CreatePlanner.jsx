import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { ArrowLeft, Save } from "lucide-react";
import { createPlanner } from "../../../api/plannerApi";

export default function CreatePlanner() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      await createPlanner({
        title,
        description,
        date,
        status,
      });

      toast.success("Task added successfully");
      navigate("/student/planner");
    } catch {
      toast.error("Failed to add task");
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
        <h1 className="text-2xl font-semibold">Add Task</h1>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow max-w-xl space-y-4">
        {/* TITLE */}
        <div>
          <label className="block mb-1 font-medium">Title *</label>
          <input
            type="text"
            placeholder="Eg: Complete DSA Revision"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Date *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            rows={3}
            placeholder="Optional details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded resize-none"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* ACTION */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded"
        >
          <Save size={16} />
          {loading ? "Saving..." : "Save Task"}
        </button>
      </div>
    </div>
  );
}
