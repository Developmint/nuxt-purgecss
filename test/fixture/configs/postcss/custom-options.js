const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../../../'),
  srcDir: resolve(__dirname, '../../'),
  css: ['~/assets/a.css'],
  render: {
    resourceHints: false
  },
  dev: false,
  buildModules: [
    [require('../../../../'), { mode: 'postcss' }]
  ],
  build: {
    quiet: false,
    optimization: {
      splitChunks: {
        name: true
      }
    },
    filenames: {
      app: () => '[name].js',
      chunk: () => '[name].js'
    }
  },
  purgeCSS: {
    paths: ['custom/**/*.vue'],
    styleExtensions: ['.css'],
    whitelist: ['whitelist'],
    whitelistPatterns: [/pattern/]
  }
}
