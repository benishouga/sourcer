module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: [
    require('css-mqpacker'),
    require('autoprefixer')
  ]
});