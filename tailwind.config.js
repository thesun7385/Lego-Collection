/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/*.html`], // all .html files
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

