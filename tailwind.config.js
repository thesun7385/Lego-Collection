/** @type {import('tailwindcss').Config} */
// npm run tw:build to rebuild tailwindcss
module.exports = {
  content: [`./views/**/*.ejs`], // all .ejs files
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
