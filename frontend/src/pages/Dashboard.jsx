import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FiPlus, FiLogOut } from "react-icons/fi";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const SERVER_URL = "https://prepmind-ai-og66.onrender.com"; // change to your server URL

  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [sessionForm, setSessionForm] = useState({
    role: "",
    experience: "",
    topicToFocus: "",
    description: "",
  });

  // ================= FETCH USER + SESSIONS =================
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data.user);

        const sessionRes = await api.get("/api/session", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(sessionRes.data.sessions);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate, token]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================= CREATE SESSION =================
  const handleCreateSession = async () => {
    const { role, experience, topicToFocus, description } = sessionForm;

    if (!role || !experience || !topicToFocus) {
      alert("Fill required fields");
      return;
    }

    setLoading(true);
    try {
      const sessionRes = await api.post(
        "/api/session",
        { role, experience, topicToFocus, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessions((prev) => [...prev, sessionRes.data.session]);
      setMessage("Session created successfully");
      setSessionForm({ role: "", experience: "", topicToFocus: "", description: "" });
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4f8] to-[#ffffff]">
      {/* ================= NAVBAR ================= */}
      <nav className="w-full px-6 md:px-20 py-5 flex items-center justify-between bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6] shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide cursor-pointer select-none transition-transform duration-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <span className="bg-gradient-to-r from-[#0b2e2c] to-[#000000] bg-clip-text text-transparent drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] hover:from-[#0b4f4c] hover:to-[#145a57] transition-all duration-300">
            Prep
          </span>
          <span className="ml-1 bg-gradient-to-r from-[#ffffff] to-[#c4fff9] bg-clip-text text-transparent drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)] hover:from-[#9ceaef] hover:to-[#ffffff] transition-all duration-300">
            Mind
          </span>
        </h1>

        <div className="flex items-center gap-4">
          {user.profilePhoto ? (
            <img
              src={`${SERVER_URL}/${user.profilePhoto}`}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
              {user.name[0]}
            </div>
          )}
          <span className="text-white font-semibold">{user.name}</span>

          <button
            onClick={handleLogout}
            className="flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-[#ff4b2b] to-[#ff416c] text-white font-semibold shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <div className="p-8 max-w-7xl mx-auto">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300 mb-6"
        >
          <FiPlus className="mr-2" /> Add New Session
        </button>

        {message && <p className="text-green-600 font-semibold mb-4">{message}</p>}

        {/* ================= SESSION CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/session/${s._id}`)}
              className="bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6] p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 cursor-pointer transition-all duration-300 border border-white/30"
            >
              <div className="flex items-center gap-3 mb-4">
                {s.profilePhoto ? (
                  <img
                    src={`${SERVER_URL}/${s.profilePhoto}`}
                    alt={s.role}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                    {s.role[0]}
                  </div>
                )}
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ffffff] via-[#c4fff9] to-[#9ceaef]">
                  {s.role}
                </h3>
              </div>
              <p className="text-white text-sm mt-1">
                <strong>Experience:</strong> {s.experience}
              </p>
              <p className="text-white text-sm mt-1">
                <strong>Focus:</strong> {s.topicToFocus}
              </p>
              {s.description && (
                <p className="text-white/90 text-sm mt-2 line-clamp-2">{s.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= CREATE SESSION MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl w-full max-w-lg relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-xl font-bold hover:text-red-500 transition-all"
            >
              ✕
            </button>

            <h2 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6] bg-clip-text text-transparent">
              Create Session
            </h2>

            <input
              placeholder="Role"
              className="w-full p-3 mb-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
              value={sessionForm.role}
              onChange={(e) => setSessionForm({ ...sessionForm, role: e.target.value })}
            />
            <input
              placeholder="Experience"
              className="w-full p-3 mb-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
              value={sessionForm.experience}
              onChange={(e) => setSessionForm({ ...sessionForm, experience: e.target.value })}
            />
            <input
              placeholder="Topic to Focus"
              className="w-full p-3 mb-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
              value={sessionForm.topicToFocus}
              onChange={(e) => setSessionForm({ ...sessionForm, topicToFocus: e.target.value })}
            />
            <textarea
              placeholder="Description (optional)"
              className="w-full p-3 mb-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-all"
              value={sessionForm.description}
              onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
            />

            <button
              onClick={handleCreateSession}
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6] text-white font-bold shadow-lg hover:scale-105 transition-all duration-300"
            >
              {loading ? "Creating..." : "Create Session"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
