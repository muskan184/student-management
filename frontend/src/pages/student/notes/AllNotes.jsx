// src/pages/student/notes/AllNotes.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useOutletContext, useNavigate } from "react-router-dom";

import {
  Filter,
  ArrowLeft,
  Grid,
  List,
  Star,
  Pin,
  Trash2,
  Eye,
  Paperclip,
} from "lucide-react";

import { fetchNotes, deleteNote } from "../../../api/noteApi";

export default function AllNotes() {
  const outlet = useOutletContext() || {};
  const { setIsSidebarOpen } = outlet;

  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FILTER STATES ================= */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showStarred, setShowStarred] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [hasAttachment, setHasAttachment] = useState("");

  /* ================= VIEW ================= */
  const [view, setView] = useState("grid");

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const perPage = 6;

  /* ================= LOAD NOTES ================= */
  useEffect(() => {
    fetchNotes()
      .then((res) => {
        const updated = res.map((n) => ({
          ...n,
          isPinned: n.isPinned || false,
          isStarred: n.isStarred || false,
        }));
        setNotes(updated);
      })
      .catch(() => toast.error("Failed to load notes"))
      .finally(() => setLoading(false));
  }, []);

  /* ================= CLOSE LEFT SIDEBAR ================= */
  useEffect(() => {
    if (typeof setIsSidebarOpen === "function") {
      setIsSidebarOpen(false);
    }
  }, [setIsSidebarOpen]);

  /* ================= ACTIONS ================= */
  const handlePin = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleStar = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isStarred: !n.isStarred } : n))
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
    toast.success("Note deleted");
  };

  /* ================= FILTER LOGIC ================= */
  const filteredNotes = useMemo(() => {
    let data = [...notes];

    // Search
    if (search) {
      data = data.filter(
        (n) =>
          n.title?.toLowerCase().includes(search.toLowerCase()) ||
          n.content?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (category) data = data.filter((n) => n.category === category);

    // Subject
    if (subject) data = data.filter((n) => n.subject === subject);

    // Starred
    if (showStarred) data = data.filter((n) => n.isStarred);

    // Pinned
    if (showPinned) data = data.filter((n) => n.isPinned);

    // Attachment
    if (hasAttachment === "yes") data = data.filter((n) => n.fileUrl);
    if (hasAttachment === "no") data = data.filter((n) => !n.fileUrl);

    // Sorting
    if (sortBy === "new")
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (sortBy === "old")
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (sortBy === "az") data.sort((a, b) => a.title.localeCompare(b.title));

    if (sortBy === "za") data.sort((a, b) => b.title.localeCompare(a.title));

    // Always pinned on top
    data.sort((a, b) => b.isPinned - a.isPinned);

    return data;
  }, [
    notes,
    search,
    category,
    subject,
    sortBy,
    showStarred,
    showPinned,
    hasAttachment,
  ]);

  const totalPages = Math.ceil(filteredNotes.length / perPage);
  const visibleNotes = filteredNotes.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /* ================= UI ================= */
  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      {/* ========== FILTER PANEL ========== */}
      <aside className="w-64 bg-white rounded-lg shadow p-4 space-y-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <Filter size={18} /> Filters
        </h3>

        <input
          placeholder="Search..."
          className="w-full border px-3 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="w-full border px-3 py-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort</option>
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
          <option value="az">A - Z</option>
          <option value="za">Z - A</option>
        </select>

        <select
          className="w-full border px-3 py-2 rounded"
          value={hasAttachment}
          onChange={(e) => setHasAttachment(e.target.value)}
        >
          <option value="">Attachments</option>
          <option value="yes">With File</option>
          <option value="no">Without File</option>
        </select>

        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={showPinned}
            onChange={() => setShowPinned(!showPinned)}
          />
          Pinned only
        </label>

        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={showStarred}
            onChange={() => setShowStarred(!showStarred)}
          />
          Starred only
        </label>

        <button
          onClick={() => {
            setSearch("");
            setCategory("");
            setSubject("");
            setSortBy("");
            setShowPinned(false);
            setShowStarred(false);
            setHasAttachment("");
          }}
          className="w-full border rounded py-2 text-sm"
        >
          Reset Filters
        </button>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1">
        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 border rounded">
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-2xl font-semibold">All Notes</h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className={`p-2 border rounded ${
                view === "grid" && "bg-gray-100"
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 border rounded ${
                view === "list" && "bg-gray-100"
              }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* NOTES */}
        {loading ? (
          <p>Loading...</p>
        ) : visibleNotes.length === 0 ? (
          <p>No notes found</p>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 md:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {visibleNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white p-4 rounded shadow space-y-2"
              >
                <h3 className="font-semibold flex justify-between">
                  {note.title}
                  {note.isPinned && (
                    <Pin
                      className="text-yellow-500 fill-yellow-500"
                      size={14}
                    />
                  )}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {note.content}
                </p>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-3">
                    {note.fileUrl && (
                      <a href={note.fileUrl} target="_blank">
                        <Paperclip size={16} />
                      </a>
                    )}

                    <button onClick={() => handlePin(note._id)}>
                      <Pin
                        size={16}
                        className={
                          note.isPinned
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-500"
                        }
                      />
                    </button>

                    <button onClick={() => handleStar(note._id)}>
                      <Star
                        size={16}
                        className={
                          note.isStarred
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-500"
                        }
                      />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/student/notes/${note._id}`)}
                    >
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleDelete(note._id)}>
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1 && "bg-blue-600 text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
