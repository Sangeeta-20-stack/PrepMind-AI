const express = require("express");
const auth = require("../middleware/auth");
const {
  generateInterviewQuestions,
  generateConceptExplanation,
  generateAnswer,
} = require("../controllers/aiController");

const router = express.Router();

/**
 * POST /api/ai/generate-questions
 * body: { role, experience, techStack }
 */
router.post("/generate-questions", auth, generateInterviewQuestions);

/**
 * POST /api/ai/generate-explanation
 * body: { topic }
 * 
 */
router.post("/generate-explanation", auth, generateConceptExplanation);
router.post("/generate-answer", auth, generateAnswer);

module.exports = router;
