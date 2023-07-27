/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'primary': '#e7eff1',
      },
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif']
      }
    }
  },
  plugins: []
};