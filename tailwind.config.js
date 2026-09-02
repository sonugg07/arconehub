/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050713",
        foreground: "#F8FAFC",
        arc: {
          darkest: "#03040A",
          dark: "#060919",
          card: "#0A0E24",
          cardHover: "#0E1433",
          border: "rgba(255, 255, 255, 0.08)",
          borderGlow: "rgba(0, 114, 255, 0.3)",
          blue: "#0066FF",
          electric: "#00D2FF",
          violet: "#8B5CF6",
          purple: "#7928CA",
          cyan: "#06B6D4",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "arc-gradient": "linear-gradient(135deg, #0066FF 0%, #7928CA 50%, #00D2FF 100%)",
        "arc-glow": "radial-gradient(circle at 50% 50%, rgba(0, 102, 255, 0.15) 0%, rgba(121, 40, 202, 0.08) 50%, transparent 80%)",
        "glass-card": "linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "glass-glow": "linear-gradient(135deg, rgba(0, 102, 255, 0.12) 0%, rgba(121, 40, 202, 0.06) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-highlight": "inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
        "glow-blue": "0 0 35px -5px rgba(0, 102, 255, 0.45)",
        "glow-violet": "0 0 35px -5px rgba(139, 92, 246, 0.45)",
        "glow-cyan": "0 0 35px -5px rgba(6, 182, 212, 0.45)",
        "glow-lg": "0 0 50px -10px rgba(0, 102, 255, 0.35)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "float-reverse": "floatReverse 8s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "spin-slow": "spin 20s linear infinite",
        beam: "beam 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        beam: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
