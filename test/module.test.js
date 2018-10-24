const { resolve } = require('path')
const { readFile: fsReadFile } = require('fs')
const { promisify } = require('util')

const readFile = promisify(fsReadFile)

const consola = require('consola')
const getPort = require('get-port')
const { Nuxt, Builder } = require('nuxt-edge')

jest.setTimeout(60 * 1000)

let nuxt, port

describe('nuxt-purgecss', () => {
  let log

  beforeEach(() => {
    log = jest.fn()
    consola.clear().add({ log })
  })

  describe('webpack', () => {
    test('extract and purge css by default', async () => {
      nuxt = await setupNuxt(require('./fixture/configs/webpack/default'))

      const consolaMessages = log.mock.calls.map(c => c[0].message)
      expect(consolaMessages).toContain('Module initialized in webpack mode')

      const globalCSS = await getGlobalCSS()
      expect(globalCSS).not.toMatch('.unused')
      expect(globalCSS).not.toMatch('.custom')
      expect(globalCSS).not.toMatch('.whitelist')
      expect(globalCSS).not.toMatch('.pattern-a')

      expect(globalCSS).toMatch('h1{color:red}')

      const testCSS = await getTestCSS()
      expect(testCSS).not.toMatch('.abc')
      expect(testCSS).toMatch('.ymca')
    })

    test('don\'t show webpack error message in dev', async () => {
      nuxt = await setupNuxt(require('./fixture/configs/webpack/dev'))

      const consolaMessages = log.mock.calls.map(c => c[0].message)
      expect(consolaMessages).not.toContain('Webpack mode only works with build.extractCSS set to *true*. Either extract your CSS or use \'postcss\' mode')
    })

    test('globally disable module', async () => {
      nuxt = await setupNuxt(require('./fixture/configs/webpack/disabled'))

      const consolaMessages = log.mock.calls.map(c => c[0].message)
      expect(consolaMessages).toContain('Module is not enabled')

      const globalCSS = await getGlobalCSS()
      expect(globalCSS).toMatch('.unused')
      expect(globalCSS).toMatch('h1{color:red}')
      expect(globalCSS).toMatch('.custom')
      expect(globalCSS).toMatch('.whitelist')
      expect(globalCSS).toMatch('.pattern-a')

      const testCSS = await getTestCSS()
      expect(testCSS).toMatch('.abc')
      expect(testCSS).toMatch('.ymca')
    })

    test('define custom options for css lookup (concatenating)', async () => {
      nuxt = await setupNuxt(require('./fixture/configs/webpack/custom-options'))

      const consolaMessages = log.mock.calls.map(c => c[0].message)
      expect(consolaMessages).toContain('Module initialized in webpack mode')

      const globalCSS = await getGlobalCSS()
      expect(globalCSS).not.toMatch('.unused')
      expect(globalCSS).toMatch('.custom')
      expect(globalCSS).toMatch('.whitelist')
      expect(globalCSS).toMatch('.pattern-a')
      expect(globalCSS).toMatch('h1{color:red}')

      const testCSS = await getTestCSS()
      expect(testCSS).not.toMatch('.abc')
      expect(testCSS).toMatch('.ymca')
    })

    test('define custom function options for css lookup (overriding)', async () => {
      nuxt = await setupNuxt(require('./fixture/configs/webpack/custom-options-fn'))

      const consolaMessages = log.mock.calls.map(c => c[0].message)
      expect(consolaMessages).toContain('Module initialized in webpack mode')

      const globalCSS = await getGlobalCSS()
      expect(globalCSS).not.toMatch('.unused')
      expect(globalCSS).toMatch('.custom')
      expect(globalCSS).toMatch('.whitelist')
      expect(globalCSS).toMatch('.pattern-a')
      expect(globalCSS).not.toMatch('h1{color:red}')

      const testCSS = await getTestCSS()
      expect(testCSS).not.toMatch('.abc')
      expect(testCSS).not.toMatch('.ymca')
    })
  })
  describe('postcss', () => {
    test('purge css by default', async () => {
      nuxt = await setupNuxt(require('./fixture/configs/postcss/default'))

      const consolaMessages = log.mock.calls.map(c => c[0].message)
      expect(consolaMessages).toContain('Module initialized in postcss mode')

      const globalCSS = await getGlobalCSS('js')
      expect(globalCSS).not.toMatch('.unused')
      expect(globalCSS).not.toMatch('.custom')
      expect(globalCSS).not.toMatch('.whitelist')
      expect(globalCSS).not.toMatch('.pattern-a')

      expect(globalCSS).toMatch('h1{color:red}')

      const testCSS = await getTestCSS('js')
      expect(testCSS).not.toMatch('.abc')
      expect(testCSS).toMatch('.ymca')
    })

    test('globally disable module', async () => {
      nuxt = await setupNuxt(require('./fixture/configs/postcss/disabled'))

      const consolaMessages = log.mock.calls.map(c => c[0].message)
      expect(consolaMessages).toContain('Module is not enabled')

      const globalCSS = await getGlobalCSS('js')
      expect(globalCSS).toMatch('.unused')
      expect(globalCSS).toMatch('h1{color:red}')
      expect(globalCSS).toMatch('.custom')
      expect(globalCSS).toMatch('.whitelist')
      expect(globalCSS).toMatch('.pattern-a')

      const testCSS = await getTestCSS('js')
      expect(testCSS).toMatch('.abc')
      expect(testCSS).toMatch('.ymca')
    })

    test('define custom options for css lookup (concatenating)', async () => {
      nuxt = await setupNuxt(require('./fixture/configs/postcss/custom-options'))

      const consolaMessages = log.mock.calls.map(c => c[0].message)
      expect(consolaMessages).toContain('Module initialized in postcss mode')

      const globalCSS = await getGlobalCSS('js')
      expect(globalCSS).not.toMatch('.unused')
      expect(globalCSS).toMatch('.custom')
      expect(globalCSS).toMatch('.whitelist')
      expect(globalCSS).toMatch('.pattern-a')
      expect(globalCSS).toMatch('h1{color:red}')

      const testCSS = await getTestCSS('js')
      expect(testCSS).not.toMatch('.abc')
      expect(testCSS).toMatch('.ymca')
    })

    test('define custom function options for css lookup (overriding)', async () => {
      nuxt = await setupNuxt(require('./fixture/configs/postcss/custom-options-fn'))

      const consolaMessages = log.mock.calls.map(c => c[0].message)
      expect(consolaMessages).toContain('Module initialized in postcss mode')

      const globalCSS = await getGlobalCSS('js')
      expect(globalCSS).not.toMatch('.unused')
      expect(globalCSS).toMatch('.custom')
      expect(globalCSS).toMatch('.whitelist')
      expect(globalCSS).toMatch('.pattern-a')
      expect(globalCSS).not.toMatch('h1{color:red}')

      const testCSS = await getTestCSS('js')
      expect(testCSS).not.toMatch('.abc')
      expect(testCSS).not.toMatch('.ymca')
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
const getTestCSS = (extension = 'css') => getFileContent(resolve(__dirname, /^win/.test(process.platform)
  ? `${PATH_PREFIX}pages_index.${extension}` : `${PATH_PREFIX}pages/index.${extension}`))

const getFileContent = path => readFile(path, 'utf-8')

const setupNuxt = async (config) => {
  const nuxt = new Nuxt(config)
  await new Builder(nuxt).build()
  port = await getPort()
  await nuxt.listen(port)

  return nuxt
}
