export default function () {
  const { openAiApiKey, maxTokens, mistralApiKey } = useSettings()

  const { activeChat } = useChats()

  const shiftState = useKeyModifier('Shift')
  const newMessage = ref('')
  const sending = ref(false)
  const aiWriting = createEventHook()
  async function send(event: KeyboardEvent) {
    const chat = activeChat.value
    if (!chat)
      return

    if (shiftState.value)
      return

    event.preventDefault()
    chat.messages.push({
      role: 'user',
      content: newMessage.value,
    })

    let apiKey: string
    switch (chat.model.api) {
      case 'openai':
        apiKey = openAiApiKey.value
        break
      case 'mistral':
        apiKey = mistralApiKey.value
        break
      default:
        throw new Error(`Unknown API: ${chat.model.api}`)
    }

    const decoder = new TextDecoder()
    fetch(`/api/${chat.model.api}`, {
      method: 'POST',
      body: JSON.stringify({ messages: chat.messages, model: chat.model.id, maxTokens: maxTokens.value }),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    })
      .then((response) => {
        if (!response.ok || response.body == null)
          throw new Error('Network response was not ok')

        newMessage.value = ''
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
    newMessage,
    sending,
    send,
    aiWriting,
    deleteMessage,
  }
}
