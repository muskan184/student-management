import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Calendar,
  Tag,
  Clock,
  AlertCircle,
  Sparkles,
  Zap,
  Target,
  Bell,
  Trash2,
  CheckCircle,
  X,
  CalendarDays,
  FileText,
  Flag,
  Star,
  History,
  Eye,
  EyeOff,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { fetchPlanners, updatePlanner } from "../../../api/plannerApi";
import { format, isToday, isTomorrow, isPast } from "date-fns";

export default function EditPlanner() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    date: "",
    tags: [],
    reminder: false,
    estimatedTime: "",
  });
  const [customTag, setCustomTag] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  /* LOAD EXISTING TASK */
  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        const planners = await fetchPlanners();
        const found = planners.find((p) => p._id === id);

        if (found) {
          setTask(found);
          const formattedDate = found.date ? found.date.split("T")[0] : "";
          const data = {
            title: found.title || "",
            description: found.description || "",
            status: found.status || "pending",
            priority: found.priority || "medium",
            date: formattedDate,
            tags: found.tags || [],
            reminder: found.reminder || false,
            estimatedTime: found.estimatedTime || "",
          };
          setFormData(data);
          setOriginalData(data);
        } else {
          toast.error("Task not found");
          navigate("/student/planner");
        }
      } catch (error) {
        toast.error("Failed to load task");
        navigate("/student/planner");
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id, navigate]);

  /* HANDLE INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* TAG MANAGEMENT */
  const addTag = (tag) => {
    if (!tag.trim()) return;
    if (formData.tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
      return;
    }
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }));
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  /* RESET TO ORIGINAL */
  const handleReset = () => {
    if (window.confirm("Reset all changes to original values?")) {
      setFormData(originalData);
      toast.success("Changes reset");
    }
  };

  /* UPDATE TASK */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!formData.date) {
      toast.error("Please select a due date");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        date: formData.date,
        tags: formData.tags,
        reminder: formData.reminder,
        estimatedTime: formData.estimatedTime,
        updatedAt: new Date().toISOString(),
      };

      await updatePlanner(id, updateData);

      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          Task updated successfully!
        </div>,
        { duration: 3000 },
      );

      // Navigate after success
      setTimeout(() => {
        navigate("/student/planner");
      }, 1000);
    } catch (error) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle size={18} />
          Failed to update task
        </div>,
      );
    } finally {
      setSaving(false);
    }
  };

  /* SUGGESTED TAGS */
  const suggestedTags = [
    "Urgent",
    "Study",
    "Work",
    "Personal",
    "Project",
    "Meeting",
    "Health",
    "Learning",
  ];

  /* PRIORITY OPTIONS */
  const priorityOptions = [
    {
      value: "high",
      label: "High Priority",
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: <Flag size={16} />,
    },
    {
      value: "medium",
      label: "Medium Priority",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: <Flag size={16} />,
    },
    {
      value: "low",
      label: "Low Priority",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <Flag size={16} />,
    },
  ];

  /* FORMAT DATE DISPLAY */
  const getDateDisplay = (dateString) => {
    if (!dateString) return "No due date";
    try {
      const date = new Date(dateString);
      if (isToday(date)) return "Today";
      if (isTomorrow(date)) return "Tomorrow";
      if (isPast(date)) return "Overdue";
      return format(date, "EEE, MMM dd");
    } catch {
      return "Invalid date";
    }
  };

  const getDateColor = (dateString) => {
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
  };

  /* CHECK IF CHANGES EXIST */
  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-25 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <Sparkles
              className="absolute -top-2 -right-2 text-blue-500 animate-pulse"
              size={20}
            />
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading task details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 to-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md group"
              >
                <ArrowLeft
                  size={20}
                  className="text-gray-600 group-hover:text-gray-900"
                />
              </button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                    <FileText className="text-white" size={24} />
                  </div>
                  Edit Task
                </h1>
                <p className="text-gray-600 mt-2">
                  Update task details and status
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {hasChanges && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              )}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
          </div>

          {/* Change Indicator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{
                  width: formData.title && formData.date ? "100%" : "50%",
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-medium rounded-full flex items-center gap-1">
                  <AlertCircle size={14} />
                  Unsaved Changes
                </span>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Form Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-blue-100">
                      <FileText className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Edit Task Details
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Update the information below
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        formData.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {formData.status === "completed"
                        ? "Completed"
                        : "Pending"}
                    </span>
                    {task?.createdAt && (
                      <span className="text-sm text-gray-500">
                        Created: {format(new Date(task.createdAt), "MMM dd")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* TITLE */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                    <Target size={18} />
                    Task Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="title"
                      placeholder="What needs to be done?"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      autoFocus
                    />
                    {formData.title && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="text-blue-600" size={14} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* DATE */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                    <CalendarDays size={18} />
                    Due Date *
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                      min={format(new Date(), "yyyy-MM-dd")}
                    />
                    {formData.date && (
                      <div
                        className={`mt-2 text-sm font-medium ${getDateColor(
                          formData.date,
                        )} flex items-center gap-2`}
                      >
                        <Calendar size={14} />
                        {getDateDisplay(formData.date)}
                        {getDateDisplay(formData.date) === "Overdue" && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            Attention Needed
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                    <FileText size={18} />
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      rows={4}
                      placeholder="Add detailed description, notes, or instructions..."
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-500"
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                      {formData.description.length}/500
                    </div>
                  </div>
                </div>

                {/* STATUS */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                    <CheckCircle size={18} />
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: "pending" }))
                      }
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        formData.status === "pending"
                          ? "bg-yellow-50 border-yellow-300 shadow-sm"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${
                            formData.status === "pending"
                              ? "bg-yellow-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <Clock
                            className={
                              formData.status === "pending"
                                ? "text-yellow-600"
                                : "text-gray-500"
                            }
                            size={20}
                          />
                        </div>
                        <span
                          className={`font-medium ${
                            formData.status === "pending"
                              ? "text-yellow-700"
                              : "text-gray-700"
                          }`}
                        >
                          Pending
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          status: "completed",
                        }))
                      }
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        formData.status === "completed"
                          ? "bg-green-50 border-green-300 shadow-sm"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${
                            formData.status === "completed"
                              ? "bg-green-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <CheckCircle
                            className={
                              formData.status === "completed"
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                            size={20}
                          />
                        </div>
                        <span
                          className={`font-medium ${
                            formData.status === "completed"
                              ? "text-green-700"
                              : "text-gray-700"
                          }`}
                        >
                          Completed
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* TAGS */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                    <Tag size={18} />
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Add a tag (press Enter)"
                          value={customTag}
                          onChange={(e) => setCustomTag(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && addTag(customTag)
                          }
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => addTag(customTag)}
                        className="px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>

                    {/* Tag Suggestions */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              !formData.tags.includes(tag) && addTag(tag)
                            }
                            disabled={formData.tags.includes(tag)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                              formData.tags.includes(tag)
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selected Tags */}
                    {formData.tags.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Selected tags:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm rounded-lg border border-blue-100"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ADVANCED OPTIONS TOGGLE */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border">
                      <Zap className="text-gray-600" size={18} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">
                        Advanced Options
                      </h3>
                      <p className="text-sm text-gray-600">
                        Priority, reminders, time estimates
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${
                      showAdvanced ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>

                {/* ADVANCED OPTIONS */}
                {showAdvanced && (
                  <div className="space-y-6 animate-slideDown">
                    {/* PRIORITY */}
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                        <Flag size={18} />
                        Priority Level
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {priorityOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                priority: option.value,
                              }))
                            }
                            className={`p-4 rounded-xl border transition-all duration-200 ${
                              formData.priority === option.value
                                ? `${option.bgColor} border-${
                                    option.color.split("-")[1]
                                  }-300 shadow-sm`
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className={`${option.color}`}>
                                {option.icon}
                              </div>
                              <span
                                className={`font-medium text-sm ${
                                  formData.priority === option.value
                                    ? option.color
                                    : "text-gray-700"
                                }`}
                              >
                                {option.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ESTIMATED TIME */}
                    <div>
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                        <Clock size={18} />
                        Estimated Time
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="estimatedTime"
                          placeholder="e.g., 2 hours, 30 minutes"
                          value={formData.estimatedTime}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* REMINDER */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border">
                          <Bell className="text-gray-600" size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Set Reminder
                          </h3>
                          <p className="text-sm text-gray-600">
                            Get notified before due date
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.reminder}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              reminder: e.target.checked,
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={saving || !formData.title || !formData.date}
                      className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                        saving || !formData.title || !formData.date
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          Update Task
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/student/planner")}
                      className="px-8 py-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN - PREVIEW & INFO */}
          <div className="space-y-6">
            {/* TASK PREVIEW */}
            {showPreview && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 bg-gradient-to-r from-blue-500 to-indigo-500">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Eye size={18} />
                    Live Preview
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 w-5 h-5 rounded-full border-2 ${
                        formData.status === "completed"
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.status === "completed" && (
                        <CheckCircle
                          size={12}
                          className="text-white mt-0.5 ml-0.5"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`font-semibold truncate ${
                          formData.status === "completed"
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {formData.title || "Untitled Task"}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {formData.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {formData.date && (
                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${getDateColor(
                          formData.date,
                        )}`}
                      >
                        <Calendar size={14} />
                        <span>Due: {getDateDisplay(formData.date)}</span>
                      </div>
                    )}

                    {formData.priority && (
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg ${
                          formData.priority === "high"
                            ? "bg-red-100 text-red-700"
                            : formData.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        <Flag size={14} />
                        {formData.priority} priority
                      </div>
                    )}

                    {formData.estimatedTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock size={14} />
                        <span>Estimate: {formData.estimatedTime}</span>
                      </div>
                    )}

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TASK INFO */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <History size={18} />
                  Task Information
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium text-gray-900">
                      {task?.createdAt
                        ? format(new Date(task.createdAt), "PPpp")
                        : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium text-gray-900">
                      {task?.updatedAt
                        ? format(new Date(task.updatedAt), "PPpp")
                        : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Task ID</p>
                    <p className="font-mono text-xs text-gray-600 truncate">
                      {id}
                    </p>
                  </div>
                </div>

                {/* Quick Status */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">
                      Current Status
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        formData.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {formData.status === "completed"
                        ? "Completed"
                        : "Pending"}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        status:
                          prev.status === "completed" ? "pending" : "completed",
                      }))
                    }
                    className="w-full py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            </div>

            {/* CHANGE INDICATOR */}
            {hasChanges && (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="text-yellow-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Unsaved Changes
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      You have made changes to this task. Click "Update Task" to
                      save them.
                    </p>
                    <button
                      onClick={handleReset}
                      className="mt-3 text-sm text-yellow-700 hover:text-yellow-800 font-medium flex items-center gap-1"
                    >
                      <RotateCcw size={14} />
                      Reset all changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DELETE OPTION */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-red-50/50 to-pink-50/50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Trash2 size={18} />
                  Danger Zone
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4">
                  Once deleted, this task cannot be recovered.
                </p>
                <button
                  onClick={() => navigate(`/student/planner/delete/${id}`)}
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow hover:shadow-md"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <AlertCircle size={16} />
                All fields marked with * are required
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {hasChanges ? "You have unsaved changes" : "All changes saved"}
              </span>
              <button
                onClick={() => navigate("/student/planner")}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Back to Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
