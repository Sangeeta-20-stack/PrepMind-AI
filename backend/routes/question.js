const express = require("express");
const auth = require("../middleware/auth");
const Question = require("../models/Question");
const Session = require("../models/Session");

const router = express.Router();

/* ADD QUESTION TO SESSION */
router.post("/", auth, async (req, res) => {
  try {
    const { sessionId, question, answer } = req.body;
    if (!sessionId || !question) {
      return res.status(400).json({ message: "sessionId and question are required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const newQuestion = await Question.create({
      session: sessionId,
      question,
      answer: answer || "",
    });

    session.questions.push(newQuestion._id);
    await session.save();

    res.status(201).json({ message: "Question added", question: newQuestion });
  } catch (err) {
    res.status(500).json({ message: "Failed to add question", error: err.message });
  }
});

/* GET QUESTIONS OF A SESSION */
router.get("/session/:sessionId", auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId).populate("questions");
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    res.json({ questions: session.questions });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions", error: err.message });
  }
});

/* TOGGLE PIN QUESTION */
router.patch("/pin/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const session = await Session.findById(question.session);
    if (session.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    question.isPinned = !question.isPinned;
    await question.save();

    res.json({ message: "Pin toggled", question });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle pin", error: err.message });
  }
});

/* UPDATE NOTE */
router.patch("/note/:id", auth, async (req, res) => {
  try {
    const { note } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const session = await Session.findById(question.session);
    if (session.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    question.note = note || "";
    await question.save();

    res.json({ message: "Note updated", question });
  } catch (err) {
    res.status(500).json({ message: "Failed to update note", error: err.message });
  }
});

/* DELETE QUESTION */
router.delete("/:id", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const session = await Session.findById(question.session);
    if (session.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    // Delete question
    await Question.deleteOne({ _id: question._id });

    // Remove from session.questions array
    session.questions.pull(question._id);
    await session.save();

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete question", error: err.message });
  }
});


module.exports = router;
