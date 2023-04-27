/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        main : '#0D0D0B',
        sub : '#594839',
        sub2: '#D9CCC1',
        sub3: '#eae5dd',
        textsub: '#3f3f3f',
      },
      backgroundImage:{
        banner:`url('../public/images/homebanner.jpg')`
      },
      fontFamily:{
        outfit:
          'Outfit',
        
      }
    },
  },
  
  plugins: [],
}

