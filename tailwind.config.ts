import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#f8f9fa",
      },
    },
  },
  plugins: [],
} satisfies Config;
