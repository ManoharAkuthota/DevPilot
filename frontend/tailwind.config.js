/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        card: 'rgba(255, 255, 255, 0.05)',
        cardHover: 'rgba(255, 255, 255, 0.08)',
        borderGlass: 'rgba(255, 255, 255, 0.1)',
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
          light: '#60A5FA'
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          dark: '#6D28D9',
          light: '#A78BFA'
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        textMain: '#F8FAFC',
        muted: '#94A3B8'
      },
      borderRadius: {
        '20': '20px',
        '24': '24px'
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'glow-secondary': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
