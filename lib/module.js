const path = require('path')
const glob = require('glob-all')

const logger = require('./logger')

const { MODES, getDefaults } = require('./utils')

function nuxtPurgeCss (moduleOptions) {
  const { srcDir, purgeCSS = {} } = Object.assign({}, this.options)

  Object.assign(purgeCSS, moduleOptions)

  logger.start('Loading module')

  /*
   * Defaults
   */

  const DEFAULTS = getDefaults(this.options)

  const mergedConfig = Object.entries(purgeCSS).reduce((options, [key, value]) => {
    const defaultValue = DEFAULTS[key]

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

  const { mode, enabled, ...config } = Object.assign({}, DEFAULTS, mergedConfig)

  // transform relative paths
  config.paths = glob.sync(config.paths.map(p => path.join(srcDir, p)))

  if (!enabled) {
    const msg = this.options.dev ? 'PurgeCSS is not enabled because you are in dev mode' : 'Module is not enabled'
    logger.info(msg)
    return
  }

  if (!Object.values(MODES).includes(mode)) {
    logger.error(`Could not load PurgeCSS. Invalid type ${mode}.`)
    return
  }

  if (mode === MODES.webpack) {
    if (!this.options.build.extractCSS) {
      logger.error('Webpack mode only works with build.extractCSS set to *true*. Either extract your CSS or use \'postcss\' mode')
      return
    }
    this.extendBuild(webpackFn(config))
    return
  }

  if (Array.isArray(this.options.build.postcss)) {
    logger.error('build.postcss array option detected. Purgecss will only work in postcss mode with an option object')
    return
  }

  if (config.extractors) {
    config.extractors.forEach((e) => {
      if (e.extractor && e.extractor.extract) {
        logger.warn('extractors need to be defined as function now, transformed class definition to function')
        e.extractor = e.extractor.extract
      }
    })
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

const webpackFn = purgeCssConfig => (config) => {
  const PurgeCssPlugin = require('purgecss-webpack-plugin')
  config.plugins.push(new PurgeCssPlugin(purgeCssConfig))
  logger.success('Module initialized in webpack mode')
}

module.exports = nuxtPurgeCss
module.exports.meta = require('../package.json')
