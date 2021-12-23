module.exports = {
  content: ['./src/**/*.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      cursor: {
        grab: 'grab',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
