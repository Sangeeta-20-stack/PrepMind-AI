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
<div className="min-h-screen px-8 py-10 bg-gradient-to-br from-[#ecfefe] via-[#f7ffff] to-[#eefbfa]">
  {/* HEADER */}
  <h1 className="text-4xl font-extrabold text-[#033c3a] tracking-tight mb-3">
    {session.role}
  </h1>

  {/* SESSION META */}
  <div className="flex flex-wrap gap-3 mb-8">
    <span className="px-4 py-1.5 rounded-full text-sm font-medium
                     bg-white/80 backdrop-blur
                     border border-[#d7f3f2] text-[#055f5c] shadow-sm">
      Experience: {session.experience}
    </span>

    <span className="px-4 py-1.5 rounded-full text-sm font-medium
                     bg-white/80 backdrop-blur
                     border border-[#d7f3f2] text-[#055f5c] shadow-sm">
      Focus: {session.topicToFocus}
    </span>
  </div>

  {/* GENERATE BUTTON */}
  <button
    onClick={handleGenerateQuestions}
    disabled={generatingQuestions}
    className="mb-10 px-7 py-3 rounded-2xl font-semibold text-white
               bg-gradient-to-r from-[#07beb8] to-[#3dccc7]
               shadow-lg shadow-[#07beb8]/25
               hover:scale-[1.03] hover:shadow-xl
               active:scale-95
               disabled:opacity-60 disabled:cursor-not-allowed
               transition-all"
  >
    {generatingQuestions ? "Generating..." : "Generate AI Questions"}
  </button>

  {/* QUESTIONS */}
  <div className="flex flex-col gap-8">
    {session.questions.map((q, index) => (
      <div
        key={q._id}
        className={`p-6 rounded-3xl border transition-all ${
          q.isPinned
            ? "border-[#07beb8] bg-white shadow-xl shadow-[#07beb8]/10"
            : "border-[#e2f5f4] bg-white/80 backdrop-blur shadow-md"
        }`}
      >
        {/* QUESTION HEADER */}
        <div className="flex justify-between gap-4 mb-4">
          <p className="text-[15px] font-semibold text-[#022f2d] leading-relaxed">
            {index + 1}. {q.question}
          </p>

          {/* ICON ACTIONS */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handlePin(q._id)}
              className="p-2 rounded-full hover:bg-[#07beb8]/10 transition"
            >
              <BsFillPinFill
                className={`text-xl transition ${
                  q.isPinned
                    ? "text-[#07beb8]"
                    : "text-gray-300 hover:text-[#055f5c]"
                }`}
              />
            </button>

            <button
              onClick={() => handleDelete(q._id)}
              className="p-2 rounded-full hover:bg-red-50 transition"
            >
              <FiTrash2 className="text-lg text-red-400 hover:text-red-500" />
            </button>
          </div>
        </div>

        {/* ANSWER */}
        {q.answer ? (
          <div className="mb-4 p-4 rounded-2xl
                          bg-gradient-to-br from-[#f6fefe] to-white
                          border border-[#def3f2]">
            <p className="text-sm text-[#033c3a] leading-relaxed">
              <span className="font-semibold text-[#055f5c]">Answer:</span>{" "}
              {q.answer}
            </p>
          </div>
        ) : (
          <button
            onClick={() => handleGenerateAnswer(q._id, q.question)}
            disabled={generatingAnswer[q._id]}
            className="mb-4 px-4 py-1.5 rounded-xl text-sm font-medium
                       bg-[#07beb8] text-white
                       hover:bg-[#06aaa5]
                       disabled:opacity-60 transition"
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
              className="text-sm text-[#055f5c] hover:text-[#022f2d]
                         underline underline-offset-4"
            >
              {showExplanation[q._id] ? "Hide explanation" : "View explanation"}
            </button>

            {showExplanation[q._id] && (
              <div className="mt-3 p-4 rounded-2xl bg-white
                              border border-[#e6f6f5]
                              text-sm text-[#033c3a] leading-relaxed">
                {q.explanation}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => handleGenerateExplanation(q._id, q.question)}
            className="text-sm text-[#055f5c] hover:text-[#022f2d]
                       underline underline-offset-4"
          >
            Generate Explanation
          </button>
        )}

        {/* NOTES */}
        <textarea
          className="w-full mt-5 p-4 rounded-2xl
                     bg-white/95 border border-[#dff4f3]
                     text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#07beb8]"
          placeholder="Write your personal notes or keywords here…"
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
          className="mt-3 px-5 py-1.5 rounded-xl text-sm font-medium
                     bg-[#3dccc7] text-white
                     hover:bg-[#2fbab5] transition"
        >
          Save Note
        </button>
      </div>
    ))}
  </div>
</div>


  );
}
