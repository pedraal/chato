import { useStorage } from '@vueuse/core'

interface Model {
  id: string
  label: string
  api: string
}

interface Chat {
  id: string
  name: string
  model: Model
  lastMessageAt: Date
}

export default function () {
  const route = useRoute()

  const models: Model[] = [
    { id: 'mistral-tiny', label: 'Mistral Tiny', api: 'mistralai' },
    { id: 'mistral-small', label: 'Mistral Small', api: 'mistralai' },
    { id: 'mistral-medium', label: 'Mistral Medium', api: 'mistralai' },
    { id: 'gpt-3.5-turbo-1106', label: 'GPT-3.5 Turbo', api: 'openai' },
    { id: 'gpt-4', label: 'GPT-4', api: 'openai' },
    { id: 'gpt-4-1106-preview', label: 'GPT-4 Turbo', api: 'openai' },
  ]

  const chats = useStorage<Chat[]>('chats', [], localStorage)

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
