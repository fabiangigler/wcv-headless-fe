import type { Config } from "tailwindcss";

const generateSpacings = (interval = 5, max = 300) => {
  const array: Record<string, string> = {};
  for (let x = 0; x <= max; x += interval) {
    array[x] = `${x / 10}rem`;
  }
  return array;
};

const config: Config = {
  important: "body",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    spacing: {
      ...generateSpacings(1, 24),
      ...generateSpacings(8, 96),
      ...generateSpacings(16, 400),
    },

    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
