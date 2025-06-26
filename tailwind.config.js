module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        intersemi: ['Inter Semi', 'sans-serif'],
      },
      fontSize: {
        '45xl': '40px',
        '55xl': '56px',
        '32xl': '32px',
        '1xl': '22px',
        'xxs': '10px',
      },
      colors: {
        "theme-dark": "rgb(54, 44, 34)", // #362C22
        "theme-blue": "rgb(0, 190, 242)", // #00BEF2
        "theme-text-2": "rgb(91, 91, 91)", // #5B5B5B
        "theme-light-gray": "rgb(245, 247, 247)", // #F5F7F7
        "theme-light-gray-2": "rgb(239, 242, 229)", // #EFF2E5
        "theme-light-gray-3": "rgb(243, 245, 243)", // #F3F5F3
        "theme-light-gold": "rgb(243, 242, 235)", // #F3F2EB
        "theme-border": "rgb(224, 224, 224)", // #E0E0E0

      },
    },
  },
  plugins: [],
}