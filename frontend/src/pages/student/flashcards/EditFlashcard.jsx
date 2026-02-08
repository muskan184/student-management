import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  RotateCcw,
  Edit2,
  FileText,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
  Scissors,
  LayoutGrid,
  List,
  Hash,
  Clock,
  Zap,
  BarChart3,
  Download,
  Share2,
  Bookmark,
  Star,
  Settings,
  Palette,
  Image,
  Volume2,
  Link,
  Code,
  Calculator,
  Globe,
  Music,
  Brain,
  Target,
} from "lucide-react";
import { fetchFlashcardById, updateFlashcard } from "../../../api/flashCardApi";

export default function EditFlashcard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [expandedCard, setExpandedCard] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedColor, setSelectedColor] = useState("emerald");

  // Color options
  const colorOptions = [
    {
      id: "emerald",
      name: "Emerald",
      bg: "bg-emerald-100",
      border: "border-emerald-500",
      text: "text-emerald-800",
    },
    {
      id: "blue",
      name: "Blue",
      bg: "bg-blue-100",
      border: "border-blue-500",
      text: "text-blue-800",
    },
    {
      id: "purple",
      name: "Purple",
      bg: "bg-purple-100",
      border: "border-purple-500",
      text: "text-purple-800",
    },
    {
      id: "amber",
      name: "Amber",
      bg: "bg-amber-100",
      border: "border-amber-500",
      text: "text-amber-800",
    },
    {
      id: "rose",
      name: "Rose",
      bg: "bg-rose-100",
      border: "border-rose-500",
      text: "text-rose-800",
    },
    {
      id: "indigo",
      name: "Indigo",
      bg: "bg-indigo-100",
      border: "border-indigo-500",
      text: "text-indigo-800",
    },
  ];

  useEffect(() => {
    loadFlashcard();
  }, [id]);

  const loadFlashcard = async () => {
    try {
      setLoading(true);
      const data = await fetchFlashcardById(id);
      setTitle(data.title || "");
      setCards(data.cards || []);
      setSelectedColor(data.color || "emerald");

      // Add current state to history for undo functionality
      setHistory([
        {
          title: data.title,
          cards: JSON.parse(JSON.stringify(data.cards || [])),
          timestamp: new Date().toISOString(),
        },
      ]);

      toast.success(
        <div className="flex items-center space-x-2">
          <Edit2 className="w-5 h-5 text-blue-500" />
          <span>Flashcard loaded for editing ✏️</span>
        </div>,
        {
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#3b82f6",
            color: "#fff",
          },
        },
      );
    } catch (error) {
      toast.error("Failed to load flashcard", {
        icon: "❌",
      });
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = () => {
    const newCard = {
      question: "",
      answer: "",
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        difficulty: 1,
        tags: [],
      },
    };
    setCards([...cards, newCard]);

    // Expand the new card
    setExpandedCard(cards.length);

    toast.success("New card added!", {
      icon: "➕",
      position: "bottom-right",
    });
  };

  const handleRemoveCard = (index) => {
    if (cards.length === 1) {
      toast.error("At least one card is required");
      return;
    }

    const removedCard = cards[index];
    const updatedCards = cards.filter((_, i) => i !== index);

    // Add to history for undo
    setHistory((prev) => [
      ...prev,
      {
        action: "delete",
        card: removedCard,
        index,
        timestamp: new Date().toISOString(),
      },
    ]);

    setCards(updatedCards);

    if (expandedCard === index) {
      setExpandedCard(null);
    }

    toast.success(
      <div className="flex items-center space-x-2">
        <Trash2 className="w-4 h-4" />
        <span>Card removed</span>
        <button
          onClick={() => {
            // Undo logic would go here
            toast.success("Undo not implemented in this example");
          }}
          className="ml-2 text-sm underline hover:no-underline"
        >
          Undo
        </button>
      </div>,
      { duration: 4000 },
    );
  };

  const handleUpdateCard = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    updatedCards[index].metadata = {
      ...updatedCards[index].metadata,
      modified: new Date().toISOString(),
    };
    setCards(updatedCards);
  };

  const handleDuplicateCard = (index) => {
    const cardToDuplicate = { ...cards[index] };
    cardToDuplicate.metadata = {
      ...cardToDuplicate.metadata,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    };

    const updatedCards = [...cards];
    updatedCards.splice(index + 1, 0, cardToDuplicate);
    setCards(updatedCards);

    toast.success("Card duplicated!", {
      icon: "📋",
    });
  };

  const handleMoveCard = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= cards.length) return;

    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);

    toast.success("Card moved!", {
      icon: "↕️",
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required", {
        icon: "📝",
      });
      return;
    }

    if (cards.some((c) => !c.question?.trim() || !c.answer?.trim())) {
      toast.error("Please fill all questions & answers", {
        icon: "⚠️",
      });
      return;
    }

    try {
      setSaving(true);
      await updateFlashcard(id, {
        title,
        cards,
        color: selectedColor,
        updatedAt: new Date().toISOString(),
      });

      toast.success(
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Save className="w-6 h-6 text-green-500" />
            <span className="font-bold text-lg">Flashcard Updated! 🎉</span>
          </div>
          <div className="text-sm">{cards.length} cards saved successfully</div>
        </div>,
        {
          duration: 5000,
          style: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            padding: "16px",
          },
        },
      );

      setTimeout(() => {
        navigate("/student/flashcards");
      }, 1500);
    } catch (error) {
      toast.error("Failed to update flashcard", {
        icon: "❌",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const previousState = history[history.length - 2];
      setTitle(previousState.title || "");
      setCards(previousState.cards || []);
      setHistory(history.slice(0, -1));

      toast.success("Changes reverted!", {
        icon: "↩️",
      });
    }
  };

  // Calculate statistics
  const totalCards = cards.length;
  const completedCards = cards.filter(
    (card) => card.question?.trim() && card.answer?.trim(),
  ).length;
  const progress =
    totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;
  const totalCharacters = cards.reduce(
    (sum, card) =>
      sum + (card.question?.length || 0) + (card.answer?.length || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-emerald-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <Edit2 className="w-12 h-12 text-emerald-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-gray-900">
            Loading Flashcard...
          </h2>
          <p className="text-gray-600 mt-2">Preparing editing interface</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-sm">
                  <Edit2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Edit Flashcard
                  </h1>
                  <p className="text-sm text-gray-600">
                    Modify your flashcard set
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Stats */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalCards}
                  </div>
                  <div className="text-xs text-gray-600">Cards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {progress}%
                  </div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalCharacters}
                  </div>
                  <div className="text-xs text-gray-600">Characters</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleUndo}
                  disabled={history.length <= 1}
                  className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-semibold">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span className="font-semibold">Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Set Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Set Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Set Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Enter flashcard set title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color.id)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          color.bg
                        } ${
                          selectedColor === color.id
                            ? color.border + " border-2"
                            : "border-transparent"
                        } hover:scale-105`}
                        title={color.name}
                      >
                        <div className={`text-xs font-medium ${color.text}`}>
                          {color.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddCard}
                  className="w-full flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-emerald-500 rounded-lg">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-emerald-700">
                      Add New Card
                    </span>
                  </div>
                  <span className="text-sm text-emerald-600">+</span>
                </button>

                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-blue-500 rounded-lg">
                      {showPreview ? (
                        <EyeOff className="w-4 h-4 text-white" />
                      ) : (
                        <Eye className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium text-blue-700">
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </span>
                  </div>
                  <span className="text-sm text-blue-600">👁️</span>
                </button>

                <button
                  onClick={() => {
                    const text = cards
                      .map((card) => `${card.question}\n${card.answer}\n---`)
                      .join("\n");
                    navigator.clipboard.writeText(text);
                    toast.success("Cards copied to clipboard!", { icon: "📋" });
                  }}
                  className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-purple-500 rounded-lg">
                      <Copy className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-purple-700">
                      Copy All Cards
                    </span>
                  </div>
                  <span className="text-sm text-purple-600">⎘</span>
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Statistics</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Completion</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {totalCards}
                    </div>
                    <div className="text-xs text-gray-600">Total Cards</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">
                      {completedCards}
                    </div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-between py-1">
                    <span>Total characters:</span>
                    <span className="font-bold">{totalCharacters}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Average per card:</span>
                    <span className="font-bold">
                      {totalCards > 0
                        ? Math.round(totalCharacters / totalCards)
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Editing Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Keep questions concise and answers comprehensive</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Brain className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Use images and examples for better retention</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Hash className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Group related cards with consistent formatting</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cards Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-purple-100 rounded-lg">
                    <Layers className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Flashcards ({cards.length})
                    </h3>
                    <p className="text-sm text-gray-600">
                      Edit questions and answers below
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                    title="List View"
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cards Grid/List */}
            <div
              className={`space-y-4 ${
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                  : ""
              }`}
            >
              {cards.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No cards yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by adding your first flashcard
                  </p>
                  <button
                    onClick={handleAddCard}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Add First Card</span>
                  </button>
                </div>
              ) : (
                cards.map((card, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md ${
                      expandedCard === index ? "ring-2 ring-emerald-500" : ""
                    }`}
                  >
                    <div className="p-6">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Card #{index + 1}
                            </h4>
                            <p className="text-xs text-gray-500">
                              Modified:{" "}
                              {new Date(
                                card.metadata?.modified || Date.now(),
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDuplicateCard(index)}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {index > 0 && (
                            <button
                              onClick={() => handleMoveCard(index, index - 1)}
                              className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Move Up"
                            >
                              <ArrowLeft className="w-4 h-4 rotate-90" />
                            </button>
                          )}

                          {index < cards.length - 1 && (
                            <button
                              onClick={() => handleMoveCard(index, index + 1)}
                              className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Move Down"
                            >
                              <ArrowLeft className="w-4 h-4 -rotate-90" />
                            </button>
                          )}

                          <button
                            onClick={() => handleRemoveCard(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question & Answer Fields */}
                      <div className="space-y-4">
                        {/* Question */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600">
                                Q
                              </span>
                            </div>
                            <label className="text-sm font-semibold text-gray-900">
                              Question
                            </label>
                          </div>
                          <div className="relative">
                            <textarea
                              value={card.question}
                              onChange={(e) =>
                                handleUpdateCard(
                                  index,
                                  "question",
                                  e.target.value,
                                )
                              }
                              className="w-full h-32 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-blue-300"
                              placeholder="Enter your question here..."
                              rows={3}
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-blue-400">
                              {card.question?.length || 0}/500
                            </div>
                          </div>
                        </div>

                        {/* Answer */}
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-emerald-600">
                                A
                              </span>
                            </div>
                            <label className="text-sm font-semibold text-gray-900">
                              Answer
                            </label>
                          </div>
                          <div className="relative">
                            <textarea
                              value={card.answer}
                              onChange={(e) =>
                                handleUpdateCard(
                                  index,
                                  "answer",
                                  e.target.value,
                                )
                              }
                              className="w-full h-40 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none placeholder-emerald-300"
                              placeholder="Enter the answer here..."
                              rows={4}
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-emerald-400">
                              {card.answer?.length || 0}/1000
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Preview (Optional) */}
                      {showPreview && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2 mb-3">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              Preview
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                              <div className="text-xs text-blue-600 font-medium mb-2">
                                Question
                              </div>
                              <p className="text-gray-800">
                                {card.question || "No question yet"}
                              </p>
                            </div>
                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                              <div className="text-xs text-emerald-600 font-medium mb-2">
                                Answer
                              </div>
                              <p className="text-gray-800">
                                {card.answer || "No answer yet"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            <div className="sticky bottom-6 mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {completedCards} of {cards.length} cards completed
                    </p>
                    <p className="text-xs text-gray-600">
                      Save your changes when ready
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || completedCards < cards.length}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-semibold">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span className="font-semibold">Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
