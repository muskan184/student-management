import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Upload,
  BookOpen,
  Tag,
  File,
  Type,
  Book,
  Calendar,
  PlusCircle,
  Sparkles,
  X,
  Loader2,
  Paperclip,
  GraduationCap,
  ClipboardCheck,
  Target,
  FileCheck,
  Bookmark,
  Search,
  Zap,
  Link,
  Image,
  FileUp,
} from "lucide-react";

import { createNote } from "../../../api/noteApi";

const CreateNote = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    category: "",
    content: "",
  });

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });

  const categories = [
    {
      value: "lecture",
      label: "Lecture Notes",
      icon: <GraduationCap size={18} />,
      color: "bg-blue-100 text-blue-700 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      value: "assignment",
      label: "Assignment",
      icon: <ClipboardCheck size={18} />,
      color: "bg-purple-100 text-purple-700 border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      value: "project",
      label: "Project Work",
      icon: <Target size={18} />,
      color: "bg-amber-100 text-amber-700 border-amber-200",
      iconColor: "text-amber-600",
    },
    {
      value: "exam",
      label: "Exam Prep",
      icon: <FileCheck size={18} />,
      color: "bg-rose-100 text-rose-700 border-rose-200",
      iconColor: "text-rose-600",
    },
    {
      value: "personal",
      label: "Personal Notes",
      icon: <Bookmark size={18} />,
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      iconColor: "text-emerald-600",
    },
    {
      value: "research",
      label: "Research",
      icon: <Search size={18} />,
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
      iconColor: "text-cyan-600",
    },
  ];

  const mutation = useMutation({
    mutationFn: (formData) => createNote(formData),
    onSuccess: () => {
      toast.success("Note created successfully!");
      setTimeout(() => navigate("/student/notes"), 1500);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to create note");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.subject || !form.category || !form.content) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("subject", form.subject);
    formData.append("category", form.category);
    formData.append("content", form.content);

    if (file) {
      formData.append("file", file);
    }

    mutation.mutate(formData);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/20 p-4 md:p-8">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 blur-3xl"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-purple-50/50 blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="group p-3 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <ArrowLeft className="text-gray-600 group-hover:text-blue-600 group-hover:-translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-100 rounded-2xl shadow-lg">
                  <FileText size={28} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
                    Create New Note
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Capture knowledge, organize thoughts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <PlusCircle className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Note Information
                </h2>
                <p className="text-gray-600 text-sm">
                  Fill in the details below to create your note
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-100 rounded">
                  <Type className="text-blue-600" size={18} />
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Title *
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    {charCount.title}/100 characters
                  </span>
                </label>
              </div>
              <input
                type="text"
                placeholder="Enter a descriptive title for your note..."
                value={form.title}
                onChange={(e) => {
                  setForm({ ...form, title: e.target.value });
                  setCharCount({ ...charCount, title: e.target.value.length });
                }}
                maxLength={100}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-900 placeholder-gray-500 text-lg shadow-sm"
                required
              />
            </div>

            {/* Subject & Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-emerald-100 rounded">
                    <Book className="text-emerald-600" size={18} />
                  </div>
                  <label className="text-lg font-semibold text-gray-900">
                    Subject *
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g., Mathematics, Computer Science..."
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-900 placeholder-gray-500 shadow-sm"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-purple-100 rounded">
                    <Tag className="text-purple-600" size={18} />
                  </div>
                  <label className="text-lg font-semibold text-gray-900">
                    Category *
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.value}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat.value })}
                      whileTap={{ scale: 0.98 }}
                      className={`px-4 py-3.5 rounded-xl text-center transition-all border flex flex-col items-center gap-2 ${
                        form.category === cat.value
                          ? `${
                              cat.color
                            } border-2 ring-2 ring-opacity-20 ${cat.color
                              .split(" ")[0]
                              .replace("bg-", "ring-")}`
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          form.category === cat.value
                            ? "bg-white"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className={cat.iconColor}>{cat.icon}</div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {cat.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-amber-100 rounded">
                  <BookOpen className="text-amber-600" size={18} />
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Description
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Optional)
                  </span>
                </label>
              </div>
              <textarea
                placeholder="Add a brief description or summary of your note..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-900 placeholder-gray-500 shadow-sm resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-100 rounded">
                    <FileText className="text-rose-600" size={18} />
                  </div>
                  <label className="text-lg font-semibold text-gray-900">
                    Content *
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      {charCount.content}/5000 characters
                    </span>
                  </label>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Zap size={14} />
                  Write detailed notes here...
                </div>
              </div>
              <textarea
                placeholder="Write your detailed notes here. You can include code snippets, formulas, diagrams descriptions, etc..."
                rows={8}
                value={form.content}
                onChange={(e) => {
                  setForm({ ...form, content: e.target.value });
                  setCharCount({
                    ...charCount,
                    content: e.target.value.length,
                  });
                }}
                maxLength={5000}
                className="w-full px-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-900 placeholder-gray-500 shadow-sm resize-none font-mono"
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-cyan-100 rounded">
                  <Upload className="text-cyan-600" size={18} />
                </div>
                <label className="text-lg font-semibold text-gray-900">
                  Attachments
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Optional) - PDF, Images, Documents
                  </span>
                </label>
              </div>

              <AnimatePresence>
                {file ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-blue-100">
                          <Paperclip className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {fileName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <X
                          className="text-gray-400 hover:text-red-500"
                          size={18}
                        />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      isDragging
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="max-w-sm mx-auto">
                      <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl mb-4 border border-blue-100">
                        <div className="flex items-center gap-3">
                          <FileUp className="text-blue-500" size={28} />
                          <Upload className="text-blue-400" size={24} />
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2 font-medium">
                        Drag & drop files here
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        or click to browse files from your device
                      </p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                        />
                        <div className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors inline-flex items-center gap-2">
                          <File className="text-gray-500" size={16} />
                          Browse Files
                        </div>
                      </label>
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <File className="size-3" />
                          PDF
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <FileText className="size-3" />
                          DOC
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Image className="size-3" />
                          IMG
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Paperclip className="size-3" />
                          TXT
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        Maximum file size: 10MB
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>*
                  Required fields
                </div>
                <button
                  type="submit"
                  disabled={mutation.isLoading}
                  className="group px-10 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                >
                  {mutation.isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Creating Note...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles
                        className="group-hover:rotate-12 transition-transform"
                        size={20}
                      />
                      <span>Create Note</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3">
                Tips for Great Notes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-100 rounded">
                    <Type className="text-blue-600" size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      Use Descriptive Titles
                    </p>
                    <p className="text-gray-600 text-xs">
                      Summarize content clearly in the title
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-emerald-100 rounded">
                    <BookOpen className="text-emerald-600" size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      Organize Content
                    </p>
                    <p className="text-gray-600 text-xs">
                      Use headings and bullet points
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-purple-100 rounded">
                    <Tag className="text-purple-600" size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      Choose Categories
                    </p>
                    <p className="text-gray-600 text-xs">
                      Organize notes for easy retrieval
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-cyan-100 rounded">
                    <Paperclip className="text-cyan-600" size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      Attach Files
                    </p>
                    <p className="text-gray-600 text-xs">
                      Add diagrams, formulas, references
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateNote;
