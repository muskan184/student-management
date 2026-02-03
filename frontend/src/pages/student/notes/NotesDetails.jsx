import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Edit,
  Calendar,
  Tag,
  FileText,
  Paperclip,
  Printer,
  BookOpen,
  Share2,
  Bookmark,
  Eye,
  File,
  Copy,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  User,
  Star,
  Pin,
  Trash2,
  MoreVertical,
  Check,
} from "lucide-react";
import { fetchNotesById } from "../../../api/noteApi";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef();

  const loadNote = async () => {
    try {
      const res = await fetchNotesById(id);
      setNote(res.note);
      setIsStarred(res.note?.isStarred || false);
      setIsPinned(res.note?.isPinned || false);
    } catch (error) {
      toast.error("Failed to load note");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNote();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!note) return;

    setIsExporting(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 72;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let cursorY = 40;

      if (imgHeight <= pageHeight - 80) {
        pdf.addImage(imgData, "PNG", 36, cursorY, imgWidth, imgHeight);
      } else {
        const totalPages = Math.ceil(imgHeight / (pageHeight - 80));
        for (let i = 0; i < totalPages; i++) {
          const srcY = (canvas.height / imgHeight) * (i * (pageHeight - 80));
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          const sliceHeightPx = Math.round(
            (canvas.height / imgHeight) * (pageHeight - 80),
          );
          sliceCanvas.height = sliceHeightPx;
          const ctx = sliceCanvas.getContext("2d");
          ctx.drawImage(
            canvas,
            0,
            srcY,
            canvas.width,
            sliceHeightPx,
            0,
            0,
            canvas.width,
            sliceHeightPx,
          );
          const sliceData = sliceCanvas.toDataURL("image/png");
          if (i > 0) pdf.addPage();
          pdf.addImage(
            sliceData,
            "PNG",
            36,
            40,
            imgWidth,
            sliceHeightPx * (imgWidth / canvas.width),
          );
        }
      }

      const fileName = `${
        note.title?.substring(0, 40).replace(/[^\w\s-]/g, "") || "note"
      }.pdf`;
      pdf.save(fileName);
      toast.success("PDF downloaded successfully");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
    toast.success(isStarred ? "Removed from favorites" : "Added to favorites");
  };

  const handlePin = () => {
    setIsPinned(!isPinned);
    toast.success(isPinned ? "Note unpinned" : "Note pinned");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/20 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading note details...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/20 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Note Not Found
            </h3>
            <p className="text-gray-600 mb-8">
              The requested note could not be found or has been deleted.
            </p>
            <button
              onClick={() => navigate("/student/notes")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Back to Notes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category) => {
    const colors = {
      lecture: "bg-blue-100 text-blue-700 border-blue-200",
      assignment: "bg-purple-100 text-purple-700 border-purple-200",
      project: "bg-amber-100 text-amber-700 border-amber-200",
      exam: "bg-rose-100 text-rose-700 border-rose-200",
      personal: "bg-emerald-100 text-emerald-700 border-emerald-200",
      research: "bg-cyan-100 text-cyan-700 border-cyan-200",
      study: "bg-indigo-100 text-indigo-700 border-indigo-200",
    };
    return (
      colors[category?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50/20 p-4 md:p-8">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 blur-3xl"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-purple-50/50 blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
                    Note Details
                  </h1>
                  <p className="text-gray-600 mt-1">
                    View and manage your note
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Note Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-6 sticky top-8">
              <div className="space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Layers size={16} />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleDownloadPDF}
                      disabled={isExporting}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-indigo-100 border border-blue-200 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <Download size={18} className="text-blue-600" />
                        <span className="font-medium">Export as PDF</span>
                      </div>
                      {isExporting && (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </button>

                    <Link
                      to={`/student/notes/${id}/edit`}
                      className="w-full px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded-xl hover:from-emerald-100 hover:to-green-100 border border-emerald-200 transition-all flex items-center gap-3 group"
                    >
                      <Edit size={18} className="text-emerald-600" />
                      <span className="font-medium">Edit Note</span>
                    </Link>

                    <button
                      onClick={handleCopyLink}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:from-gray-100 hover:to-gray-200 border border-gray-200 transition-all flex items-center gap-3 group"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Share2 size={18} className="text-gray-600" />
                      )}
                      <span className="font-medium">
                        {copied ? "Copied!" : "Copy Link"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Note Stats */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen size={16} />
                    Note Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={14} />
                        <span className="text-sm">Created</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={14} />
                        <span className="text-sm">Last Updated</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(
                          note.updatedAt || note.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Tag size={14} />
                        <span className="text-sm">Category</span>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                          note.category,
                        )}`}
                      >
                        {note.category || "General"}
                      </span>
                    </div>

                    {note.subject && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Book size={14} />
                          <span className="text-sm">Subject</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {note.subject}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Note Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Actions
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleStar}
                      className={`flex-1 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                        isStarred
                          ? "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Star
                        size={16}
                        className={
                          isStarred ? "fill-amber-500 text-amber-500" : ""
                        }
                      />
                      {isStarred ? "Starred" : "Star"}
                    </button>
                    <button
                      onClick={handlePin}
                      className={`flex-1 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                        isPinned
                          ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Pin
                        size={16}
                        className={isPinned ? "text-purple-500" : ""}
                      />
                      {isPinned ? "Pinned" : "Pin"}
                    </button>
                  </div>
                </div>

                {/* Attachments */}
                {note.fileUrl && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Paperclip size={16} />
                      Attachments
                    </h3>
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-blue-300 transition-all flex items-center gap-3"
                    >
                      <div className="p-2 bg-white rounded-lg border border-gray-300 group-hover:border-blue-200">
                        <File
                          size={16}
                          className="text-gray-500 group-hover:text-blue-600"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {note.fileUrl.split("/").pop()}
                        </p>
                        <p className="text-xs text-gray-500">Click to view</p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-gray-400 group-hover:text-blue-500"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Note Details */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
            >
              {/* Note Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(
                          note.category,
                        )}`}
                      >
                        {note.category || "General"}
                      </div>
                      {(isStarred || isPinned) && (
                        <div className="flex items-center gap-2">
                          {isStarred && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                              <Star size={10} className="fill-amber-500" />
                              Starred
                            </div>
                          )}
                          {isPinned && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200">
                              <Pin size={10} />
                              Pinned
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {note.title}
                    </h2>
                    {note.description && (
                      <p className="text-gray-600">{note.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Content */}
              <div ref={printRef} className="p-8">
                <div className="prose prose-lg max-w-none">
                  {/* Content with proper formatting */}
                  <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {note.content.split("\n").map((paragraph, index) =>
                      paragraph.trim() ? (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ) : (
                        <br key={index} />
                      ),
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-12 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            Created:{" "}
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>
                            Updated:{" "}
                            {new Date(
                              note.updatedAt || note.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        IntelliConnect · Note #{id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Additional Actions */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                This note is visible only to you
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-white text-gray-700 rounded-xl border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  onClick={() => navigate(`/student/notes/${id}/edit`)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Edit size={16} />
                  Edit Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
