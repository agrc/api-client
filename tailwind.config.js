module.exports = {
  content: ['./src/**/*.html', './src/**/*.{js,jsx}'],
  theme: {
    minWidth: {
      '1/6': '5rem',
    },
    extend: {
      cursor: {
        grab: 'grab',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
