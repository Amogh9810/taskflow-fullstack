export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0f0f13',
        surface: '#1a1a24',
        'surface-light': '#252533',
        primary: '#6c63ff',
        success: '#00d084',
        warning: '#ffa500',
        danger: '#ff6b6b',
        muted: '#8c8c96',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
