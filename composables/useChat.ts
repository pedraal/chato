import { useStorage } from '@vueuse/core'

export interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
}

export default function () {
  const { openAiSettings, mistralAiSettings, debugApiMode } = useSettings()
  const { activeChat } = useChats()

  const settings = computed(() => {
    if (activeChat.value?.model.api === 'openai')
      return openAiSettings.value
    else if (activeChat.value?.model.api === 'mistralai')
      return mistralAiSettings.value

    return undefined
  })

  const apiKey = computed(() => {
    return settings.value?.apiKey
  })

  const chatMessages = useStorage(`${activeChat.value?.id}-messages`, [], localStorage)

  const input = ref('')
  const sending = ref(false)
  const aiWriting = createEventHook()
  async function send() {
    const _chat = activeChat.value
    const _settings = unref({ ...settings.value })
    const _apiKey = _settings.apiKey
    delete _settings.apiKey

    if (!_chat || !_settings || !_apiKey || sending.value || !input.value)
      return

    chatMessages.value.push({
      id: Date.now().toString(),
      role: 'user',
      content: input.value,
    })
    input.value = ''
    _chat.lastMessageAt = new Date()

    const decoder = new TextDecoder()
    fetch(`/api/${_chat.model.api}`, {
      method: 'POST',
      body: JSON.stringify({ ..._settings, messages: chatMessages.value, model: _chat.model.id, debug: debugApiMode.value }),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': _apiKey,
      },
    })
      .then((response) => {
        if (!response.ok || response.body == null)
          throw new Error('Network response was not ok')

        const id = Date.now().toString()
        _chat.lastMessageAt = new Date()
        chatMessages.value.push({
          id,
          role: 'assistant',
          content: '',
        })

        const reader = response.body.getReader()
        const lastMessage = chatMessages.value.find(message => message.id === id)

        async function read(): Promise<void> {
          const { done, value } = await reader.read()
          if (done)
            return

          aiWriting.trigger()
          const decodedData = decoder.decode(value, { stream: true })
          lastMessage.content += decodedData

          return await read()
        }
        return read()
      })
      .catch((error) => {
        console.error(error)
        chatMessages.value.pop()
      }).finally(() => {
        sending.value = false
      })
  }

  function deleteMessage(id: string) {
    const chat = activeChat.value
    if (!chat)
      return

    const index = chatMessages.value.findIndex(message => message.id === id)
    chatMessages.value.splice(index, 1)
  }

  return {
    apiKey,
    input,
    sending,
    send,
    aiWriting,
    chatMessages,
    deleteMessage,
  }
}
