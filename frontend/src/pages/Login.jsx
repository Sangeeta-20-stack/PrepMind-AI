import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setMessage("Logged in successfully!");
      setForm({ email: "", password: "" });

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Centered card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 border-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]">
        {/* Heading */}
        <h1 className="text-3xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]">
          Login
        </h1>
        <p className="text-sm text-gray-700 mb-6 text-center">
          Welcome back! Please login to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Email */}
          <div className="border-2 border-[#07beb8] rounded-xl p-1 transition hover:border-[#3dccc7]">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#07beb8] bg-white/70"
            />
          </div>

          {/* Password */}
          <div className="border-2 border-[#3dccc7] rounded-xl p-1 transition hover:border-[#07beb8]">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#3dccc7] bg-white/70"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-600">{message}</p>}

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#07beb8] font-medium underline hover:text-[#3dccc7] transition"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
