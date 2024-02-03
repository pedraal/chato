// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@vueuse/nuxt',
    '@nuxt/ui',
    '@nuxtjs/mdc',
  ],
  mdc: {
    highlight: {
      theme: 'catppuccin-mocha',
      preload: [
        'json',
        'yaml',
        'toml',
        'jsx',
        'tsx',
        'ruby',
        'python',
        'java',
        'php',
        'shell',
        'bash',
        'sql',
        'graphql',
        'markdown',
      ],
    },
    remarkPlugins: {
      'remark-mdc': {
        options: {
          experimental: {
            autoUnwrap: true,
          },
        },
      },
    },
  },
  runtimeConfig: {},
  nitro: {
    experimental: { asyncContext: true },
  },
})
