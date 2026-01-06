const OpenAI = require("openai");

/* ===============================
   OpenAI Setup
================================ */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* ===============================
   Simple Rate Limit (5 sec)
================================ */
let lastCall = 0;
const RATE_LIMIT_MS = 5000;

function checkRateLimit() {
  if (Date.now() - lastCall < RATE_LIMIT_MS) {
    return false;
  }
  lastCall = Date.now();
  return true;
}

/* ===============================
   Generate Interview Questions
================================ */
const Question = require("../models/Question");
const Session = require("../models/Session");

exports.generateInterviewQuestions = async (req, res) => {
  if (!checkRateLimit()) {
    return res.status(429).json({ message: "Please wait 5 seconds before retrying" });
  }

  try {
    const { sessionId, role, experience, techStack } = req.body;

    if (!sessionId || !role || !experience || !techStack) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const prompt = `
Generate 5 interview questions for:
Role: ${role}
Experience: ${experience}
Tech Stack: ${techStack}

Rules:
- Return ONLY numbered questions
- No explanations
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert technical interviewer." },
        { role: "user", content: prompt },
      ],
    });

    // 🔹 Parse AI text into array
    const rawText = completion.choices[0].message.content;
    const questionTexts = rawText
      .split("\n")
      .map(q => q.replace(/^\d+[\).\s]+/, "").trim())
      .filter(Boolean);

    // 🔹 Save each question in DB
    const createdQuestions = await Question.insertMany(
      questionTexts.map(text => ({
        session: sessionId,
        question: text,
      }))
    );

    // 🔹 Push IDs into session
    session.questions.push(...createdQuestions.map(q => q._id));
    await session.save();

    res.status(201).json({
      questions: createdQuestions,
    });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI generation failed" });
  }
};

/* ===============================
   Generate Concept Explanation
================================ */
exports.generateConceptExplanation = async (req, res) => {
  if (!checkRateLimit()) {
    return res.status(429).json({ message: "Please wait 5 seconds before retrying" });
  }

  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Explain concepts clearly with examples.",
        },
        {
          role: "user",
          content: `Explain ${topic} in simple terms with examples.`,
        },
      ],
    });

    res.status(200).json({
      explanation: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: "AI generation failed" });
  }
};

/* ===============================
   Generate Answer
================================ */
exports.generateAnswer = async (req, res) => {
  if (!checkRateLimit()) {
    return res.status(429).json({ message: "Please wait 5 seconds before retrying" });
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer and answer generator.",
        },
        {
          role: "user",
          content: `Answer the following interview question in detail:\n\n${question}`,
        },
      ],
    });

    res.status(200).json({
      answer: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: "AI generation failed" });
  }
};
