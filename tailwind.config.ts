import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { beige: "#ddd3c3", cream: "#f6f3ef", ink: "#222222", sand: "#ede6da" },
      fontFamily: { sans: ["var(--font-heading)", "Montserrat", "system-ui", "sans-serif"], heading: ["var(--font-heading)", "Montserrat", "system-ui", "sans-serif"], serif: ["var(--font-heading)", "Montserrat", "system-ui", "sans-serif"] }
    }
  },
  plugins: []
};
export default config;
