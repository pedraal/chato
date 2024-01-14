<script setup lang="ts">
import { marked } from 'marked'

interface Model {
  id: string
  label: string
}

const models: Model[] = [
  { id: 'gpt-3.5-turbo-1106', label: 'GPT-3.5 Turbo' },
  { id: 'gpt-4-1106-preview', label: 'GPT-4 Turbo' },
]

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

const openSettings = ref(false)

const apiKey = useLocalStorage<string>('gptApiKey', '')
const maxTokens = useLocalStorage<number>('maxTokens', 100)
const chats = useLocalStorage<Chat[]>('chats', [])
const sortedChats = computed(() => chats.value.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()))
const selectedChatId = useLocalStorage<string>('selectedChatId', '')
const selectedChat = computed(() => chats.value.find(chat => chat.id === selectedChatId.value))

function newChat() {
  const chat = {
    id: Date.now().toString(),
    name: 'New chat',
    model: models[0],
    messages: [],
    lastMessageAt: new Date(),
  }

  chats.value.push(chat)
  selectedChatId.value = chat.id
}

const showNameInput = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)
onClickOutside(nameInput, () => showNameInput.value = false)

function messageHtml(content: string) {
  return marked(content, {})
}

const newMessage = ref('')
const shiftState = useKeyModifier('Shift')
const sending = ref(false)

async function send(event: KeyboardEvent) {
  if (shiftState.value)
    return

  event.preventDefault()
  selectedChat.value!.messages.push({
    role: 'user',
    content: newMessage.value,
  })

  const decoder = new TextDecoder()

  fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: selectedChat.value!.messages, model: selectedChat.value!.model.id, maxTokens: maxTokens.value }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.value,
    },
  })
    .then((response) => {
      if (!response.ok || response.body == null)
        throw new Error('Network response was not ok')

      selectedChat.value!.lastMessageAt = new Date()
      selectedChat.value!.messages.push({
        role: 'assistant',
        content: '',
      })

      const reader = response.body.getReader()

      function read(): Promise<void> {
        return reader.read().then(({ done, value }) => {
          if (done) {
            newMessage.value = ''
            return
          }

          const decodedData = decoder.decode(value, { stream: true })
          const lastMessage = selectedChat.value!.messages[selectedChat.value!.messages.length - 1]
          lastMessage.content += decodedData
          return read()
        })
      }
      return read()
    })
    .catch((error) => {
      console.error(error)
      selectedChat.value!.messages.pop()
    }).finally(() => {
      sending.value = false
    })
}
</script>

<template>
  <div class="flex h-screen w-screen divide-x dark:divide-gray-600">
    <div class="w-full max-w-[16rem] p-2 flex flex-col gap-2">
      <p class="my-2 text-primary-500 font-bold">
        PedraalGPT
      </p>
      <div class="flex space-x-2">
        <UButton icon="i-heroicons-plus" class="grow" color="gray" @click="newChat">
          New chat
        </UButton>
        <UButton icon="i-heroicons-cog" color="gray" @click="openSettings = true" />
        <UModal v-model="openSettings">
          <div class="p-4">
            <form class="flex flex-col gap-4" @submit.prevent="openSettings = false">
              <UFormGroup label="API Key" name="apiKey">
                <UInput v-model="apiKey" />
              </UFormGroup>
              <UFormGroup label="Max Tokens" name="maxTokens">
                <UInput v-model="maxTokens" type="number" />
              </UFormGroup>
              <div class="text-right">
                <UButton type="submit">
                  Save
                </UButton>
              </div>
            </form>
          </div>
        </UModal>
      </div>
      <div v-for="chat in sortedChats" :key="chat.id" class="cursor-pointer group flex justify-between items-center">
        <div class="flex items-center gap-2" @click="selectedChatId = chat.id">
          <UIcon name="i-heroicons-chat-bubble-bottom-center" />
          <span class="flex-1">{{ chat.name }}</span>
        </div>
        <div class="invisible group-hover:visible">
          <UButton icon="i-heroicons-trash" variant="soft" color="red" @click="chats = chats.filter(c => c.id !== chat.id)" />
        </div>
      </div>
    </div>
    <div v-if="selectedChat" class="w-full max-h-screen flex flex-col divide-y dark:divide-gray-600">
      <div class="flex items-center justify-between p-2">
        <div>
          <span v-if="!showNameInput" class="cursor-pointer pl-2" @click="showNameInput = true">{{ selectedChat.name }}</span>
          <UInput v-if="showNameInput" ref="nameInput" v-model="selectedChat.name" @keydown.enter="showNameInput = false" />
        </div>
        <div class="w-48">
          <USelectMenu
            v-model="selectedChat.model"
            :options="models"
            placeholder="Select model"
            class="w-full"
            by="id"
          />
        </div>
      </div>
      <div class="grow p-4 overflow-y-scroll">
        <div v-for="(message, idx) in selectedChat.messages" :key="idx" class="flex gap-4 mb-4">
          <div>
            <UAvatar :icon="message.role === 'user' ? 'i-heroicons-user' : 'i-heroicons-cpu-chip'" size="sm" />
          </div>
          <div>
            <p class="font-bold mb-1.5 mt-1">
              {{ message.role === 'user' ? 'Me' : 'Assistant' }}
            </p>
            <div class="[&>pre]:border dark:[&>pre]:border-gray-600 [&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:my-2 [&>pre]:bg-gray-800" v-html="messageHtml(message.content)" />
          </div>
        </div>
      </div>
      <div class="p-2 flex">
        <UTextarea v-model="newMessage" class="w-full" autofocus :disabled="apiKey === '' || sending" :placeholder="apiKey === '' ? 'Open settings to add your OpenAI API key' : 'Ask something'" @keydown.enter="send" />
      </div>
    </div>
    <div v-else class="flex flex-col justify-center items-center w-full">
      <div class="text-center">
        <p class="mb-2">
          Create or select a chat to get started
        </p>
        <UButton color="gray" @click="newChat">
          New chat
        </UButton>
      </div>
    </div>
  </div>
</template>
