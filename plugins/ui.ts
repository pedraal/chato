import colors from '#tailwind-config/theme/colors'

function hexToRgb(hex: string) {
  hex = hex.replace('#', '')
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  return `rgb(${r}, ${g}, ${b})`
}

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()

    const root = computed(() => {
      const primary: Record<string, string> | undefined = colors[appConfig.ui.primary]
      const gray: Record<string, string> | undefined = colors[appConfig.ui.gray]

      return `:root {
        ${Object.entries(primary || colors.green).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join('\n')}
        --color-primary-DEFAULT: var(--color-primary-500);

        ${Object.entries(gray || colors.cool).map(([key, value]) => `--color-gray-${key}: ${hexToRgb(value)};`).join('\n')}
        }

        .dark {
          --color-primary-DEFAULT: var(--color-primary-400);
        }
        `
    })

    if (import.meta.client) {
      watch(root, () => {
        window.localStorage.setItem('nuxt-ui-root', root.value)
      })

      appConfig.ui.primary = window.localStorage.getItem('nuxt-ui-primary') || appConfig.ui.primary
      appConfig.ui.gray = window.localStorage.getItem('nuxt-ui-gray') || appConfig.ui.gray
    }
    if (import.meta.server) {
      useHead({
        script: [
          {
            innerHTML: `
                if (localStorage.getItem('nuxt-ui-root')) {
                  document.querySelector('style#nuxt-ui-colors').innerHTML = localStorage.getItem('nuxt-ui-root')
                }`.replace(/\s+/g, ' '),
            type: 'text/javascript',
            tagPriority: -1,
          },
        ],
      })
    }
  },
})
