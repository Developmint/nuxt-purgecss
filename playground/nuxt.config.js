export default defineNuxtConfig({
  head: {
    bodyAttrs: {
      class: 'nuxt-config-class'
    }
  },
  css: [
    '~/assets/test.css'
  ],
  modules: ['nuxt-purgecss'],
  purgecss: {
    safelist: ['safe']
  }
})
