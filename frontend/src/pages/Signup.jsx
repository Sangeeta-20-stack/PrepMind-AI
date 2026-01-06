import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", photo: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      const file = e.target.files[0];
      setForm({ ...form, photo: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("password", form.password);
      if (form.photo) data.append("photo", form.photo);

      const res = await api.post("/api/auth/register", data);
      setMessage(res.data.message || "Registered successfully");

      setForm({ name: "", email: "", password: "", photo: null });
      setPreview(null);

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.status === 409) setMessage("Email already registered. Please login.");
      else setMessage("Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Centered card */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 border-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]">
        
        {/* Heading */}
        <h1 className="text-3xl font-extrabold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]">
          Create Account
        </h1>
        <p className="text-sm text-gray-700 mb-6 text-center">Join Prepmind in just a few seconds</p>

      {/* Image Upload */}
<div className="mb-6 flex justify-center">
  <label className="cursor-pointer relative">
    <input type="file" name="photo" accept="image/*" onChange={handleChange} className="hidden" />
    
    {/* Outer gradient border */}
    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6] hover:scale-105 transition-transform">
      
      {/* Inner circle with subtle border */}
      <div className="w-full h-full rounded-full bg-white/30 border-4 border-white flex items-center justify-center overflow-hidden">
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <FiUpload className="text-4xl mb-1 text-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]" />
            <span className="text-sm font-semibold bg-clip-text text-transparent
                             bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]">
             
            </span>
          </div>
        )}
      </div>
    </div>
  </label>
</div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Name */}
          <div className="border-2 border-[#07beb8] rounded-xl p-1 transition hover:border-[#3dccc7]">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#07beb8]"
            />
          </div>

          {/* Email */}
          <div className="border-2 border-[#68d8d6] rounded-xl p-1 transition hover:border-[#9ceaef]">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#68d8d6]"
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
              className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-[#3dccc7]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-[#07beb8] font-medium underline hover:text-[#3dccc7] transition">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
