
import { defineNuxtModule } from '@nuxt/kit'
import { join, isAbsolute } from 'pathe'
import consola from 'consola'
import { DEFAULTS, ModuleOptions } from './config'

const logger = consola.withScope('nuxt:tailwindcss')

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-purgecss',
    configKey: 'purgecss',
    compatibility: {
      nuxt: '^3.0.0-rc.11'
    }
  },
  defaults: (nuxt) => {
    const enabled = !nuxt.options.dev
    return { ...DEFAULTS, enabled }
  },
  setup ({ enabled, ...purgecssOptions }, nuxt) {
    if (!enabled) {
      const msg = `Purgecss is not enabled!${nuxt.options.dev ? ' Likely because you are in dev mode' : ''}`
      logger.info(msg)
      return
    }

    purgecssOptions.content = purgecssOptions.content?.map(p => isAbsolute(p as string) ? p : join(nuxt.options.srcDir, p as string))

    if (!nuxt.options.postcss.plugins || !Object.keys(nuxt.options.postcss.plugins).length) {
      nuxt.options.postcss.plugins = {}
    }

    nuxt.options.postcss.plugins['@fullhuman/postcss-purgecss'] = purgecssOptions
  }
})
