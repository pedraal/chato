interface Model {
  id: string
  label: string
  api: string
}

export interface Message {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface Chat {
  id: string
  name: string
  model: Model
  lastMessageAt: Date
  messages: Message[]
}

export default function () {
  const route = useRoute()

  const models: Model[] = [
    ...Object.entries(OPEN_AI_MODELS).map(([id, label]) => ({ id, label, api: 'openai' })),
    ...Object.entries(MISTRAL_AI_MODELS).map(([id, label]) => ({ id, label, api: 'mistralai' })),
  ]

  const chats = useLocalStorage<Chat[]>('chats', [])

  const sortedChats = computed(() => chats.value.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()))

  const activeChat = computed(() => {
    return getChat(route.params.chatId as string)
  })

  const mostRecentChatId = computed(() => {
    return sortedChats.value[0]?.id
  })

  function getChat(id: string) {
    return chats.value.find(chat => chat.id === id)
  }

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

  function removeChat(id: string) {
    const index = chats.value.findIndex(chat => chat.id === id)
    if (index !== -1)
      chats.value.splice(index, 1)

    if (route.params.chatId === id)
      navigateTo('/')
  }

  return {
    models,
    chats,
    sortedChats,
    mostRecentChatId,
    newChat,
    getChat,
    activeChat,
    removeChat,
  }
}
