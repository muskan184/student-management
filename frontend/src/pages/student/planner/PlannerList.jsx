import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Plus, Trash2, Edit, CheckCircle } from "lucide-react";
import {
  deletePlanner,
  fetchPlanners,
  updatePlanner,
} from "../../../api/plannerApi";

export default function PlannerList() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔹 FILTER STATE */
  const [filter, setFilter] = useState("all");

  /* ================= FETCH TASKS ================= */
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchPlanners();
      setTasks(data);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deletePlanner(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= STATUS TOGGLE ================= */
  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      await updatePlanner(task._id, { status: newStatus });

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
      );

      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ================= FILTER LOGIC ================= */
  const filteredTasks = useMemo(() => {
    if (filter === "completed") {
      return tasks.filter((t) => t.status === "completed");
    }
    if (filter === "pending") {
      return tasks.filter((t) => t.status !== "completed");
    }
    return tasks;
  }, [tasks, filter]);

  /* ================= STATS ================= */
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = total - completed;

  /* ================= UI ================= */
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Planner</h1>

        <button
          onClick={() => navigate("/student/planner/add-task")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Plus size={18} /> Add Task
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500 text-sm">Total</p>
          <h2 className="text-xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-xl font-bold text-green-600">{completed}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500 text-sm">Pending</p>
          <h2 className="text-xl font-bold text-yellow-600">{pending}</h2>
        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div className="flex gap-3 mb-6">
        {["all", "pending", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded capitalize ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ================= TASK LIST ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500">No tasks found</p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-gray-600">
                  {task.description || "No description"}
                </p>

                <span
                  className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {task.status || "pending"}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                {/* STATUS TOGGLE */}
                <button
                  onClick={() => toggleStatus(task)}
                  className="text-green-600"
                  title="Toggle Status"
                >
                  <CheckCircle size={18} />
                </button>

                <button
                  onClick={() => navigate(`/student/planner/edit/${task._id}`)}
                  className="text-blue-600"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
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
