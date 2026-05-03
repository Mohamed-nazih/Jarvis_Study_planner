/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jarvis: {
          dark: '#050a15',
          panel: '#0a1526',
          border: '#1a365d',
          blue: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.5)',
          text: '#e2e8f0',
          muted: '#94a3b8'
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(56, 189, 248, 0.3)',
        'glow-lg': '0 0 25px rgba(56, 189, 248, 0.5)',
      }
    },
  },
  plugins: [],
}
