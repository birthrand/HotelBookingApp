/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        blue: {
          100: "#E4E4FA",
          200: "#C8C8F4",
          300: "#4C4DDC",
        },
        accent: {
          100: "#E1E1E1",
        },
        black: {
          DEFAULT: "#101010",
        },
        danger: "#FF3B30",
      },
    },
  },
  plugins: [],
};
