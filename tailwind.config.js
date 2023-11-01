/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.ejs`], // all .ejs files
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

