import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Clock,
  BookOpen,
  CheckCircle,
  Star,
  Target,
  TrendingUp,
  Zap,
  Sparkles,
  Brain,
  Award,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  Download,
  Settings,
  Eye,
  EyeOff,
  Timer,
} from "lucide-react";
import { fetchFlashcardById } from "../../../api/flashCardApi";

export default function FlashcardPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flashcard, setFlashcard] = useState(null);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [masteredCards, setMasteredCards] = useState(new Set());
  const [difficulty, setDifficulty] = useState({});
  const [showStats, setShowStats] = useState(false);

  const cardRef = useRef(null);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  /* ================= FETCH FLASHCARD ================= */
  useEffect(() => {
    loadFlashcard();
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // Start study timer
    if (flashcard && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setStudyTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [flashcard]);

  const loadFlashcard = async () => {
    try {
      setLoading(true);
      const data = await fetchFlashcardById(id);
      setFlashcard(data);

      // Initialize difficulty ratings
      const initialDifficulty = {};
      data.cards.forEach((_, idx) => {
        initialDifficulty[idx] = 1; // 1 = Easy, 2 = Medium, 3 = Hard
      });
      setDifficulty(initialDifficulty);

      toast.success(
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <span>Flashcard loaded! Let's study 🎯</span>
        </div>,
        {
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#10b981",
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

  /* ================= CARD CONTROLS ================= */
  const nextCard = () => {
    if (index < flashcard.cards.length - 1) {
      setIndex((prev) => prev + 1);
      setIsFlipped(false);
      setShowHint(false);
    } else {
      handleComplete();
    }
  };

  const prevCard = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
      setIsFlipped(false);
      setShowHint(false);
    }
  };

  const skipToStart = () => {
    setIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const skipToEnd = () => {
    setIndex(flashcard.cards.length - 1);
    setIsFlipped(false);
    setShowHint(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);

    if (!isPlaying) {
      intervalRef.current = setInterval(() => {
        nextCard();
      }, 3000); // Auto-advance every 3 seconds
    } else {
      clearInterval(intervalRef.current);
    }
  };

  const markAsMastered = () => {
    setMasteredCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
        toast.success("Card unmarked", {
          icon: "↩️",
        });
      } else {
        newSet.add(index);
        toast.success(
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>Card mastered! 🎉</span>
          </div>,
          {
            duration: 2000,
          },
        );
      }
      return newSet;
    });
  };

  const setCardDifficulty = (level) => {
    setDifficulty((prev) => ({
      ...prev,
      [index]: level,
    }));

    const difficultyText = ["Easy", "Medium", "Hard"][level - 1];
    toast.success(`Marked as ${difficultyText}`, {
      icon: level === 1 ? "😊" : level === 2 ? "😐" : "😅",
    });
  };

  const handleComplete = () => {
    const masteredCount = masteredCards.size;
    const totalCards = flashcard.cards.length;

    toast.success(
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Award className="w-6 h-6 text-yellow-500" />
          <span className="font-bold text-lg">Session Complete! 🎉</span>
        </div>
        <div className="text-sm">
          Mastered {masteredCount} of {totalCards} cards
        </div>
      </div>,
      {
        duration: 5000,
        style: {
          borderRadius: "12px",
          background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
          color: "#fff",
          padding: "16px",
        },
      },
    );

    skipToStart();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /* ================= LOADING & ERROR STATES ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-emerald-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <Brain className="w-12 h-12 text-emerald-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-gray-900">
            Loading Flashcards...
          </h2>
          <p className="text-gray-600 mt-2">Preparing your study session</p>
        </div>
      </div>
    );
  }

  if (!flashcard || !flashcard.cards?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Cards Found
          </h2>
          <p className="text-gray-600 mb-6">
            This flashcard set appears to be empty.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentCard = flashcard.cards[index];
  const totalCards = flashcard.cards.length;
  const progress = ((index + 1) / totalCards) * 100;
  const isMastered = masteredCards.has(index);
  const cardDifficulty = difficulty[index] || 1;
  const difficultyColor =
    cardDifficulty === 1
      ? "bg-emerald-100 text-emerald-700"
      : cardDifficulty === 2
      ? "bg-amber-100 text-amber-700"
      : "bg-rose-100 text-rose-700";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/50 ${
        isFullscreen ? "p-0" : "p-4 md:p-6"
      }`}
    >
      {!isFullscreen && (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {flashcard.title}
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{totalCards} cards</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Timer className="w-4 h-4 mr-1" />
                    <span>{formatTime(studyTime)}</span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${difficultyColor}`}
                  >
                    {cardDifficulty === 1
                      ? "Easy"
                      : cardDifficulty === 2
                      ? "Medium"
                      : "Hard"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                title="Show statistics"
              >
                <TrendingUp className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${isFullscreen ? "h-screen" : "max-w-7xl mx-auto"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Left Sidebar - Stats */}
          {showStats && !isFullscreen && (
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Session Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-gray-700">Mastered</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {masteredCards.size} / {totalCards}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700">Study Time</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatTime(studyTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Target className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-gray-700">Current Progress</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {index + 1} / {totalCards}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Study Tips</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Review difficult cards more frequently</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Use spaced repetition for better retention</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>Take breaks every 25 minutes</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Main Flashcard Area */}
          <div
            className={`${
              showStats ? "lg:col-span-2" : "lg:col-span-3"
            } flex flex-col h-full`}
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Card {index + 1} of {totalCards}
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Flashcard Container */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                ref={cardRef}
                className={`relative w-full max-w-2xl h-96 [perspective:1000px] cursor-pointer ${
                  isFullscreen ? "h-[70vh]" : ""
                }`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div
                  className={`absolute inset-0 transition-all duration-500 [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* Front Side - Question */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl [backface-visibility:hidden] flex flex-col items-center justify-center p-8 shadow-xl">
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          Question
                        </div>
                        {isMastered && (
                          <div className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            Mastered
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center max-w-2xl">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-2xl font-bold">?</span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-relaxed">
                        {currentCard.question}
                      </h2>
                      <p className="text-blue-600 flex items-center justify-center space-x-2">
                        <Eye className="w-5 h-5" />
                        <span>Click to reveal answer</span>
                      </p>
                    </div>

                    {showHint && (
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-300 rounded-xl p-4 max-w-md">
                        <p className="text-sm text-blue-800 font-medium">
                          💡 Hint: Try to recall before flipping!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Back Side - Answer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center p-8 shadow-xl">
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                          Answer
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-sm font-medium ${difficultyColor} flex items-center`}
                        >
                          {cardDifficulty === 1
                            ? "Easy"
                            : cardDifficulty === 2
                            ? "Medium"
                            : "Hard"}
                        </div>
                      </div>
                    </div>

                    <div className="text-center max-w-2xl">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-white text-2xl font-bold">✓</span>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-relaxed">
                        {currentCard.answer}
                      </h2>
                      <p className="text-emerald-600 flex items-center justify-center space-x-2">
                        <EyeOff className="w-5 h-5" />
                        <span>Click to go back to question</span>
                      </p>
                    </div>

                    <div className="absolute bottom-6 w-full max-w-md px-4">
                      <div className="flex items-center justify-center space-x-3">
                        <span className="text-sm text-gray-600">
                          How well did you know this?
                        </span>
                        <div className="flex space-x-1">
                          {[1, 2, 3].map((level) => (
                            <button
                              key={level}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardDifficulty(level);
                              }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                difficulty[index] === level
                                  ? level === 1
                                    ? "bg-emerald-500 text-white"
                                    : level === 2
                                    ? "bg-amber-500 text-white"
                                    : "bg-rose-500 text-white"
                                  : level === 1
                                  ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                                  : level === 2
                                  ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                                  : "bg-rose-100 text-rose-600 hover:bg-rose-200"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center space-x-4">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {showHint ? (
                    <EyeOff className="w-4 h-4 mr-1 inline" />
                  ) : (
                    <Eye className="w-4 h-4 mr-1 inline" />
                  )}
                  {showHint ? "Hide Hint" : "Show Hint"}
                </button>
                <button
                  onClick={markAsMastered}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    isMastered
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {isMastered ? (
                    <>
                      <Star className="w-4 h-4 mr-1 inline fill-yellow-400" />
                      Mastered
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4 mr-1 inline" />
                      Mark as Mastered
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-12">
              <div className="flex flex-col items-center space-y-6">
                {/* Main Controls */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={skipToStart}
                    className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={index === 0}
                  >
                    <SkipBack className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    onClick={prevCard}
                    className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={index === 0}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className={`p-4 rounded-xl ${
                      isPlaying
                        ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                        : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    } text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>

                  <button
                    onClick={nextCard}
                    className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={index === totalCards - 1}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>

                  <button
                    onClick={skipToEnd}
                    className="p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    disabled={index === totalCards - 1}
                  >
                    <SkipForward className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Secondary Controls */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
                  >
                    Flip Card
                  </button>

                  <button
                    onClick={skipToStart}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restart Session</span>
                  </button>
                </div>

                {/* Session Stats */}
                <div className="flex items-center space-x-8 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <span>{masteredCards.size} mastered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Timer className="w-4 h-4" />
                    <span>{formatTime(studyTime)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>
                      {index + 1} of {totalCards}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
