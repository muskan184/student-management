// src/pages/student/notes/NoteDetails.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchNotesById } from "../../../api/noteApi";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function NoteDetails() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(); // DOM node to convert to PDF

  const loadNote = async () => {
    try {
      const res = await fetchNotesById(id);
      // API returns { note: { ... } }
      setNote(res.note);
    } catch (error) {
      toast.error("Failed to load note");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNote();
  }, [id]);

  // Generate PDF from note content
  const handleDownloadPDF = async () => {
    if (!note) return;
    try {
      // Use html2canvas to capture the printRef DOM
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // higher scale = better resolution
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // calculate image dimensions to fit in A4 with padding
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 40; // 20pt padding each side
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let cursorY = 20;

      // If content height > pageHeight - margins, split across pages
      if (imgHeight <= pageHeight - 40) {
        pdf.addImage(imgData, "PNG", 20, cursorY, imgWidth, imgHeight);
      } else {
        // slice canvas into multiple pages
        const totalPages = Math.ceil(imgHeight / (pageHeight - 40));
        for (let i = 0; i < totalPages; i++) {
          const srcY = (canvas.height / imgHeight) * (i * (pageHeight - 40));
          // create temporary canvas for each slice
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          // compute slice height in px consistent with scale
          const sliceHeightPx = Math.round(
            (canvas.height / imgHeight) * (pageHeight - 40)
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
            sliceHeightPx
          );
          const sliceData = sliceCanvas.toDataURL("image/png");
          if (i > 0) pdf.addPage();
          pdf.addImage(
            sliceData,
            "PNG",
            20,
            20,
            imgWidth,
            sliceHeightPx * (imgWidth / canvas.width)
          );
        }
      }

      const fileName = `${
        note.title?.substring(0, 40).replace(/[^\w\s-]/g, "") || "note"
      }.pdf`;
      pdf.save(fileName);
      toast.success("PDF downloaded");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Failed to generate PDF");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!note) return <p className="p-6">Note not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* The part we will convert to PDF */}
      <div
        ref={printRef}
        className="bg-white shadow rounded p-6 border"
        style={{ color: "#111" }} // ensure dark text on export
      >
        <h2 className="text-3xl font-bold mb-4">{note.title}</h2>

        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>

        <p className="mt-3 text-sm text-gray-500">
          <b>Category:</b> {note.category || "General"}
        </p>

        {note.fileUrl ? (
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline block mt-3"
          >
            📄 View attached file
          </a>
        ) : (
          <p className="mt-3 text-gray-400 italic">No file attached</p>
        )}

        <p className="mt-4 text-xs text-gray-400">
          Created: {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleDownloadPDF}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow"
        >
          Download PDF
        </button>

        <Link
          to={`/student/notes/${id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Note
        </Link>
      </div>
    </div>
  );
}
