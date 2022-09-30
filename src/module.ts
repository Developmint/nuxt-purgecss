
import { defineNuxtModule } from '@nuxt/kit'
import { DEFAULTS, ModuleOptions } from './config'

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-purgecss',
    configKey: 'purgecss',
    compatibility: {
      nuxt: '^3.0.0-rc.11'
    }
  },
  defaults: DEFAULTS,
  async setup (_options, _nuxt) {
    // TODO
  }
})
