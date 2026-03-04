/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#c8ff00',
        'accent-dark': '#a3cc00',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'orb-1': 'orb1 25s ease-in-out infinite',
        'orb-2': 'orb2 30s ease-in-out infinite',
        'orb-3': 'orb3 20s ease-in-out infinite',
        'grid-drift': 'gridDrift 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        orb1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(80px, 60px) scale(1.1)' },
          '66%': { transform: 'translate(-40px, 30px) scale(0.95)' },
        },
        orb2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-60px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(50px, -20px) scale(0.9)' },
        },
        orb3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-30px, 50px) scale(1.15)' },
        },
        gridDrift: {
          '0%': { backgroundPosition: '0px 0px' },
          '100%': { backgroundPosition: '80px 80px' },
        },
      },
    },
  },
  plugins: [],
}
