export default function FeatureCard({ title, desc, icon: Icon }) {
  return (
    <div
      className="
        group relative
        bg-white/80 backdrop-blur
        rounded-2xl p-7
        border-2 border-[#07beb8]/30
        shadow-lg shadow-[#07beb8]/10
        transition-all duration-300
        hover:-translate-y-2
        hover:shadow-2xl hover:shadow-[#07beb8]/30
      "
    >
      {/* glow on hover */}
      <div
        className="
          absolute inset-0 rounded-2xl
          opacity-0 group-hover:opacity-100
          bg-gradient-to-br from-[#07beb8]/10 via-[#3dccc7]/10 to-[#68d8d6]/10
          transition-opacity duration-300
          pointer-events-none
        "
      />

      {/* icon */}
      {Icon && (
        <div
          className="
            w-12 h-12 mb-4
            flex items-center justify-center
            rounded-xl
            bg-gradient-to-br from-[#07beb8] to-[#3dccc7]
            text-white
            shadow-md
            group-hover:scale-110
            transition-transform duration-300
          "
        >
          <Icon size={22} />
        </div>
      )}

      {/* heading */}
      <h3
        className="
          relative z-10
          text-xl md:text-2xl font-bold
          font-sans tracking-tight
          text-[#0b2e2c]
          mb-3
          group-hover:text-[#3dccc7]
          transition-colors duration-300
        "
      >
        {title}
      </h3>

      <p className="relative z-10 text-[#4b4b4b] leading-relaxed text-base md:text-lg">
        {desc}
      </p>
    </div>
  );
}
