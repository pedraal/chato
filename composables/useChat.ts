export default function () {
  const { openAiApiKey, maxTokens, mistralApiKey } = useSettings()
  const { activeChat } = useChats()

  const apiKey = computed(() => {
    if (activeChat.value?.model.api === 'openai')
      return openAiApiKey.value
    else if (activeChat.value?.model.api === 'mistralai')
      return mistralApiKey.value

    return undefined
  })

  const input = ref('')
  const sending = ref(false)
  const aiWriting = createEventHook()
  async function send() {
    const chat = activeChat.value
    if (!chat)
      return

    chat.messages.push({
      role: 'user',
      content: input.value,
    })
    input.value = ''

    const decoder = new TextDecoder()
    fetch(`/api/${chat.model.api}`, {
      method: 'POST',
      body: JSON.stringify({ messages: chat.messages, model: chat.model.id, maxTokens: maxTokens.value }),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.value,
      },
    })
      .then((response) => {
        if (!response.ok || response.body == null)
          throw new Error('Network response was not ok')

        chat.lastMessageAt = new Date()
        chat.messages.push({
          role: 'assistant',
          content: '',
        })

        const reader = response.body.getReader()

        function read(): Promise<void> {
          return reader.read().then(({ done, value }) => {
            if (done)
              return

            aiWriting.trigger()
            const decodedData = decoder.decode(value, { stream: true })
            const lastMessage = chat!.messages[chat!.messages.length - 1]
            lastMessage.content += decodedData
            return read()
          })
        }
        return read()
      })
      .catch((error) => {
        console.error(error)
        chat.messages.pop()
      }).finally(() => {
        sending.value = false
      })
  }

  function deleteMessage(index: number) {
    const chat = activeChat.value
    if (!chat)
      return

    chat.messages.splice(index, 1)
  }

  return {
    apiKey,
    input,
    sending,
    send,
    aiWriting,
    deleteMessage,
  }
}
