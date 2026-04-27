/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#efe8ff',
          100: '#ddccff',
          200: '#c4a7ff',
          300: '#a87bff',
          400: '#9355f6',
          500: '#7C3AED',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b0764',
        },
        success: {
          light: '#4ade80',
          DEFAULT: '#22C55E',
          dark: '#166534',
        },
        warning: {
          light: '#fbbf24',
          DEFAULT: '#F59E0B',
          dark: '#b45309',
        },
        error: {
          light: '#f87171',
          DEFAULT: '#EF4444',
          dark: '#b91c1c',
        },
        background: '#0B0014',
        textPrimary: '#E9D5FF',
        textSecondary: '#C4B5FD',
        border: '#3b1c59',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        accent: ['Sora', 'Orbitron', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 6px 20px rgba(12, 0, 27, 0.45)',
        'medium': '0 12px 30px rgba(15, 2, 30, 0.55)',
        'large': '0 22px 52px rgba(15, 2, 30, 0.7)',
        'glow': '0 0 24px rgba(147, 51, 234, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rippleBurst': 'rippleBurst 0.62s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        rippleBurst: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.4)', opacity: '0.95' },
          '100%': { transform: 'translate(-50%, -50%) scale(16)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
