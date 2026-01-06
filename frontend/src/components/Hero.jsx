import { Sparkles, ArrowRight, Brain } from "lucide-react";

export default function Hero() {
  return (
    <section
      className="
        relative overflow-hidden
        px-6 md:px-20 py-28
        bg-gradient-to-br from-[#c4fff9] via-[#9ceaef] to-[#68d8d6]
      "
    >
      {/* Glow blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#07beb8]/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#3dccc7]/40 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT */}
        <div className="text-center md:text-left animate-fadeInUp">
          {/* Badge */}
          <div
            className="
              inline-flex items-center gap-2 px-4 py-2 mb-6
              rounded-full bg-white/70 backdrop-blur
              text-[#0b2e2c] font-semibold
              shadow-md
            "
          >
            <Sparkles size={18} className="text-[#07beb8]" />
            AI-Powered Interview Prep
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-[#0b2e2c] to-black bg-clip-text text-transparent">
              Ace Your Interviews
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6] bg-clip-text text-transparent">
              Smarter with AI
            </span>
          </h1>

          {/* Text */}
          <p className="mt-6 text-lg md:text-xl text-[#134e4a] max-w-xl">
            Generate role-specific interview questions, pin key ones,
            add notes, and prepare smarter — all in one platform.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-6">
            <button
              className="
                inline-flex items-center gap-2
                px-10 py-4 rounded-full
                text-white font-bold text-lg
                bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]
                shadow-xl shadow-[#07beb8]/40
                hover:scale-105 hover:shadow-2xl
                transition-all duration-300
              "
            >
              <Brain size={22} />
              Get Started
              <ArrowRight size={20} />
            </button>

            <button
              className="
                px-10 py-4 rounded-full
                font-semibold text-lg
                text-[#0b2e2c]
                bg-white/70 backdrop-blur
                border border-white/50
                shadow-md
                hover:bg-white hover:-translate-y-1
                transition-all duration-300
              "
            >
              Learn More
            </button>
          </div>
        </div>

{/* RIGHT IMAGE */}
<div className="flex justify-center animate-fadeInRight">
  <img
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKYpImTSN1GwbPJ-k7YwMvFyXSelrMvh1l8Q&s"
    alt="CareerForge dashboard preview"
    className="
      w-full max-w-md
      object-contain
      rounded-2xl
      shadow-2xl shadow-[#07beb8]/40
    "
  />
</div>



      </div>
    </section>
  );
}
