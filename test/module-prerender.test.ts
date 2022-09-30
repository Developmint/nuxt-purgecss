import { promises as fsp } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { describe, it, expect } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  build: true,
  nuxtConfig: {
    hooks: {
      'modules:before' (ctx) {
        ctx.nuxt.options.nitro.prerender = { routes: ['/'] }
      }
    }
  }
})

describe('Nuxt prerender', () => {
  it('should purge classes', async () => {
    const ctx = useTestContext()
    const html = await fsp.readFile(
      resolve(ctx.nuxt!.options.nitro.output?.dir || '', 'public/index.html'),
      'utf-8'
    )

    const CONTENT_TO_EXPECT = ['.red', 'div{color:green}', '.safe', '{color:salmon}']
    CONTENT_TO_EXPECT.forEach(c => expect(html).toContain(c))
  })
})
