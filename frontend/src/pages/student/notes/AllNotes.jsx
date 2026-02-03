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
  Search,
  X,
  Calendar,
  FileText,
  Tag,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
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
  const perPage = 9;

  /* ================= LOAD NOTES ================= */
  useEffect(() => {
    fetchNotes()
      .then((res) => {
        const updated = res.map((n) => ({
          ...n,
          isPinned: n.isPinned || false,
          isStarred: n.isStarred || false,
          color: getRandomColor(),
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
      prev.map((n) => (n._id === id ? { ...n, isPinned: !n.isPinned } : n)),
    );
    toast.success("Note status updated");
  };

  const handleStar = (id) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isStarred: !n.isStarred } : n)),
    );
    toast.success("Note status updated");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note permanently?")) return;
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
          n.content?.toLowerCase().includes(search.toLowerCase()),
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
    page * perPage,
  );

  /* ================= HELPER FUNCTIONS ================= */
  const getRandomColor = () => {
    const colors = [
      "bg-gradient-to-br from-emerald-50 to-teal-100 border-l-4 border-emerald-400",
      "bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-blue-400",
      "bg-gradient-to-br from-violet-50 to-purple-100 border-l-4 border-violet-400",
      "bg-gradient-to-br from-amber-50 to-orange-100 border-l-4 border-amber-400",
      "bg-gradient-to-br from-rose-50 to-pink-100 border-l-4 border-rose-400",
      "bg-gradient-to-br from-cyan-50 to-sky-100 border-l-4 border-cyan-400",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-x-1 group"
            >
              <ArrowLeft
                size={20}
                className="text-gray-600 group-hover:text-blue-600 transition-colors"
              />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                My Notes
              </h1>
              <p className="text-gray-500 mt-1">
                {filteredNotes.length} notes available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search notes..."
                className="pl-12 pr-4 py-3 w-80 rounded-xl border-0 bg-white shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex gap-2 bg-white p-1 rounded-xl shadow-md">
              <button
                onClick={() => setView("grid")}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  view === "grid"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  view === "list"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-2xl shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Notes</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {notes.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white shadow-sm">
                <FileText className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-5 rounded-2xl shadow-sm border border-emerald-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Pinned</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {notes.filter((n) => n.isPinned).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white shadow-sm">
                <Pin className="text-emerald-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-5 rounded-2xl shadow-sm border border-amber-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Starred</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {notes.filter((n) => n.isStarred).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white shadow-sm">
                <Star className="text-amber-500" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-50 to-violet-100 p-5 rounded-2xl shadow-sm border border-violet-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-violet-600 font-medium">
                  With Files
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {notes.filter((n) => n.fileUrl).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white shadow-sm">
                <Paperclip className="text-violet-500" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* ========== FILTER PANEL ========== */}
        <aside className="w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter size={20} className="text-blue-500" />
                Filters & Sorting
              </h3>
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
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset all
              </button>
            </div>

            <div className="space-y-6">
              {/* Sorting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="new">Newest First</option>
                  <option value="old">Oldest First</option>
                  <option value="az">A → Z</option>
                  <option value="za">Z → A</option>
                </select>
              </div>

              {/* Attachment Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachment
                </label>
                <select
                  className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm"
                  value={hasAttachment}
                  onChange={(e) => setHasAttachment(e.target.value)}
                >
                  <option value="">All Notes</option>
                  <option value="yes">With Files</option>
                  <option value="no">Without Files</option>
                </select>
              </div>

              {/* Quick Filters */}
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-300 group">
                  <span className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow">
                      <Pin size={16} className="text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      Pinned Only
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={showPinned}
                    onChange={() => setShowPinned(!showPinned)}
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-300 group">
                  <span className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow">
                      <Star size={16} className="text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-700">
                      Starred Only
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={showStarred}
                    onChange={() => setShowStarred(!showStarred)}
                  />
                </label>
              </div>

              {/* Active Filters */}
              {(search ||
                category ||
                subject ||
                sortBy ||
                showPinned ||
                showStarred ||
                hasAttachment) && (
                <div className="pt-6 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Active Filters
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {search && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm">
                        Search: {search}
                        <button onClick={() => setSearch("")}>
                          <X size={14} />
                        </button>
                      </span>
                    )}
                    {showPinned && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm">
                        Pinned
                        <button onClick={() => setShowPinned(false)}>
                          <X size={14} />
                        </button>
                      </span>
                    )}
                    {showStarred && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm">
                        Starred
                        <button onClick={() => setShowStarred(false)}>
                          <X size={14} />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <main className="flex-1">
          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading your notes...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {visibleNotes.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No notes found
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {filteredNotes.length === 0
                      ? "You haven't created any notes yet."
                      : "Try adjusting your filters to see more results."}
                  </p>
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
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Notes Grid/List */}
                  <div
                    className={
                      view === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {visibleNotes.map((note) => (
                      <div
                        key={note._id}
                        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group ${
                          view === "list" ? "flex" : ""
                        } ${note.color}`}
                      >
                        {/* Note Color Accent */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600"></div>

                        <div
                          className={`p-6 ${view === "list" ? "flex-1" : ""}`}
                        >
                          {/* Note Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                {note.isPinned && (
                                  <Pin
                                    className="text-amber-500 fill-amber-500"
                                    size={16}
                                  />
                                )}
                                <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                                  {note.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  {formatDate(note.createdAt)}
                                </span>
                                {note.category && (
                                  <span className="flex items-center gap-1">
                                    <Tag size={14} />
                                    {note.category}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button className="p-2 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <MoreVertical
                                size={18}
                                className="text-gray-500"
                              />
                            </button>
                          </div>

                          {/* Note Content */}
                          <p className="text-gray-600 mb-6 line-clamp-3">
                            {note.content}
                          </p>

                          {/* Note Footer */}
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              {note.fileUrl && (
                                <a
                                  href={note.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                                >
                                  <Paperclip size={16} />
                                  <span className="text-sm font-medium">
                                    Attachment
                                  </span>
                                </a>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handlePin(note._id)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group/pin"
                                title={
                                  note.isPinned ? "Unpin note" : "Pin note"
                                }
                              >
                                <Pin
                                  size={18}
                                  className={
                                    note.isPinned
                                      ? "text-amber-500 fill-amber-500"
                                      : "text-gray-400 group-hover/pin:text-amber-500"
                                  }
                                />
                              </button>

                              <button
                                onClick={() => handleStar(note._id)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group/star"
                                title={
                                  note.isStarred ? "Unstar note" : "Star note"
                                }
                              >
                                <Star
                                  size={18}
                                  className={
                                    note.isStarred
                                      ? "text-amber-500 fill-amber-500"
                                      : "text-gray-400 group-hover/star:text-amber-500"
                                  }
                                />
                              </button>

                              <button
                                onClick={() =>
                                  navigate(`/student/notes/${note._id}`)
                                }
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                                title="View note"
                              >
                                <Eye size={18} className="text-gray-600" />
                              </button>

                              <button
                                onClick={() => handleDelete(note._id)}
                                className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-300"
                                title="Delete note"
                              >
                                <Trash2
                                  size={18}
                                  className="text-red-400 hover:text-red-600"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
                      <p className="text-gray-600">
                        Showing{" "}
                        <span className="font-semibold">
                          {(page - 1) * perPage + 1}
                        </span>
                        -
                        <span className="font-semibold">
                          {Math.min(page * perPage, filteredNotes.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                          {filteredNotes.length}
                        </span>{" "}
                        notes
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                          className="p-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-300"
                        >
                          <ChevronLeft size={20} />
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }).map(
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (page <= 3) {
                              pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = page - 2 + i;
                            }

                            return (
                              <button
                                key={i}
                                onClick={() => setPage(pageNum)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                  page === pageNum
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}

                        {totalPages > 5 && page < totalPages - 2 && (
                          <>
                            <span className="px-2 text-gray-400">...</span>
                            <button
                              onClick={() => setPage(totalPages)}
                              className={`px-4 py-2 rounded-xl font-medium ${
                                page === totalPages
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setPage(page + 1)}
                          disabled={page === totalPages}
                          className="p-2 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all duration-300"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
