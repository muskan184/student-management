import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchNotesById, updateNote } from "../../../api/noteApi";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  FileText,
  Tag,
  Edit2,
  Clock,
  Eye,
  Loader2,
  File,
  Link,
  Layers,
  Sparkles,
} from "lucide-react";

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [originalNote, setOriginalNote] = useState(null);

  /* ================= LOAD NOTE ================= */
  const loadNote = async () => {
    try {
      setIsLoading(true);

      const res = await fetchNotesById(id);

      // ✅ SAFELY extract note from API response
      const note = res?.note || res?.data || res;

      if (!note) throw new Error("Note not found");

      setTitle(note.title || "");
      setContent(note.content || "");
      setCategory(note.category || "General");
      setCharCount((note.content || "").length);
      setOriginalNote(note);
      setFileName(note.fileUrl ? "Existing file attached" : "");
    } catch (error) {
      console.error(error);
      toast.error("Error loading note");
      navigate("/student/notes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNote();
  }, [id]);

  /* ================= UPDATE NOTE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", content || "");
    formData.append("category", category);
    if (file) formData.append("file", file);

    try {
      await updateNote(id, formData);

      setLastSaved(new Date());
      toast.success("Note updated successfully ✨");

      setTimeout(() => {
        navigate(`/student/notes/${id}`);
      }, 800);
    } catch (error) {
      toast.error("Failed to update note");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= HANDLERS ================= */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName("");
  };

  const handleContentChange = (e) => {
    const value = e.target.value || "";
    setContent(value);
    setCharCount(value.length);
  };

  const handleCancel = () => {
    navigate(`/student/notes/${id}`);
  };

  /* ================= CATEGORIES ================= */
  const categories = [
    { value: "General", label: "General", color: "bg-blue-100 text-blue-800" },
    {
      value: "Study",
      label: "Study",
      color: "bg-emerald-100 text-emerald-800",
    },
    {
      value: "Important",
      label: "Important",
      color: "bg-amber-100 text-amber-800",
    },
    {
      value: "Project",
      label: "Project",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "Reference",
      label: "Reference",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "Personal",
      label: "Personal",
      color: "bg-pink-100 text-pink-800",
    },
  ];

  /* ================= LOADER ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={handleCancel} className="p-2 rounded-lg bg-gray-100">
            <ArrowLeft />
          </button>

          <button
            onClick={() => navigate(`/student/notes/${id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg"
          >
            <Eye size={18} />
            Preview
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate}>
          {/* TITLE */}
          <div className="mb-6">
            <label className="font-semibold flex gap-2 mb-2">
              <Edit2 size={16} /> Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-50"
              maxLength={100}
              placeholder="Note title"
            />
            <p className="text-sm text-gray-500 mt-1">
              {(title || "").length}/100
            </p>
          </div>

          {/* CONTENT */}
          <div className="mb-6">
            <label className="font-semibold flex gap-2 mb-2">
              <FileText size={16} /> Content
            </label>
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full p-4 rounded-lg bg-gray-50 min-h-[250px]"
              placeholder="Write your note..."
            />
            <p className="text-sm text-gray-500 mt-1">{charCount} characters</p>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setContent((content || "") + " **bold**")}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => setContent((content || "") + " *italic*")}
                className="px-3 py-1 bg-gray-200 rounded italic"
              >
                I
              </button>
              <button
                type="button"
                onClick={() => setContent((content || "") + "\n- ")}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                <Layers size={14} />
              </button>
            </div>
          </div>

          {/* CATEGORY */}
          <div className="mb-6">
            <label className="font-semibold flex gap-2 mb-2">
              <Tag size={16} /> Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-lg ${
                    category === cat.value ? cat.color : "bg-gray-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* FILE */}
          <div className="mb-8">
            <label className="font-semibold flex gap-2 mb-2">
              <Upload size={16} /> Attachment
            </label>

            {fileName ? (
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                <span>{fileName}</span>
                <X className="cursor-pointer" onClick={removeFile} />
              </div>
            ) : (
              <input type="file" onChange={handleFileChange} />
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setTitle(originalNote?.title || "");
                setContent(originalNote?.content || "");
                setCategory(originalNote?.category || "General");
                setFile(null);
                setFileName("");
                toast.success("Changes reset");
              }}
              className="px-4 py-2 bg-amber-100 rounded-lg"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* TIPS */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="flex items-center gap-2 font-semibold mb-2">
            <Sparkles size={16} /> Quick Tips
          </h3>
          <p className="text-sm text-gray-600">
            Use <b>#</b> for headings, <b>-</b> for lists, and markdown for
            formatting.
          </p>
        </div>
      </div>
    </div>
  );
}
