/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Jira-inspired palette
        primary: "#0052CC",
        "primary-hover": "#0747A6",
        "bg-surface": "#FFFFFF",
        "bg-subtle": "#F4F5F7",
        "border-subtle": "#DFE1E6",
        "text-main": "#172B4D",
        "text-muted": "#6B778C",

        // Legacy semantic aliases retained for safety (used in existing components)
        headerColor: "#242530",
        textColor: "#ffffff",
        btnColor: "#0052CC",
        noteColor: "#FFCF7C",
      },
      fontWeight: {
        customWeight: 500,
      },
      height: {
        headerHeight: "74px",
      },
      maxHeight: {
        navbarHeight: "420px",
      },
      minHeight: {
        customHeight: "530px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Headings
        h1: "32px",
        h2: "24px",
        h3: "18px",
        // Body
        body: "14px",
        tableHeader: ["15px", "25px"],
      },
      backgroundColor: {
        customRed: "rgba(172, 30, 35, 1)",
        testimonialCard: "#F9F9F9",
      },
      boxShadow: {
        custom: "0 0 15px rgba(0, 0, 0, 0.12)",
        "card-md": "0 8px 24px rgba(9, 30, 66, 0.15)",
      },
    },
  },
  plugins: [],
};
