import FeatureCard from "./FeatureCard";
import {
  Brain,
  Layers,
  Pin,
  NotebookPen,
  Lightbulb,
  Sparkles,
} from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "AI-Generated Questions",
      desc: "Generate interview questions tailored to your role, experience, and tech stack.",
      icon: Brain,
    },
    {
      title: "Session-Based Preparation",
      desc: "Create focused interview sessions and track your progress systematically.",
      icon: Layers,
    },
    {
      title: "Pin & Prioritize",
      desc: "Pin important questions so you never miss revising the most critical ones.",
      icon: Pin,
    },
    {
      title: "Smart Notes",
      desc: "Add personal notes and AI explanations to every interview question.",
      icon: NotebookPen,
    },
    {
      title: "Concept Explanations",
      desc: "Get clear explanations for tricky concepts with real-world examples.",
      icon: Lightbulb,
    },
    {
      title: "Clean & Distraction-Free UI",
      desc: "Minimal, calm design that keeps you focused on preparation.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="px-6 md:px-20 py-24 bg-[#c4fff9]/40">
     {/* Section Heading */}
<div className="text-center max-w-2xl mx-auto group">
  <h2
    className="
      text-3xl md:text-5xl font-extrabold
      bg-gradient-to-r from-[#07beb8] via-[#3dccc7] to-[#68d8d6]
      bg-clip-text text-transparent
      transition-all duration-500
      group-hover:tracking-wide
      group-hover:drop-shadow-[0_6px_20px_rgba(7,190,184,0.35)]
    "
  >
    Why Choose CareerForge?
  </h2>

  <p
    className="
      mt-5 text-lg md:text-xl
      text-[#134e4a]
      transition-all duration-500
      group-hover:text-[#0b2e2c]
      group-hover:translate-y-1
    "
  >
    Everything you need to prepare smarter, faster,
    and with absolute confidence.
  </p>

  {/* Accent underline */}
  <div
    className="
      mx-auto mt-6 h-1 w-24 rounded-full
      bg-gradient-to-r from-[#07beb8] to-[#3dccc7]
      transition-all duration-500
      group-hover:w-36
    "
  />
</div>


      {/* Feature Grid */}
      <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard
            key={i}
            title={f.title}
            desc={f.desc}
            icon={f.icon}
          />
        ))}
      </div>
    </section>
  );
}
