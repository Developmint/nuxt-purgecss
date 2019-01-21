const path = require('path')
const glob = require('glob-all')

const logger = require('consola').withScope('nuxt-purgecss')

const MODES = {
  webpack: 'webpack',
  postcss: 'postcss'
}

export default function nuxtPurgeCss(moduleOptions) {
  const { srcDir, purgeCSS = {} } = Object.assign({}, this.options)

  Object.assign(purgeCSS, moduleOptions)

  logger.start('Loading module')

  const defaults = {
    mode: MODES.webpack,
    enabled: this.options.debug ? false : ({ isDev, isClient }) => (!isDev && isClient),
    paths: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js'
    ],
    styleExtensions: ['.css'],
    whitelist: ['body', 'html', 'nuxt-progress'],
    whitelistPatterns: [],
    whitelistPatternsChildren: [],
    extractors: [
      {
        extractor: class {
          static extract(content) {
            return content.match(/[A-z0-9-:\\/]+/g) || []
          }
        },
        extensions: ['html', 'vue', 'js']
      }
    ]
  }

  /*
   * Defaults
   */

  const mergedConfig = Object.entries(purgeCSS).reduce((options, [key, value]) => {
    const defaultValue = defaults[key]

    if (value && typeof value !== 'function' && Array.isArray(defaultValue)) {
      // Merge value with default value if array
      value = defaultValue.concat(value)
    } else if (typeof value === 'function') {
      // Executed value functions and provide default value as param
      value = value(defaultValue)
    }

    // Finally assign
    options[key] = value
    return options
  }, {})

  const { mode, enabled, ...config } = Object.assign({}, defaults, mergedConfig)

  // transform relative paths
  config.paths = glob.sync(config.paths.map(p => path.join(srcDir, p)))

  if (!enabled) {
    if (typeof purgeCSS.enabled === 'undefined') {
      logger.info('PurgeCSS is not enabled because you are in dev mode')
      return
    }
    logger.warn('Module is not enabled')
    return
  }

  if (!Object.values(MODES).includes(mode)) {
    logger.error(`Could not load PurgeCSS. Invalid type ${mode}.`)
    return
  }

  if (mode === MODES.webpack) {
    if (!this.options.build.extractCSS) {
      logger.error(`Webpack mode only works with build.extractCSS set to *true*. Either extract your CSS or use 'postcss' mode`)
      return
    }
    this.extendBuild(webpackFn(enabled, config))
    return
  }

  if (Array.isArray(this.options.build.postcss)) {
    logger.error(`build.postcss array option detected. Purgecss will only work in postcss mode with an option object`)
    return
  }

  const purgeCssPluginsObject = {
    '@fullhuman/postcss-purgecss': {
      content: config.paths,
      ...config
    }
  }

  if (!this.options.build.postcss.plugins || !Object.keys(this.options.build.postcss.plugins).length) {
    this.options.build.postcss.plugins = {}
  }

  Object.assign(this.options.build.postcss.plugins, purgeCssPluginsObject)

  logger.success('Module initialized in postcss mode')
}

const webpackFn = (enabled, purgeCssConfig) => (config, ctx) => {
  if (typeof enabled === 'function' && !enabled(ctx)) {
    return
  }
  const PurgeCssPlugin = require('purgecss-webpack-plugin')
  config.plugins.push(new PurgeCssPlugin(purgeCssConfig))
  logger.success('Module initialized in webpack mode')
}

module.exports.meta = require('../package.json')
