import { useStorage } from '@vueuse/core'

export default function () {
  const showNav = useState('show-nav', () => false)

  const openModal = useState('open-settings-modal', () => false)

  const demoMode = useStorage('demoMode', false)

  const openAiSettings = useStorage<{ apiKey: string, maxTokens: number, temperature: number, seed?: number }>('openAiSettings', {
    apiKey: '',
    maxTokens: 100,
    temperature: 0.7,
    seed: undefined,
  })

  const mistralAiSettings = useStorage<{ apiKey: string, maxTokens: number, temperature: number, seed?: number }>('mistralAiSettings', {
    apiKey: '',
    maxTokens: 100,
    temperature: 0.7,
    seed: undefined,
  })

  return {
    showNav,
    openModal,
    openAiSettings,
    mistralAiSettings,
    demoMode,
  }
}
