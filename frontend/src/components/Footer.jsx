export default function Footer() {
  return (
    <footer className="bg-[#07beb8] text-white mt-20 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-16 grid gap-10 md:grid-cols-3">
        {/* Brand */}
        <div className="group transition-all hover:translate-y-1">
          <h2 className="text-3xl font-bold tracking-tight mb-4 drop-shadow-md">
            Career<span className="text-white/90">Forge</span>
          </h2>
          <p className="text-white/90 text-base drop-shadow-sm max-w-xs">
            AI-powered interview platform to help you practice smarter and stay organized.
          </p>
        </div>

        {/* Product Links */}
        <div className="group transition-all hover:translate-y-1">
          <h3 className="text-xl font-semibold mb-4 drop-shadow-sm">Product</h3>
          <ul className="space-y-3">
            {["Features", "AI Practice", "Sessions", "Pricing"].map((item, i) => (
              <li
                key={i}
                className="
                  text-white/85 text-base
                  hover:text-white
                  hover:underline
                  cursor-pointer
                  transition-all duration-300
                  hover:drop-shadow-lg
                "
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Auth Links */}
        <div className="group transition-all hover:translate-y-1">
          <h3 className="text-xl font-semibold mb-4 drop-shadow-sm">Get Started</h3>
          <ul className="space-y-3">
            {["Login", "Sign Up"].map((item, i) => (
              <li
                key={i}
                className="
                  text-white/85 text-base
                  hover:text-white
                  hover:underline
                  cursor-pointer
                  transition-all duration-300
                  hover:drop-shadow-lg
                "
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-white/30 text-center py-5 text-base text-white/80 drop-shadow-sm">
        © {new Date().getFullYear()} CareerForge. All rights reserved.
      </div>
    </footer>
  );
}
