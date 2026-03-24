const { preset } = require('postcss-preset-mantine')

module.exports = {
  plugins: [
    preset({
      autoRem: true,
    }),
  ],
}
