/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(to right, #3b82f6, #9333ea)", // equivalent to from-blue-500 to-purple-600
        "custom-gradient-2": "linear-gradient(to left, #3b82f6, #f43f5e)",
        "card-gradient": "linear-gradient(to right, #38b2ac, #4299e1)",
        "dark-gradient": "linear-gradient(to right, #0f172a, #020617)",
        "darker-gradient": "linear-gradient(to right, #020617, #000000)",
        "dark-gradient-accent": "linear-gradient(to right, #1e3a8a, #312e81)",
        "dark-gradient-highlight": "linear-gradient(to right, #4f46e5, #7c3aed)",
        "dark-card-gradient": "linear-gradient(135deg, #0f172a, #020617)",
        "light-gradient": "linear-gradient(to right, #f8fafc, #f1f5f9)",
        "light-gradient-accent": "linear-gradient(to right, #e0e7ff, #c7d2fe)",
      },
      colors: {
        navbarColor: "#020617",
        btnColor: "#4f46e5",
        linkColor: "#818cf8",
        darkBg: "#020617", // Darker background
        darkerBg: "#000000", // Pure black
        darkCard: "#0f172a", // Darker card background
        darkCardHover: "#1e293b",
        darkText: "#f8fafc",
        darkTextSecondary: "#94a3b8",
        darkBorder: "#1e293b",
        darkHighlight: "#6366f1",
        // Light theme colors
        lightBg: "#f8fafc",
        lightCard: "#ffffff",
        lightText: "#0f172a",
        lightTextSecondary: "#475569",
        lightBorder: "#e2e8f0",
        lightHighlight: "#4f46e5",
        gray: {
          750: "#2d3748",
          850: "#1a202c",
          950: "#0b0f19",
          980: "#050914",
        },
      },
      boxShadow: {
        custom: "0 0 15px rgba(0, 0, 0, 0.3)",
        right: "10px 0px 10px -5px rgba(0, 0, 0, 0.3)",
        "dark-glow": "0 0 15px rgba(99, 102, 241, 0.15)",
        "dark-card": "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "darker-card": "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
        "light-card": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        montserrat: ["Montserrat"],
      },
    },
  },

  variants: {
    extend: {
      backgroundImage: ["responsive", "hover", "focus", "dark"],
      backgroundColor: ["dark", "dark-hover", "dark-group-hover"],
      textColor: ["dark", "dark-hover", "dark-active"],
    },
  },

  plugins: [],

  darkMode: 'class',
};