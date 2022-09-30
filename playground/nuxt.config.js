export default defineNuxtConfig({
  modules: ['nuxt-purgecss'],
  purgecss: {
    safelist: ['safe']
  }
})
