module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.html', './src/**/*.{js,jsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    cursor: {
      grab: 'grab',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
