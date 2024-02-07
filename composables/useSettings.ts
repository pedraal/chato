export default function () {
  const showNav = useState('show-nav', () => false)

  const openModal = useState('open-settings-modal', () => false)

  const demoMode = useLocalStorage('demoMode', false)

  const openAiSettings = useLocalStorage<{ apiKey: string, maxTokens: number, temperature: number, seed?: number }>('openAiSettings', {
    apiKey: '',
    maxTokens: 100,
    temperature: 0.7,
    seed: undefined,
  })

  const mistralAiSettings = useLocalStorage<{ apiKey: string, maxTokens: number, temperature: number, seed?: number }>('mistralAiSettings', {
    apiKey: '',
    maxTokens: 100,
    temperature: 0.7,
    seed: undefined,
  })

  const transcriberSettings = useLocalStorage<{ microphoneId: string, model: string, language: string, quantized: boolean, subtask: string }>('transcribeSettings', {
    microphoneId: '',
    model: Object.keys(TRANSCRIBER_MODELS)[0],
    language: 'en',
    quantized: true,
    subtask: 'transcribe',
  })

  return {
    showNav,
    openModal,
    openAiSettings,
    mistralAiSettings,
    demoMode,
    transcriberSettings,
  }
}
