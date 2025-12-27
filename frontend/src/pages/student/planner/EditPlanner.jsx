import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchPlanners, updatePlanner } from "../../../api/plannerApi";

export default function EditPlanner() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    title: "",
    description: "",
    date: "",
    status: "",
  });

  /* LOAD EXISTING TASK */
  useEffect(() => {
    const loadTask = async () => {
      const planners = await fetchPlanners();
      const found = planners.find((p) => p._id === id);
      if (found) {
        setTask({
          title: found.title,
          description: found.description,
          date: found.date.split("T")[0],
          status: found.status,
        });
      }
    };
    loadTask();
  }, [id]);

  /* UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePlanner(id, task);
      toast.success("Task updated ✅");
      navigate("/student/planner");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Task</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={task.description}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={task.date}
          onChange={(e) => setTask({ ...task, date: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={task.status}
          onChange={(e) => setTask({ ...task, status: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Update Task
        </button>
      </form>
    </div>
  );
}
