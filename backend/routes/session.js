const express = require("express");
const auth = require("../middleware/auth");
const Session = require("../models/Session");
const Question = require("../models/Question");

const router = express.Router();

/* CREATE SESSION */
router.post("/", auth, async (req, res) => {
  try {
    const { role, experience, topicToFocus, description } = req.body;
    if (!role || !experience || !topicToFocus)
      return res.status(400).json({ message: "role, experience, topicToFocus required" });

    const session = await Session.create({
      user: req.user.id,
      role,
      experience,
      topicToFocus,
      description: description || "",
      questions: [],
    });

    res.status(201).json({ message: "Session created", session });
  } catch (err) {
    res.status(500).json({ message: "Failed to create session", error: err.message });
  }
});

/* GET ALL SESSIONS of logged-in user */
router.get("/", auth, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).populate("questions");
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sessions", error: err.message });
  }
});

/* GET SESSION BY ID */
router.get("/:id", auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("questions");
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch session", error: err.message });
  }
});


/* DELETE SESSION */
router.delete("/:id", auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    // Delete all questions belonging to this session
    await Question.deleteMany({ session: session._id });

    // Delete session
    await Session.deleteOne({ _id: session._id });

    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete session", error: err.message });
  }
});

module.exports = router;
