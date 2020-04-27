const MODES = {
  webpack: 'webpack',
  postcss: 'postcss'
}

module.exports = {
  MODES,
  getDefaults: options => ({
    mode: MODES.postcss,
    enabled: options.dev === false,
    paths: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ],
    styleExtensions: ['.css'],
    whitelist: ['body', 'html', 'nuxt-progress', '__nuxt', '__layout'],
    whitelistPatterns: [
      /-(leave|enter|appear)(|-(to|from|active))$/, // Normal transitions
      /^nuxt-link(|-exact)-active$/, // Nuxt link classes
      /^(?!cursor-move).+-move$/, // Move transitions
      /data-v-.*/ // Keep scoped styles
    ],
    whitelistPatternsChildren: [],
    extractors: [
      {
        extractor: (content) => {
          const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '') // Remove inline vue styles
          return contentWithoutStyleBlocks.match(/[\w-.:/]+(?<!:)/g) || []
        },
        extensions: ['html', 'vue', 'js']
      }
    ]
  })
}
