// src/pages/student/notes/CreateNote.jsx

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createNote } from "../../../api/noteApi";

const CreateNote = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    category: "", // ⭐ NEW FIELD
    content: "", // REQUIRED
  });

  const [file, setFile] = useState(null);

  const mutation = useMutation({
    mutationFn: (formData) => createNote(formData),
    onSuccess: () => {
      toast.success("Note created successfully!");
      navigate("/student/notes");
    },
    onError: (err) => {
      console.log(err);
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
    formData.append("category", form.category); // ⭐ ADD CATEGORY
    formData.append("content", form.content);

    if (file) {
      formData.append("file", file);
    }

    mutation.mutate(formData);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Note</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white shadow-md p-6 rounded-md border"
      >
        {/* TITLE */}
        <div>
          <label className="font-semibold">Title *</label>
          <input
            type="text"
            className="input input-bordered w-full mt-1"
            placeholder="Enter title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* SUBJECT */}
        <div>
          <label className="font-semibold">Subject *</label>
          <input
            type="text"
            className="input input-bordered w-full mt-1"
            placeholder="Subject name"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
        </div>

        {/* CATEGORY (NEW) */}
        <div>
          <label className="font-semibold">Category *</label>
          <select
            className="select select-bordered w-full mt-1"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Select a category</option>
            <option value="Study">Study</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Practice">Practice</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-semibold">Description</label>
          <textarea
            className="textarea textarea-bordered w-full mt-1"
            placeholder="Short description (optional)"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
        </div>

        {/* CONTENT */}
        <div>
          <label className="font-semibold">Content *</label>
          <textarea
            className="textarea textarea-bordered w-full mt-1"
            placeholder="Write full note content here..."
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          ></textarea>
        </div>

        {/* FILE UPLOAD */}
        <div>
          <label className="font-semibold">Upload File (Optional)</label>
          <input
            type="file"
            className="file-input file-input-bordered w-full mt-1"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Creating..." : "Create Note"}
        </button>
      </form>
    </div>
  );
};

export default CreateNote;
