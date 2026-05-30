/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#dde6ff',
          200: '#c0d0ff',
          300: '#94aef8',
          400: '#6483f0',
          500: '#3f5ee6',
          600: '#2d3fcc',
          700: '#2231a5',
          800: '#1e2b87',
          900: '#1a246b',
          950: '#0f1540',
        },
        steel: {
          50: '#f4f7fb',
          100: '#e8eff6',
          200: '#ccdcec',
          300: '#9fbfdb',
          400: '#6c9cc5',
          500: '#497fb0',
          600: '#366494',
          700: '#2c5079',
          800: '#264465',
          900: '#233b55',
          950: '#172638',
        },
        earth: {
          50: '#fdf8f2',
          100: '#f9eedf',
          200: '#f2dabb',
          300: '#e8c089',
          400: '#dc9f54',
          500: '#d38432',
          600: '#c46b22',
          700: '#a3531d',
          800: '#84431f',
          900: '#6c391d',
          950: '#3a1c0c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.12)',
        'glow-blue': '0 0 20px rgba(59,130,246,0.25)',
        'glow-navy': '0 0 24px rgba(30,43,135,0.2)',
      },
    },
  },
  plugins: [],
};
