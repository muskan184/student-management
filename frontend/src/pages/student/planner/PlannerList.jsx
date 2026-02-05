import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Calendar,
  Clock,
  Filter,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Flag,
  CalendarDays,
  TrendingUp,
  Target,
  Sparkles,
  CheckCheck,
  Circle,
  AlarmClock,
  Star,
  Zap,
} from "lucide-react";
import {
  deletePlanner,
  fetchPlanners,
  updatePlanner,
} from "../../../api/plannerApi";
import { format, isToday, isTomorrow, isPast } from "date-fns";

export default function PlannerList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [sortBy, setSortBy] = useState("dueDate");
  const [viewMode, setViewMode] = useState("list");

  /* ================= FETCH TASKS ================= */
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
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
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setDeletingId(id);
      await deletePlanner(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= STATUS TOGGLE ================= */
  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    try {
      await updatePlanner(task._id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t)),
      );

      // Success animation feedback
      toast.success(
        `Task marked as ${newStatus === "completed" ? "completed" : "pending"}`,
        {
          icon: newStatus === "completed" ? "🎉" : "📝",
        },
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* ================= FORMAT DATE ================= */
  const getFormattedDate = useCallback((dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isToday(date)) return "Today";
      if (isTomorrow(date)) return "Tomorrow";
      if (isPast(date)) return "Overdue";
      return format(date, "EEE, MMM dd");
    } catch {
      return null;
    }
  }, []);

  const getDateColor = useCallback((dateString) => {
    if (!dateString) return "text-gray-400";
    try {
      const date = new Date(dateString);
      if (isToday(date)) return "text-blue-600";
      if (isTomorrow(date)) return "text-purple-600";
      if (isPast(date)) return "text-red-600";
      return "text-green-600";
    } catch {
      return "text-gray-400";
    }
  }, []);

  /* ================= TASK FILTERING & SORTING ================= */
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.description && t.description.toLowerCase().includes(term)) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(term))),
      );
    }

    // Status filter
    if (filter === "completed") {
      filtered = filtered.filter((t) => t.status === "completed");
    } else if (filter === "pending") {
      filtered = filtered.filter((t) => t.status !== "completed");
    } else if (filter === "today") {
      filtered = filtered.filter(
        (t) => t.dueDate && isToday(new Date(t.dueDate)),
      );
    } else if (filter === "overdue") {
      filtered = filtered.filter(
        (t) =>
          t.dueDate &&
          isPast(new Date(t.dueDate)) &&
          !isToday(new Date(t.dueDate)),
      );
    }

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return (
          (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
        );
      } else if (sortBy === "createdAt") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, filter, searchTerm, sortBy]);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = total - completed;
    const todayTasks = tasks.filter(
      (t) =>
        t.dueDate && isToday(new Date(t.dueDate)) && t.status !== "completed",
    ).length;
    const overdueTasks = tasks.filter(
      (t) =>
        t.dueDate &&
        isPast(new Date(t.dueDate)) &&
        !isToday(new Date(t.dueDate)) &&
        t.status !== "completed",
    ).length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      todayTasks,
      overdueTasks,
      completionRate,
    };
  }, [tasks]);

  /* ================= TASK PRIORITY ================= */
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <Flag className="text-red-500" size={14} />;
      case "medium":
        return <Flag className="text-yellow-500" size={14} />;
      case "low":
        return <Flag className="text-green-500" size={14} />;
      default:
        return <Flag className="text-gray-400" size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 to-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                  <CalendarDays className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Task Planner
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Stay organized and boost your productivity
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "list" ? "grid" : "list")
                }
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                {viewMode === "list" ? (
                  <>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded"></div>
                    </div>
                    Grid
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="w-4 h-1 bg-gray-400 rounded"></div>
                      <div className="w-4 h-1 bg-gray-400 rounded"></div>
                    </div>
                    List
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/student/planner/add-task")}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Add Task
              </button>
            </div>
          </div>

          {/* ================= QUICK STATS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Tasks
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </h2>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Target className="text-blue-500" size={24} />
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000"
                  style={{
                    width: `${(stats.total / (stats.total || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Completed</p>
                  <h2 className="text-2xl font-bold text-green-600 mt-1">
                    {stats.completed}
                  </h2>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <CheckCheck className="text-green-500" size={24} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {stats.completionRate}%
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Today</p>
                  <h2 className="text-2xl font-bold text-purple-600 mt-1">
                    {stats.todayTasks}
                  </h2>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Zap className="text-purple-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Tasks due today</p>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Overdue</p>
                  <h2 className="text-2xl font-bold text-red-600 mt-1">
                    {stats.overdueTasks}
                  </h2>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <AlarmClock className="text-red-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Need attention</p>
            </div>
          </div>

          {/* ================= CONTROL BAR ================= */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search tasks, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 text-gray-700"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Filters and Sort */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium cursor-pointer"
                  >
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="priority">Sort by Priority</option>
                    <option value="createdAt">Sort by Created</option>
                    <option value="title">Sort by Name</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>

                <div className="flex overflow-x-auto scrollbar-hide space-x-2">
                  {["all", "today", "pending", "completed", "overdue"].map(
                    (f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                          filter === f
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-[1.02]"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md"
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TASK LIST/GRID ================= */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <Sparkles
                className="absolute -top-2 -right-2 text-blue-500 animate-pulse"
                size={20}
              />
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading your tasks...
            </p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="text-blue-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm ? "No matching tasks" : "All clear! 🎉"}
              </h3>
              <p className="text-gray-600 mb-8">
                {searchTerm
                  ? "No tasks found matching your search. Try different keywords."
                  : "You're all caught up! Add new tasks to stay productive."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="px-6 py-3.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Clear Search
                  </button>
                ) : null}
                <button
                  onClick={() => navigate("/student/planner/add-task")}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Plus size={20} />
                  Create New Task
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Task Summary */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">
                  {filteredTasks.length}{" "}
                  {filteredTasks.length === 1 ? "task" : "tasks"} found
                </span>
                {filter !== "all" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
                  >
                    <X size={14} />
                    Clear filter
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp size={16} />
                <span>{stats.completionRate}% completion rate</span>
              </div>
            </div>

            {/* Tasks Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    expandedTask={expandedTask}
                    setExpandedTask={setExpandedTask}
                    toggleStatus={toggleStatus}
                    navigate={navigate}
                    handleDelete={handleDelete}
                    deletingId={deletingId}
                    getFormattedDate={getFormattedDate}
                    getDateColor={getDateColor}
                    getPriorityIcon={getPriorityIcon}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskRow
                    key={task._id}
                    task={task}
                    expandedTask={expandedTask}
                    setExpandedTask={setExpandedTask}
                    toggleStatus={toggleStatus}
                    navigate={navigate}
                    handleDelete={handleDelete}
                    deletingId={deletingId}
                    getFormattedDate={getFormattedDate}
                    getDateColor={getDateColor}
                    getPriorityIcon={getPriorityIcon}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ================= FOOTER ================= */}
        {!loading && tasks.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Progress Summary
                  </h3>
                  <p className="text-gray-600">
                    You've completed {stats.completed} of {stats.total} tasks
                    {stats.overdueTasks > 0 && (
                      <span className="text-red-600 font-medium ml-2">
                        ({stats.overdueTasks} overdue)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.completionRate}%
                    </div>
                    <div className="text-sm text-gray-600">Done</div>
                  </div>
                  <div className="relative w-48">
                    <div className="h-3 bg-white/80 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 rounded-full transition-all duration-1000"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                    <div className="absolute -top-1 left-0 transform -translate-x-1/2">
                      <div
                        className={`w-5 h-5 rounded-full border-4 border-white ${
                          stats.completionRate === 100
                            ? "bg-green-500 shadow-lg"
                            : "bg-blue-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/student/planner/add-task")}
                    className="px-5 py-2.5 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md border border-blue-100"
                  >
                    Add More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ================= TASK CARD COMPONENT =================
const TaskCard = ({
  task,
  expandedTask,
  setExpandedTask,
  toggleStatus,
  navigate,
  handleDelete,
  deletingId,
  getFormattedDate,
  getDateColor,
  getPriorityIcon,
}) => {
  const formattedDate = getFormattedDate(task.dueDate);
  const dateColor = getDateColor(task.dueDate);

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl ${
        task.status === "completed"
          ? "border-green-100 opacity-90"
          : "border-gray-100 hover:border-blue-200"
      }`}
    >
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <button
            onClick={() => toggleStatus(task)}
            className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.status === "completed"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 border-0"
                : "border-gray-300 hover:border-green-500 group-hover:border-green-400"
            }`}
          >
            {task.status === "completed" && (
              <CheckCircle size={16} className="text-white" />
            )}
          </button>

          <div className="flex items-center gap-2">
            {task.priority && getPriorityIcon(task.priority)}
            <button
              onClick={() =>
                setExpandedTask(expandedTask === task._id ? null : task._id)
              }
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {expandedTask === task._id ? (
                <ChevronUp size={18} />
              ) : (
                <MoreVertical size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Task Title */}
        <h3
          className={`font-bold text-lg mb-2 line-clamp-2 ${
            task.status === "completed"
              ? "text-gray-500 line-through"
              : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        <p
          className={`text-gray-600 mb-4 line-clamp-2 ${
            task.status === "completed" ? "opacity-60" : ""
          }`}
        >
          {task.description || "No description provided"}
        </p>

        {/* Expanded Details */}
        {expandedTask === task._id && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-slideDown">
            <div className="space-y-3">
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {task.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {formattedDate && (
              <span
                className={`flex items-center gap-1 text-sm font-medium ${dateColor}`}
              >
                <Calendar size={14} />
                {formattedDate}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/student/planner/edit/${task._id}`)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              disabled={deletingId === task._id}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Delete"
            >
              {deletingId === task._id ? (
                <div className="animate-spin">
                  <Circle size={16} />
                </div>
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div
        className={`h-1 rounded-b-2xl ${
          task.status === "completed"
            ? "bg-gradient-to-r from-green-400 to-emerald-500"
            : task.priority === "high"
            ? "bg-gradient-to-r from-red-400 to-pink-500"
            : "bg-gradient-to-r from-blue-400 to-indigo-400"
        }`}
      />
    </div>
  );
};

// ================= TASK ROW COMPONENT =================
const TaskRow = ({
  task,
  expandedTask,
  setExpandedTask,
  toggleStatus,
  navigate,
  handleDelete,
  deletingId,
  getFormattedDate,
  getDateColor,
  getPriorityIcon,
}) => {
  const formattedDate = getFormattedDate(task.dueDate);
  const dateColor = getDateColor(task.dueDate);

  return (
    <div
      className={`group bg-white rounded-xl border transition-all duration-200 hover:shadow-lg ${
        task.status === "completed"
          ? "border-green-100"
          : "border-gray-100 hover:border-blue-200"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Checkbox */}
          <button
            onClick={() => toggleStatus(task)}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.status === "completed"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 border-0"
                : "border-gray-300 hover:border-green-500 group-hover:border-green-400"
            }`}
          >
            {task.status === "completed" && (
              <CheckCircle size={14} className="text-white" />
            )}
          </button>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h3
                className={`font-semibold truncate ${
                  task.status === "completed"
                    ? "text-gray-500 line-through"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              <div className="flex items-center gap-2">
                {task.priority && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                    {getPriorityIcon(task.priority)}
                    {task.priority}
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status === "completed" ? "Completed" : "Pending"}
                </span>
              </div>
            </div>

            <p
              className={`text-sm text-gray-600 mt-1 line-clamp-1 ${
                task.status === "completed" ? "opacity-60" : ""
              }`}
            >
              {task.description || "No description"}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-4 mt-2">
              {formattedDate && (
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${dateColor}`}
                >
                  <Calendar size={12} />
                  {formattedDate}
                </span>
              )}
              {task.tags &&
                task.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/student/planner/edit/${task._id}`)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              disabled={deletingId === task._id}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Delete"
            >
              {deletingId === task._id ? (
                <div className="animate-spin">
                  <Circle size={16} />
                </div>
              ) : (
                <Trash2 size={16} />
              )}
            </button>
            <button
              onClick={() =>
                setExpandedTask(expandedTask === task._id ? null : task._id)
              }
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {expandedTask === task._id ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {expandedTask === task._id && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-slideDown">
            <div className="pl-10">
              <p className="text-gray-700">
                {task.description || "No description provided"}
              </p>
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm rounded-lg border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
