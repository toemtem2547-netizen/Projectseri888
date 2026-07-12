import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,js,jsx}",
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/lib/**/*.{ts,tsx,js,jsx}",
    "./node_modules/shadcn/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'cv-primary': '#E50914',
        'cv-secondary': '#3B82F6',
        'cv-accent': '#F5C518',
        'cv-highlight': '#FCA5A5',
        'cv-deep': '#0B0B0F',
        'cv-surface': '#181A20',
        'cv-card': '#181A20',
        'cv-text': '#FFFFFF',
        'cv-text-dim': '#9CA3AF'
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui"],
        heading: ["var(--font-heading)", "Poppins", "sans-serif"],
        number: ["var(--font-number)", "sans-serif"]
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      }
    }
  },
  plugins: [],
};

export default config;
