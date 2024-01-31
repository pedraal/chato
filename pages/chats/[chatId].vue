<script setup lang="ts">
const { showNav } = useSettings()
const { parseMarkdown } = useMarkdown()
const { models, activeChat } = useChats()

const { apiKey, input, send, sending, aiWriting, deleteMessage } = useChat()

const showNameInput = ref(false)
const nameInput = ref<HTMLInputElement | null>(null)
onClickOutside(nameInput, () => showNameInput.value = false)

const messagesContainer = ref<HTMLDivElement | null>(null)
aiWriting.on(() => {
  if (messagesContainer.value)
    messagesContainer.value.scrollTo({ top: messagesContainer.value.scrollHeight })
})

onMounted(() => {
  if (activeChat.value)
    showNav.value = false

  messagesContainer.value?.scrollTo({ top: messagesContainer.value.scrollHeight })
})
</script>

<template>
  <div v-if="activeChat" class="h-full flex flex-col divide-y dark:divide-gray-600">
    <div class="flex items-center p-2 gap-2">
      <UButton icon="i-heroicons-bars-3" color="gray" class="md:hidden" variant="link" @click="showNav = true" />
      <h1 v-if="!showNameInput" class="cursor-pointer truncate px-2 grow" @click="showNameInput = true">
        {{ activeChat.name }}
      </h1>
      <UInput v-if="showNameInput" ref="nameInput" v-model="activeChat.name" class="grow" autofocus @keydown.enter="showNameInput = false" />
      <div class="min-w-48">
        <USelectMenu
          v-model="activeChat.model"
          :options="models"
          placeholder="Select model"
          class="w-full"
          by="id"
        />
      </div>
    </div>
    <div ref="messagesContainer" class="grow p-4 overflow-y-auto">
      <div v-for="(message, idx) in activeChat.messages" :key="idx" class="flex gap-4 prose dark:prose-invert group">
        <div class="max-md:hidden">
          <UAvatar :icon="message.role === 'user' ? 'i-heroicons-user' : 'i-heroicons-cpu-chip'" size="sm" />
        </div>
        <div>
          <p class="font-bold mb-1.5 mt-1">
            {{ message.role === 'user' ? 'Me' : 'Assistant' }}
            <a class="text-sm text-gray-500 hidden group-hover:inline cursor-pointer ml-2" @click="deleteMessage(idx)">
              Delete
            </a>
          </p>
          <div class="[&>pre]:overflow-x-auto [&>pre]:border dark:[&>pre]:border-gray-600 [&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:my-2 [&>pre]:bg-gray-800 [&>p]:mt-0" v-html="parseMarkdown(message.content)" />
        </div>
      </div>
    </div>
    <div class="p-2">
      <UTextarea v-model="input" class="w-full" autofocus :disabled="!apiKey || sending" :placeholder="!apiKey ? 'Open settings to add your API keys' : 'Ask something'" @keydown.enter.exact.prevent="send" />
    </div>
  </div>
</template>
