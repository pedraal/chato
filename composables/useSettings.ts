export default function () {
  const openModal = useState('open-settings-modal', () => false)
  const openAiApiKey = useLocalStorage<string>('openAiApiKey', '')
  const mistralApiKey = useLocalStorage<string>('mistralApiKey', '')
  const maxTokens = useLocalStorage<number>('maxTokens', 100)
  const showNav = useState('show-nav', () => false)

  return {
    openModal,
    openAiApiKey,
    mistralApiKey,
    maxTokens,
    showNav,
  }
}
