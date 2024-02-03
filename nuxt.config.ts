// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxtjs/mdc',
    '@nuxt/content',
  ],
  content: {
    highlight: {
      theme: 'catppuccin-mocha',
    },
    markdown: {
      mdc: false,
    },
  },
  runtimeConfig: {},
  nitro: {
    experimental: { asyncContext: true },
  },
})
