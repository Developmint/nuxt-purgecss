const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../../../'),
  srcDir: resolve(__dirname, '../../'),
  css: ['~/assets/a.css'],
  render: {
    resourceHints: false
  },
  dev: false,
  modules: ['@@'],
  build: {
    quiet: false,
    extractCSS: true,
    optimization: {
      splitChunks: {
        name: true
      }
    },
    filenames: {
      css: () => '[name].css'
    }
  },

  purgeCSS: {
    paths: () => ['custom/**/*.vue'],
    whitelist: () => ['whitelist'],
    whitelistPatterns: () => [/pattern/]
  }
}
