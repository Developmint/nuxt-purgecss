const { resolve } = require('path')
const { readFile: fsReadFile } = require('fs')
const { promisify } = require('util')

const readFile = promisify(fsReadFile)

const consola = require('consola')
const { setup } = require('@nuxtjs/module-test-utils')

jest.setTimeout(60 * 1000)

describe('nuxt-purgecss', () => {
  let log
  let nuxt

  beforeEach(() => {
    log = jest.fn()
    consola.clear().add({ log })
  })

  describe('webpack', () => {
    test('extract and purge css by default', async () => {
      ({ nuxt } = await setup(require('./fixture/configs/webpack/default')))

      const consolaMessages = getConsolaMessages(log)
      expect(consolaMessages).toContain('Module initialized in webpack mode')

      const actualGlobalCSS = await getGlobalCSS()
      const expectedGlobalCSS = {
        matching: ['h1{color:red}'],
        notMatching: ['.unused', '.custom', '.whitelist', '.pattern-a']
      }

      checkCSS(expectedGlobalCSS, actualGlobalCSS)

      const actualTestCSS = await getTestCSS()
      const expectedTestCSS = {
        matching: ['.ymca'],
        notMatching: ['.abc']
      }

      checkCSS(expectedTestCSS, actualTestCSS)
    })

    test('don\'t show webpack error message in dev', async () => {
      ({ nuxt } = await setup(require('./fixture/configs/webpack/dev')))

      const consolaMessages = getConsolaMessages(log)
      expect(consolaMessages).not.toContain('Webpack mode only works with build.extractCSS set to *true*. Either extract your CSS or use \'postcss\' mode')
    })

    test('globally disable module', async () => {
      ({ nuxt } = await setup(require('./fixture/configs/webpack/disabled')))

      const consolaMessages = getConsolaMessages(log)
      expect(consolaMessages).toContain('Module is not enabled')

      const globalCSS = await getGlobalCSS()
      const expectedGlobalCSS = {
        matching: ['.unused', '.custom', '.whitelist', '.pattern-a']
      }

      checkCSS(expectedGlobalCSS, globalCSS)

      const testCSS = await getTestCSS()
      const expectedTestCSS = {
        matching: ['.abc', '.ymca']
      }
      checkCSS(expectedTestCSS, testCSS)
    })

    test('define custom options for css lookup (concatenating)', async () => {
      ({ nuxt } = await setup(require('./fixture/configs/webpack/custom-options')))

      const consolaMessages = getConsolaMessages(log)
      expect(consolaMessages).toContain('Module initialized in webpack mode')

      const globalCSS = await getGlobalCSS()
      const expectedGlobalCSS = {
        notMatching: ['.unused'],
        matching: ['h1{color:red}', '.custom', '.whitelist', '.pattern-a']
      }

      checkCSS(expectedGlobalCSS, globalCSS)

      const testCSS = await getTestCSS()
      const expectedTestCSS = {
        notMatching: ['.abc'],
        matching: ['.ymca']
      }
      checkCSS(expectedTestCSS, testCSS)
    })

    test('define custom function options for css lookup (overriding)', async () => {
      ({ nuxt } = await setup(require('./fixture/configs/webpack/custom-options-fn')))

      const consolaMessages = getConsolaMessages(log)
      expect(consolaMessages).toContain('Module initialized in webpack mode')

      const globalCSS = await getGlobalCSS()
      const expectedGlobalCSS = {
        notMatching: ['.unused', 'h1{color:red}'],
        matching: ['.custom', '.whitelist', '.pattern-a']
      }

      checkCSS(expectedGlobalCSS, globalCSS)

      const testCSS = await getTestCSS()
      const expectedTestCSS = {
        notMatching: ['.abc', '.ymca']
      }
      checkCSS(expectedTestCSS, testCSS)
    })

    describe('vue transitions', () => {
      test('does not purge vue default transitions', async () => {
        ({ nuxt } = await setup(require('./fixture/configs/webpack/default')))

        const globalCSS = await getGlobalCSS()
        const expectedGlobalCSS = {
          matching: ['.v-enter', '.v-enter-active', '.v-enter-to', '.v-leave', '.v-leave-active', '.v-leave-to']
        }

        checkCSS(expectedGlobalCSS, globalCSS)
      })

      test('does not purge vue named transitions', async () => {
        ({ nuxt } = await setup(require('./fixture/configs/webpack/default')))
        const globalCSS = await getGlobalCSS()
        const expectedGlobalCSS = {
          matching: ['.named-transition-enter', '.named-transition-enter-active', '.named-transition-enter-to', '.named-transition-leave', '.named-transition-leave-active', '.named-transition-leave-to']
        }

        checkCSS(expectedGlobalCSS, globalCSS)
      })
    })
  })
  describe('postcss', () => {
    test('purge css by default', async () => {
      ({ nuxt } = await setup(require('./fixture/configs/postcss/default')))

      const consolaMessages = getConsolaMessages(log)
      expect(consolaMessages).toContain('Module initialized in postcss mode')

      const actualGlobalCSS = await getGlobalCSS('js')
      const expectedGlobalCSS = {
        matching: ['h1{color:red}', 'nuxt-config-class{'],
        notMatching: ['.unused', '.custom{', '.whitelist', '.pattern-a']
      }

      checkCSS(expectedGlobalCSS, actualGlobalCSS)

      const actualTestCSS = await getTestCSS('js')
      const expectedTestCSS = {
        matching: ['.ymca', '.bound{'],
        notMatching: ['.abc', '.inline-unused']
      }
      checkCSS(expectedTestCSS, actualTestCSS)
    })

    test('globally disable module', async () => {
      ({ nuxt } = await setup(require('./fixture/configs/postcss/disabled')))

      const consolaMessages = getConsolaMessages(log)
      expect(consolaMessages).toContain('Module is not enabled')

      const globalCSS = await getGlobalCSS('js')
      const expectedGlobalCSS = {
        matching: ['.unused', 'h1{color:red}', '.custom{', '.whitelist', '.pattern-a']
      }

      checkCSS(expectedGlobalCSS, globalCSS)

      const testCSS = await getTestCSS('js')
      const expectedTestCSS = {
        matching: ['.abc', '.ymca']
      }
      checkCSS(expectedTestCSS, testCSS)
    })

    test('define custom options for css lookup (concatenating)', async () => {
      ({ nuxt } = await setup(require('./fixture/configs/postcss/custom-options')))

      const consolaMessages = getConsolaMessages(log)
      expect(consolaMessages).toContain('Module initialized in postcss mode')

      const globalCSS = await getGlobalCSS('js')
      const expectedGlobalCSS = {
        matching: ['h1{color:red}', '.custom{', '.whitelist', '.pattern-a'],
        notMatching: ['unused']
      }

      checkCSS(expectedGlobalCSS, globalCSS)

      const testCSS = await getTestCSS('js')
      const expectedTestCSS = {
        matching: ['.ymca'],
        notMatching: ['.abc']
      }
      checkCSS(expectedTestCSS, testCSS)
    })

    test('define custom function options for css lookup (overriding)', async () => {
      ({ nuxt } = await setup(require('./fixture/configs/postcss/custom-options-fn')))

      const consolaMessages = getConsolaMessages(log)
      expect(consolaMessages).toContain('Module initialized in postcss mode')

      const globalCSS = await getGlobalCSS('js')
      const expectedGlobalCSS = {
        notMatching: ['.unused', 'h1{color:red}'],
        matching: ['.custom{', '.whitelist', '.pattern-a']
      }
      checkCSS(expectedGlobalCSS, globalCSS)

      const testCSS = await getTestCSS('js')
      const expectedTestCSS = {
        notMatching: ['.abc', '.ymca']
      }
      checkCSS(expectedTestCSS, testCSS)
    })
  })

  afterEach(async () => {
    if (nuxt) {
      await nuxt.close()
    }
  })
})

const PATH_PREFIX = '../.nuxt/dist/client/'

const getGlobalCSS = (extension = 'css') => getFileContent(resolve(__dirname, `${PATH_PREFIX}app.${extension}`))
const getTestCSS = (extension = 'css') => getFileContent(resolve(__dirname,
  process.platform.startsWith('win')
    ? `${PATH_PREFIX}pages_index.${extension}`
    : `${PATH_PREFIX}pages/index.${extension}`)
)

const checkCSS = (expected, actual) => {
  if (expected.notMatching) {
    expected.notMatching.forEach(str => expect(actual).not.toMatch(str))
  }
  if (expected.matching) {
    expected.matching.forEach(str => expect(actual).toMatch(str))
  }
}

const getFileContent = path => readFile(path, 'utf-8')

const getConsolaMessages = log => log.mock.calls.map(([res]) => res.message)
