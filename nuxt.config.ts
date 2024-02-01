// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/mdc',
  ],
  content: {
    highlight: {
      theme: 'catppuccin-mocha',
    },
  },
})
