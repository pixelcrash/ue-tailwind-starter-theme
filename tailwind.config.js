module.exports = {
  mode: 'jit',
  purge: ['./*.{php,html}', './**/*.{html,php}'],
  content: ['./*.{php,html}', './**/*.{html,php}'],
  darkMode: false, 
  corePlugins: {
    container: true
  },
  plugins: [
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
      },    
    },
  },
  // Other stuff 
};

