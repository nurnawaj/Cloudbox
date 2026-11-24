module.exports = {
  darkMode: "class", // dark mode turns on when <html> has the "dark" class
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // lagoon: the main brand colour
        brand: {
          50: "#E8F6F7", 100: "#C7EBEE", 200: "#96D8DD", 300: "#5FC0C8", 400: "#2FA6B0",
          500: "#0E8A95", 600: "#0B6F79", 700: "#0A5961", 800: "#0A464D", 900: "#09353B",
        },
        // ink: cool blue-greys for text, borders and dark surfaces
        ink: {
          50: "#F4F7FA", 100: "#E9EEF3", 200: "#D5DDE6", 300: "#B3BFCE", 400: "#8594A9",
          500: "#5F7089", 600: "#485871", 700: "#344159", 800: "#1F2B40", 900: "#131E31", 950: "#0B1220",
        },
        coral: { 50: "#FDEDEA", 100: "#FAD5CF", 400: "#EE826F", 500: "#E5604D", 600: "#CC4A38", 700: "#A93A2B" },
        sun: { 400: "#F5B83D", 500: "#E9A21A" },
      },
      fontFamily: {
        sans: ['"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', '"DM Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        pop: {
          from: { opacity: "0", transform: "translateY(8px) scale(.98)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: { "fade-in": "fadeIn .15s ease-out", pop: "pop .18s ease-out" },
    },
  },
  plugins: [],
};
