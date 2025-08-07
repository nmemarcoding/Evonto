/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#b9e6fe',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: [
          'SF Pro Display',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        'ios': '0 2px 10px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1)',
        'ios-md': '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 2px rgba(0, 0, 0, 0.1)',
        'ios-lg': '0 10px 40px rgba(0, 0, 0, 0.12), 0 0 3px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'ios': '10px',
        'ios-lg': '16px',
        'ios-xl': '22px',
        'ios-2xl': '28px',
        'ios-full': '9999px',
      },
    },
  },
  plugins: [],
}