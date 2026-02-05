import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Plus,
  ChevronDown,
  Check,
  CalendarDays,
  FileText,
  Flag,
  Star,
} from "lucide-react";
import { createPlanner } from "../../../api/plannerApi";
import { format } from "date-fns";

export default function CreatePlanner() {
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  /* ================= HANDLE INPUT CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= TAG MANAGEMENT ================= */
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

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    if (!formData.date) {
      toast.error("Please select a due date");
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.date,
        tags: formData.tags,
        reminder: formData.reminder,
        estimatedTime: formData.estimatedTime,
      };

      await createPlanner(taskData);

      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          Task created successfully!
        </div>,
        { duration: 3000 },
      );

      // Navigate after a brief success animation
      setTimeout(() => {
        navigate("/student/planner");
      }, 800);
    } catch (error) {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle size={18} />
          Failed to create task
        </div>,
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUGGESTED TAGS ================= */
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

  /* ================= PRIORITY OPTIONS ================= */
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

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 to-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
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
                  <Plus className="text-white" size={24} />
                </div>
                Create New Task
              </h1>
              <p className="text-gray-600 mt-2">
                Plan your tasks efficiently with all the details
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{
                  width: formData.title && formData.date ? "100%" : "50%",
                }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {formData.title && formData.date
                ? "Ready to save"
                : "Add details"}
            </span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Form Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-blue-100">
                    <FileText className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Task Details
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Fill in the essential information
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-6">
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
                          <Check className="text-blue-600" size={14} />
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
                      <div className="mt-2 text-sm text-gray-600">
                        {format(new Date(formData.date), "EEEE, MMMM do, yyyy")}
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
                        Estimated Time (Optional)
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
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - PREVIEW & ACTIONS */}
          <div className="space-y-6">
            {/* PREVIEW CARD */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-blue-500 to-indigo-500">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Sparkles size={18} />
                  Task Preview
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {formData.title ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 w-5 h-5 rounded-full border-2 ${
                          formData.status === "completed"
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {formData.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {formData.description || "No description"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {formData.date && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar size={14} />
                          <span>
                            Due: {format(new Date(formData.date), "MMM dd")}
                          </span>
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
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-gray-400" size={24} />
                    </div>
                    <p className="text-gray-600">
                      Fill in details to see preview
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="sticky top-6 space-y-4">
              <button
                onClick={handleSave}
                disabled={loading || !formData.title || !formData.date}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                  loading || !formData.title || !formData.date
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Create Task
                  </>
                )}
              </button>

              <button
                onClick={() => navigate("/student/planner")}
                className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Title</span>
                  <span
                    className={`text-sm font-medium ${
                      formData.title ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formData.title ? "✓" : "Required"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Due Date</span>
                  <span
                    className={`text-sm font-medium ${
                      formData.date ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formData.date ? "✓" : "Required"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tags</span>
                  <span className="text-sm font-medium text-blue-600">
                    {formData.tags.length} added
                  </span>
                </div>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    status: "pending",
                    priority: "medium",
                    date: "",
                    tags: [],
                    reminder: false,
                    estimatedTime: "",
                  });
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear Form
              </button>
              <button
                onClick={() => navigate("/student/planner")}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                View All Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
