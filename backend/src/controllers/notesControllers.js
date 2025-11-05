import Note from "../models/Note.js";
import path from "path";
import fs from "fs";


export const createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    let fileUrl = null;
    let fileType = "none";

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      fileType = ext === ".pdf" ? "pdf" : "doc";
    }

    const note = await Note.create({
      user: req.user.id,
      title,
      content,
      category,
      fileUrl,
      fileType,
    });

    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note updated", note });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.fileUrl) {
      const filePath = path.join("uploads", path.basename(note.fileUrl));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
