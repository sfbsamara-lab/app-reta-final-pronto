/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        neon: {
          orange: '#FF5F1F',
          red: '#FF0033',
          yellow: '#FFD700',
          slate: '#0F172A',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #FF5F1F' },
          '100%': { boxShadow: '0 0 20px #FF5F1F, 0 0 10px #FFD700' },
        }
      }
    },
  },
  plugins: [],
}