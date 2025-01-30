module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        anton: ['Anton', 'serif'],
        playwrite: ['"Playwrite AU VIC Guides"', 'serif'],
        ysabeau: ['"Ysabeau SC"', 'serif'],
      },
      fontWeight: {
        custom100: 100,
        custom400: 400,
        custom900: 900,
      },
      animation: {
        'fade-in-left': 'fadeInLeft 1s ease-out forwards',
        'fade-in-right': 'fadeInRight 1s ease-out forwards'
      },
      keyframes: {
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      }
    },
  },
}
