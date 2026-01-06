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
exports.generateInterviewQuestions = async (req, res) => {
  if (!checkRateLimit()) {
    return res.status(429).json({ message: "Please wait 5 seconds before retrying" });
  }

  try {
    const { role, experience, techStack } = req.body;

    if (!role || !experience || !techStack) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
Generate 10 interview questions for:
Role: ${role}
Experience: ${experience}
Tech Stack: ${techStack}

Rules:
- Mix theory + practical
- Number the questions
- Be concise
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert technical interviewer." },
        { role: "user", content: prompt },
      ],
    });

    res.status(200).json({
      questions: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI Error:", error);
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
