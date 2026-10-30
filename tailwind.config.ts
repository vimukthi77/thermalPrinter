import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          '"Courier New"',
          "Courier",
          "Consolas",
          '"Lucida Console"',
          "monospace",
        ],
      },
      screens: {
        print: { raw: "print" },
      },
    },
  },
  plugins: [],
};
export default config;

