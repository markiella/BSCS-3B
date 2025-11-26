module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: '#2563EB',
      },
      boxShadow: {
        card: '0 18px 45px rgba(15, 23, 42, 0.45)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
