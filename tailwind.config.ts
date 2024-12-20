import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: { xs: "480px", "2xl": "19200px", "3xl": "2500px" },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        roboto: ["var(--font-roboto)"],
      },
      colors: {
        primary: "#32A8C4",
        secondary: "#B69302",
        subtext: "#1E1E1E99",
        disabled: "rgba(30, 30, 30, 0.30)",
        "disabled-text": "rgba(248, 248, 248, 0.85)",
        light: "#FFF",
        dark: "#1E1E1E",
        greyed: "#1E1E1E80",
        milky: "#FAFAFA",
      },
      borderColor: {
        primary: "#32A8C4",
      },
      fontSize: {
        "2xs": "0.65rem",
      },
    },
  },
  plugins: [],
};
export default config;
