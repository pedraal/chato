interface Model {
  id: string
  label: string
  api: string
}

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface Chat {
  id: string
  name: string
  model: Model
  messages: Message[]
  lastMessageAt: Date
}

export default function () {
  const models: Model[] = [
    { id: 'mistral-tiny', label: 'Mistral Tiny', api: 'mistralai' },
    { id: 'mistral-small', label: 'Mistral Small', api: 'mistralai' },
    { id: 'mistral-medium', label: 'Mistral Medium', api: 'mistralai' },
    { id: 'gpt-3.5-turbo-1106', label: 'GPT-3.5 Turbo', api: 'openai' },
    { id: 'gpt-4', label: 'GPT-4', api: 'openai' },
    { id: 'gpt-4-1106-preview', label: 'GPT-4 Turbo', api: 'openai' },
  ]

  const chats = useLocalStorage<Chat[]>('chats', [])
  const sortedChats = computed(() => chats.value.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()))

  function getChat(id: string) {
    return chats.value.find(chat => chat.id === id)
  }

  const route = useRoute()
  const activeChat = computed(() => {
    return getChat(route.params.chatId as string)
  })

  function newChat() {
    const chat = {
      id: Date.now().toString(),
      name: 'New chat',
      model: models[0],
      messages: [],
      lastMessageAt: new Date(),
    }

    chats.value.push(chat)
    navigateTo(`/chats/${chat.id}`)
  }

  return {
    models,
    chats,
    sortedChats,
    newChat,
    getChat,
    activeChat,
  }
}
