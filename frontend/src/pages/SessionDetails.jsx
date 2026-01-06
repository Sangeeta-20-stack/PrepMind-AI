import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { BsFillPinFill } from "react-icons/bs";
import { MdWork, MdOutlineVisibility } from "react-icons/md";

export default function SessionDetails() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");
  const [noteInputs, setNoteInputs] = useState({});
  const [pinLoading, setPinLoading] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [generatingAnswer, setGeneratingAnswer] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

  const token = localStorage.getItem("token");

  /* ================= FETCH SESSION ================= */
  const fetchSession = async () => {
    try {
      const res = await api.get(`/api/session/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sessionData = res.data.session;

      const notes = {};
      sessionData.questions.forEach((q) => {
        notes[q._id] = q.note || "";
      });

      setNoteInputs(notes);
      setSession(sessionData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  /* ================= GENERATE QUESTIONS ================= */
  const handleGenerateQuestions = async () => {
    if (!session) return;
    setGeneratingQuestions(true);

    try {
      const res = await api.post(
        "/api/ai/generate-questions",
        {
          sessionId: id,
          role: session.role,
          experience: session.experience,
          techStack: session.topicToFocus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const questionsArray = Array.isArray(res.data.questions)
        ? res.data.questions
        : [];

      if (!questionsArray.length) {
        console.warn("No questions returned from API");
        return;
      }

      // STRICT: accept only DB-backed questions
      if (!questionsArray.every((q) => q._id)) {
        console.error("Invalid questions received:", questionsArray);
        return;
      }

      setSession((prev) => ({
        ...prev,
        questions: [...prev.questions, ...questionsArray],
      }));

      const newNotes = {};
      questionsArray.forEach((q) => {
        newNotes[q._id] = "";
      });

      setNoteInputs((prev) => ({ ...prev, ...newNotes }));
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setGeneratingQuestions(false);
    }
  };

  /* ================= GENERATE ANSWER ================= */
  const handleGenerateAnswer = async (qId, question) => {
    setGeneratingAnswer((prev) => ({ ...prev, [qId]: true }));

    try {
      const res = await api.post(
        "/api/ai/generate-answer",
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSession((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === qId ? { ...q, answer: res.data.answer } : q
        ),
      }));
    } catch (err) {
      console.error("Failed to generate answer:", err);
    } finally {
      setGeneratingAnswer((prev) => ({ ...prev, [qId]: false }));
    }
  };

  /* ================= GENERATE EXPLANATION ================= */
  const handleGenerateExplanation = async (qId, question) => {
    try {
      const res = await api.post(
        "/api/ai/generate-explanation",
        { topic: question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSession((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === qId ? { ...q, explanation: res.data.explanation } : q
        ),
      }));

      setShowExplanation((prev) => ({ ...prev, [qId]: true }));
    } catch (err) {
      console.error("Failed to generate explanation:", err);
    }
  };

  /* ================= MANUAL QUESTION ================= */
  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return;

    try {
      const res = await api.post(
        "/api/question",
        { sessionId: id, question: newQuestion },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSession((prev) => ({
        ...prev,
        questions: [...prev.questions, res.data.question],
      }));

      setNoteInputs((prev) => ({
        ...prev,
        [res.data.question._id]: "",
      }));

      setNewQuestion("");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (qId) => {
    if (!window.confirm("Delete this question?")) return;

    try {
      await api.delete(`/api/question/${qId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSession((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q._id !== qId),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= PIN ================= */
  const handlePin = async (qId) => {
    setPinLoading(true);

    try {
      const res = await api.patch(
        `/api/question/pin/${qId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSession((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === qId ? res.data.question : q
        ),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setPinLoading(false);
    }
  };

  /* ================= NOTES ================= */
  const handleNoteSave = async (qId) => {
    try {
      const res = await api.patch(
        `/api/question/note/${qId}`,
        { note: noteInputs[qId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSession((prev) => ({
        ...prev,
        questions: prev.questions.map((q) =>
          q._id === qId ? res.data.question : q
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!session) return <p className="p-10 text-center">Session not found</p>;

  return (
    <div className="min-h-screen p-8 bg-[#f3fbfa]">
      {/* HEADER */}
      <h1 className="text-4xl font-extrabold mb-3 text-[#055f5c]">
        {session.role}
      </h1>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-l-4 border-[#07beb8]">
          <MdWork className="text-xl text-[#07beb8]" />
          {session.experience}
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-l-4 border-[#3dccc7]">
          <MdOutlineVisibility className="text-xl text-[#3dccc7]" />
          {session.topicToFocus}
        </div>
      </div>

      <button
        onClick={handleGenerateQuestions}
        disabled={generatingQuestions}
        className="mb-6 px-5 py-2 rounded-lg bg-[#07beb8] text-white font-semibold"
      >
        {generatingQuestions ? "Generating..." : "Generate AI Questions"}
      </button>

      {/* QUESTIONS */}
      <div className="flex flex-col gap-6">
        {session.questions.map((q, index) => (
          <div
            key={q._id}
            className={`p-5 rounded-xl border ${
              q.isPinned
                ? "border-[#07beb8] bg-white shadow-md"
                : "border-[#cdeeee] bg-[#f9fefe]"
            }`}
          >
            <div className="flex justify-between mb-3">
              <p className="font-semibold">
                {index + 1}. {q.question}
              </p>

              <div className="flex gap-2">
                <button onClick={() => handlePin(q._id)}>
                  <BsFillPinFill
                    className={`text-2xl ${
                      q.isPinned ? "text-[#07beb8]" : "text-gray-400"
                    }`}
                  />
                </button>
                <button onClick={() => handleDelete(q._id)}>
                  <FiTrash2 className="text-xl text-red-500" />
                </button>
              </div>
            </div>

            {/* ANSWER */}
            {q.answer ? (
              <div className="bg-white border p-3 rounded-lg mb-2">
                <strong>A:</strong> {q.answer}
              </div>
            ) : (
              <button
                onClick={() => handleGenerateAnswer(q._id, q.question)}
                disabled={generatingAnswer[q._id]}
                className="px-3 py-1 bg-[#07beb8] text-white rounded-lg mb-2"
              >
                Generate Answer
              </button>
            )}

            {/* EXPLANATION */}
            {q.explanation ? (
              <>
                <button
                  onClick={() =>
                    setShowExplanation((p) => ({
                      ...p,
                      [q._id]: !p[q._id],
                    }))
                  }
                  className="text-sm text-[#055f5c] underline"
                >
                  {showExplanation[q._id] ? "Show less" : "Show more"}
                </button>

                {showExplanation[q._id] && (
                  <div className="mt-2 bg-white p-3 rounded-lg border">
                    {q.explanation}
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => handleGenerateExplanation(q._id, q.question)}
                className="text-sm text-[#055f5c] underline"
              >
                Generate Explanation
              </button>
            )}

            {/* NOTES */}
            <textarea
              className="w-full mt-3 p-2 border rounded-lg"
              placeholder="Add note..."
              value={noteInputs[q._id] || ""}
              onChange={(e) =>
                setNoteInputs((p) => ({
                  ...p,
                  [q._id]: e.target.value,
                }))
              }
            />
            <button
              onClick={() => handleNoteSave(q._id)}
              className="mt-2 px-3 py-1 bg-[#07beb8] text-white rounded-lg"
            >
              Save Note
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
