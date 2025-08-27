/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        display: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0b',
        surface: '#1a1a1b',
        'surface-secondary': '#2a2a2b',
        'surface-tertiary': '#374151',
        'surface-elevated': '#3a3a3b',
        'text-primary': '#ffffff',
        'text-secondary': '#e5e5e5',  // Improved contrast
        'text-muted': '#9ca3af',      // Improved contrast
        'brand-primary': '#667eea',
        'brand-secondary': '#764ba2',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        border: '#374151',
        'border-focus': '#667eea',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'grid-pattern': 'radial-gradient(circle, #374151 1px, transparent 1px)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(102, 126, 234, 0.3)',
        'glow-lg': '0 0 40px rgba(102, 126, 234, 0.4)',
        'shadow-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(102, 126, 234, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
      },
      lineHeight: {
        '12': '3rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
