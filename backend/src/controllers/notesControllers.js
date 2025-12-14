import Note from "../models/Note.js";
import path from "path";
import fs from "fs";

export const createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    let fileUrl = null;
    let fileType = "none";

    if (req.file) {
      const hostUrl = `${req.protocol}://${req.get("host")}`;
      fileUrl = `${hostUrl}/uploads/${req.file.filename}`;

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
    const notes = await Note.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
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

export const getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;

    const note = await Note.findOne({ _id: noteId, user: userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ note });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const toggleStar = async (req, res) => {
  const note = await Note.findById(req.params.id);
  note.isStarred = !note.isStarred;
  await note.save();
  res.json(note);
};

export const togglePin = async (req, res) => {
  const note = await Note.findById(req.params.id);
  note.isPinned = !note.isPinned;
  await note.save();
  res.json(note);
};
