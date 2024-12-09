module.exports = {
  content: ["./public/**/*.{html,js}", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        idcPrimary: "#d97706",
        idcAccent: "#f3f4f6",
        idcBackground: "#ffffff",
        idcText: "#4b5563",
      },
      fontFamily: {
        idcSans: ["Roboto", "sans-serif"],
        idcSerif: ["Oswald", "serif"],
      },
      fontSize: {
        idcHero: "3.5rem", // Larger hero text
        idcSubHero: "1.5rem",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
        96: "24rem",
      },
      borderRadius: {
        xl: "1rem",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
      },
      animation: {
        shake: "shake 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
