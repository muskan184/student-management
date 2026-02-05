import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Play,
  Brain,
  Pencil,
  BookOpen,
  Sparkles,
  Zap,
  Clock,
  Filter,
  Search,
  X,
  MoreVertical,
  ChevronRight,
  Loader2,
  Star,
  Target,
  BarChart3,
  Layers,
  BookMarked,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { deleteFlashcard, fetchFlashcards } from "../../../api/flashCardApi";

export default function FlashcardList() {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    loadFlashcards();
  }, []);

  useEffect(() => {
    filterAndSortCards();
  }, [flashcards, searchTerm, filter, sortBy]);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const data = await fetchFlashcards();
      setFlashcards(data);
    } catch {
      toast.error("Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCards = () => {
    let filtered = [...flashcards];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.title.toLowerCase().includes(term) ||
          (f.description && f.description.toLowerCase().includes(term)) ||
          (f.tags && f.tags.some((tag) => tag.toLowerCase().includes(term))),
      );
    }

    // Status filter
    if (filter === "recent") {
      // Show sets created in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((f) => new Date(f.createdAt) > weekAgo);
    } else if (filter === "large") {
      filtered = filtered.filter((f) => f.cards.length >= 10);
    } else if (filter === "small") {
      filtered = filtered.filter((f) => f.cards.length < 5);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      } else if (sortBy === "cards") {
        return b.cards.length - a.cards.length;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setFilteredCards(filtered);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this flashcard set? This action cannot be undone.",
      )
    )
      return;

    try {
      setDeletingId(id);
      await deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((f) => f._id !== id));
      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles size={16} />
          Flashcard set deleted successfully
        </div>,
      );
    } catch {
      toast.error("Failed to delete flashcard set");
    } finally {
      setDeletingId(null);
    }
  };

  const getDifficultyColor = (count) => {
    if (count >= 15) return "from-red-500 to-pink-600";
    if (count >= 10) return "from-orange-500 to-red-500";
    if (count >= 5) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-600";
  };

  const getCardCountText = (count) => {
    if (count === 0) return "No cards";
    if (count === 1) return "1 card";
    return `${count} cards`;
  };

  const stats = {
    total: flashcards.length,
    totalCards: flashcards.reduce((sum, set) => sum + set.cards.length, 0),
    avgCards:
      flashcards.length > 0
        ? Math.round(
            flashcards.reduce((sum, set) => sum + set.cards.length, 0) /
              flashcards.length,
          )
        : 0,
    largeSets: flashcards.filter((f) => f.cards.length >= 10).length,
    recentSets: flashcards.filter((f) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(f.createdAt) > weekAgo;
    }).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-25 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <Brain
              className="absolute -top-2 -right-2 text-blue-500 animate-pulse"
              size={20}
            />
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your flashcards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-25 to-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Flashcard Sets
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Master your knowledge with smart flashcards
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/student/flashcards/ai")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Lightbulb size={20} />
                AI Generate
              </button>
              <button
                onClick={() => navigate("/student/flashcards/create")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Create Set
              </button>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Sets
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.total}
                  </h2>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Layers className="text-blue-500" size={24} />
                </div>
              </div>
              <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000"
                  style={{
                    width: `${(stats.total / Math.max(stats.total, 1)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Cards
                  </p>
                  <h2 className="text-2xl font-bold text-green-600 mt-1">
                    {stats.totalCards}
                  </h2>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <BookMarked className="text-green-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Across all sets</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Avg per Set
                  </p>
                  <h2 className="text-2xl font-bold text-purple-600 mt-1">
                    {stats.avgCards}
                  </h2>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Target className="text-purple-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Cards per set</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Large Sets
                  </p>
                  <h2 className="text-2xl font-bold text-orange-600 mt-1">
                    {stats.largeSets}
                  </h2>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl">
                  <TrendingUp className="text-orange-500" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">10+ cards each</p>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
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
                  placeholder="Search flashcard sets..."
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
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="cards">Most Cards</option>
                    <option value="title">Alphabetical</option>
                  </select>
                  <ChevronRight
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>

                <div className="flex overflow-x-auto scrollbar-hide space-x-2">
                  {["all", "recent", "large", "small"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                        filter === f
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-[1.02]"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md"
                      }`}
                    >
                      {f === "all"
                        ? "All Sets"
                        : f === "recent"
                        ? "Recent"
                        : f === "large"
                        ? "Large Sets"
                        : "Small Sets"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FLASHCARD SETS GRID */}
        {filteredCards.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-blue-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {searchTerm ? "No matching sets" : "No flashcard sets yet"}
              </h3>
              <p className="text-gray-600 mb-8">
                {searchTerm
                  ? "No flashcard sets found matching your search. Try different keywords."
                  : "Start creating flashcard sets to boost your learning efficiency!"}
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
                  onClick={() => navigate("/student/flashcards/create")}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <Plus size={20} />
                  Create Your First Set
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">
                  {filteredCards.length}{" "}
                  {filteredCards.length === 1 ? "set" : "sets"} found
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
                <BarChart3 size={16} />
                <span>{stats.totalCards} total cards across all sets</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((set) => (
                <div
                  key={set._id}
                  className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                    hoveredCard === set._id
                      ? "border-blue-300"
                      : "border-gray-100"
                  }`}
                  onMouseEnter={() => setHoveredCard(set._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-3 h-3 rounded-full bg-gradient-to-r ${getDifficultyColor(
                              set.cards.length,
                            )}`}
                          ></div>
                          <h3 className="font-bold text-xl text-gray-900 truncate">
                            {set.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {set.description || "No description provided"}
                        </p>
                      </div>
                      {set.isStarred && (
                        <Star
                          className="text-yellow-500 fill-yellow-500"
                          size={18}
                        />
                      )}
                    </div>

                    {/* Card Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <BookMarked className="text-blue-500" size={16} />
                          <span className="font-semibold text-gray-900">
                            {getCardCountText(set.cards.length)}
                          </span>
                        </div>
                        {set.category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                            {set.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>
                          {set.createdAt
                            ? new Date(set.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )
                            : ""}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {set.tags && set.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {set.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                        {set.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            +{set.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/student/flashcards/play/${set._id}`)
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 group/play"
                        >
                          <Play
                            size={16}
                            className="group-hover/play:animate-pulse"
                          />
                          Study
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/student/flashcards/edit/${set._id}`)
                          }
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/student/flashcards/stats/${set._id}`)
                          }
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                          title="View Stats"
                        >
                          <BarChart3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(set._id)}
                          disabled={deletingId === set._id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === set._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    className={`h-1 rounded-b-2xl bg-gradient-to-r ${getDifficultyColor(
                      set.cards.length,
                    )}`}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* QUICK ACTIONS FOOTER */}
        {flashcards.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Ready to Study?
                  </h3>
                  <p className="text-gray-600">
                    You have {stats.totalCards} cards across {stats.total} sets
                    to review
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      const randomSet =
                        filteredCards[
                          Math.floor(Math.random() * filteredCards.length)
                        ];
                      if (randomSet) {
                        navigate(`/student/flashcards/play/${randomSet._id}`);
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md border border-blue-100"
                  >
                    <Zap size={18} />
                    Study Random Set
                  </button>
                  <button
                    onClick={() => navigate("/student/flashcards/create")}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus size={18} />
                    Create Another Set
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
