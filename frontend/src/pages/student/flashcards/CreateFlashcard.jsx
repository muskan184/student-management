import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
  Hash,
  BookOpen,
  Sparkles,
  Zap,
  Layers,
  CheckCircle,
  Lightbulb,
  Brain,
  Clock,
  Volume2,
  Image,
  Link,
  Code,
  Calculator,
  Globe,
  Music,
  Palette,
} from "lucide-react";
import { createFlashcard } from "../../../api/flashCardApi";

export default function CreateFlashcard() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [cards, setCards] = useState([{ question: "", answer: "" }]);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState("emerald");
  const [activeTab, setActiveTab] = useState("create");

  // Color options for flashcard sets
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

  // Subject icons
  const subjectIcons = [
    { icon: <Calculator className="w-5 h-5" />, label: "Math" },
    { icon: <Globe className="w-5 h-5" />, label: "Geography" },
    { icon: <Code className="w-5 h-5" />, label: "Programming" },
    { icon: <Music className="w-5 h-5" />, label: "Music" },
    { icon: <Palette className="w-5 h-5" />, label: "Art" },
    { icon: <FileText className="w-5 h-5" />, label: "Literature" },
  ];

  /* ================= ADD / REMOVE CARD ================= */
  const addCard = () => {
    setCards([...cards, { question: "", answer: "" }]);
    toast.success("New card added!", {
      icon: "➕",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const removeCard = (index) => {
    if (cards.length === 1) {
      toast.error("At least one card is required");
      return;
    }

    // Animate removal
    const cardElement = document.getElementById(`card-${index}`);
    if (cardElement) {
      cardElement.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        setCards(cards.filter((_, i) => i !== index));
        toast.success("Card removed", {
          icon: "🗑️",
          duration: 2000,
        });
      }, 300);
    } else {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required", {
        icon: "⚠️",
      });
      return;
    }

    if (cards.some((c) => !c.question || !c.answer)) {
      toast.error("Please fill all questions & answers", {
        icon: "📝",
      });
      return;
    }

    try {
      setLoading(true);
      await createFlashcard({
        title,
        cards,
        color: selectedColor,
        count: cards.length,
        createdAt: new Date().toISOString(),
      });

      // Success toast with celebration
      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>Flashcard created successfully! 🎉</span>
        </div>,
        {
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#10b981",
            color: "#fff",
            padding: "16px",
          },
        },
      );

      // Add a small delay for visual feedback
      setTimeout(() => {
        navigate("/student/flashcards");
      }, 1500);
    } catch {
      toast.error("Failed to create flashcard", {
        icon: "❌",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATISTICS ================= */
  const totalCards = cards.length;
  const completedCards = cards.filter(
    (card) => card.question && card.answer,
  ).length;
  const progress =
    totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

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
                <div className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-sm">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Create Flashcard
                  </h1>
                  <p className="text-sm text-gray-600">
                    Build your knowledge cards with interactive features
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
                  <div className="text-xs text-gray-600">Total Cards</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {completedCards}
                  </div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {progress}%
                  </div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-semibold">Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span className="font-semibold">Save Flashcard Set</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Set Progress</h3>
                <span className="text-sm font-bold text-emerald-600">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {completedCards} of {totalCards} cards completed
              </p>
            </div>

            {/* Color Theme */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Color Theme</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      color.bg
                    } ${
                      selectedColor === color.id
                        ? color.border + " border-2"
                        : "border-transparent"
                    } hover:scale-105`}
                  >
                    <div
                      className={`text-center text-sm font-medium ${color.text}`}
                    >
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Hash className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-sm text-gray-700">Total Cards</span>
                  </div>
                  <span className="font-bold text-gray-900">{totalCards}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      Est. Study Time
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {totalCards * 2} min
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700">Mastery Level</span>
                  </div>
                  <span className="font-bold text-gray-900">Beginner</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Use clear and concise questions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Add examples to complex answers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Use images or diagrams when helpful</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                  <span>Group related cards together</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 bg-emerald-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-1">
                    Flashcard Set Title
                  </label>
                  <p className="text-sm text-gray-600">
                    Give your flashcard set a descriptive name
                  </p>
                </div>
              </div>
              <input
                type="text"
                placeholder="Eg: Data Structures & Algorithms Fundamentals"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg placeholder-gray-500"
              />

              {/* Subject Tags */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Suggested Subjects
                </p>
                <div className="flex flex-wrap gap-2">
                  {subjectIcons.map((subject, index) => (
                    <button
                      key={index}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {subject.icon}
                      <span className="text-sm text-gray-700">
                        {subject.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-purple-100 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Flashcards ({totalCards})
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add questions and answers for each card
                    </p>
                  </div>
                </div>
                <button
                  onClick={addCard}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add New Card</span>
                </button>
              </div>

              {/* Cards List */}
              <div className="space-y-4">
                {cards.map((card, index) => (
                  <div
                    id={`card-${index}`}
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Card #{index + 1}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Fill both sides
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCard(index)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Question Side */}
                      <div className="space-y-3">
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
                            placeholder="Enter your question here..."
                            value={card.question}
                            onChange={(e) =>
                              handleChange(index, "question", e.target.value)
                            }
                            className="w-full h-32 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-blue-300"
                            rows={3}
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-blue-400">
                            {card.question.length}/500
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-blue-600">
                          <Lightbulb className="w-4 h-4" />
                          <span>Tip: Keep questions clear and specific</span>
                        </div>
                      </div>

                      {/* Answer Side */}
                      <div className="space-y-3">
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
                            placeholder="Enter the answer here..."
                            value={card.answer}
                            onChange={(e) =>
                              handleChange(index, "answer", e.target.value)
                            }
                            className="w-full h-32 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none placeholder-emerald-300"
                            rows={3}
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-emerald-400">
                            {card.answer.length}/1000
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-emerald-600">
                          <div className="flex items-center space-x-1">
                            <Image className="w-4 h-4" />
                            <span className="text-xs">Add Image</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Volume2 className="w-4 h-4" />
                            <span className="text-xs">Add Audio</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Link className="w-4 h-4" />
                            <span className="text-xs">Add Link</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {cards.length === 0 && (
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
                    onClick={addCard}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Create First Card</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="sticky bottom-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {completedCards} of {totalCards} cards completed
                    </p>
                    <p className="text-xs text-gray-600">
                      Almost there! Complete all cards to save.
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
                    disabled={loading || completedCards < totalCards}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-semibold">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span className="font-semibold">Save & Continue</span>
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
