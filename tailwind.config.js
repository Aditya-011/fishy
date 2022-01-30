module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
      screens : {
        'xs-mobile' : '320px',
        'mobile' : '540px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '4k' : '2560px'
      },
      extend: 
      {backgroundImage: theme => ({
        'fishy-background': "url('https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/table3.png')",
        'card' : "url('https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/card.png')",
        'btn-bg-primary': "url('https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/bg.png')"
  
       })},
    },
    variants: {
      extend: {
        opacity: ['disabled']
      },
    },
    plugins: [],
  }
  