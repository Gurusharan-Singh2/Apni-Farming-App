/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#00750c",
        secondary: "#f0d699a3",
        dark: "#2b2b2b",
        light: "#f8f9fa",
        accent: "#ff6f61",
        muted: "#6c757d",
      },
      fontFamily: {
        bebas: ["BebasNeue"], // ✅ Use className="font-bebas"
      },
    },
  },
  plugins: [],
};
