import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="
        w-full px-6 md:px-20 py-5
        flex items-center justify-between
        bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]
        shadow-lg
      "
    >
      {/* Brand */}
      <h1
        className="
          text-4xl md:text-5xl font-extrabold tracking-wide
          cursor-pointer select-none
          transition-transform duration-300
        "
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <span
          className="
            bg-gradient-to-r from-[#0b2e2c] to-[#000000]
            bg-clip-text text-transparent
            drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]
            hover:from-[#0b4f4c] hover:to-[#145a57]
            transition-all duration-300
          "
        >
         Prep
        </span>
        <span
          className="
            ml-1 bg-gradient-to-r from-[#ffffff] to-[#c4fff9]
            bg-clip-text text-transparent
            drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]
            hover:from-[#9ceaef] hover:to-[#ffffff]
            transition-all duration-300
          "
        >
          Mind
        </span>
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Login */}
        <Link to="/login">
          <button
            className="
              px-7 py-2.5 rounded-full font-semibold
              text-[#0b2e2c]
              bg-gradient-to-r from-[#c4fff9] to-[#9ceaef]
              border border-white/40
              backdrop-blur-md
              hover:from-[#9ceaef] hover:to-[#68d8d6]
              hover:-translate-y-0.5
              hover:shadow-xl
              transition-all duration-300
            "
          >
            Login
          </button>
        </Link>

        {/* Sign Up */}
        <Link to="/signup">
          <button
            className="
              px-8 py-2.5 rounded-full font-bold text-white
              bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]
              ring-2 ring-white/50
              hover:ring-[#c4fff9]
              hover:-translate-y-0.5
              hover:shadow-2xl
              transition-all duration-300
            "
          >
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
