/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "brand-bg": "url('/img/bg.svg')",
        'brand-backdrop': 'radial-gradient(at -20% 10%, rgba(109, 252, 166, 0.38) 0, transparent 20%), radial-gradient(at 250% 100%, rgba(96, 133, 228, 0.28) 0, transparent 64%)',
        'brand-gradient': 'linear-gradient(90deg, #DA4A52 0%, #DF775A 100%)',
        'brand-gradient-tilted': 'linear-gradient(180deg, #DA4A52 0%,  #DF775A 100%)',
        'brand-gradient-dark': 'linear-gradient(90deg, rgba(252, 9, 23, 0.5) 0%, rgba(247, 75, 27, 0.5) 100%)',
        'brand-gradient-dark-tilted': 'linear-gradient(180deg, rgba(252, 9, 23, 0.5) 0%, rgba(247, 75, 27, 0.5) 100%)',
      },
      borderRadius: {
        '2.5xl': '20px',
      },
      colors: {
        'text-base': '#ffffff',
        'brand-transparent-gray': 'rgba(66, 66, 66, 0.2)',
        'brand-light-gray': 'rgba(224, 224, 255, 0.24)',
        'brand-dark-gray': '#353535',
        'brand-orange': '#F54F00',
        'brand-bright-orange': "#DF775A",
      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: "#3F65F3",
          secondary: "#15151A",
          accent: "#6DFCA6",
          success: "#6DFCA6",
          'base-content': "#CCCABE",
          'base-100': '#15151A',
        },
      }
    ]
  },
  plugins: [require("daisyui")],
}
