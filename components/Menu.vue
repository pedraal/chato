<script setup lang="ts">
const { openModal: openSettings, showNav } = useSettings()
const { newChat, sortedChats, removeChat } = useChats()
</script>

<template>
  <div class="flex justify-between">
    <NuxtLink to="/" class="text-primary font-bold flex items-center gap-2">
      <UIcon name="i-game-icons-castle" class="shrink-0 scale-150 ml-2" dynamic />
      Chato AI
    </NuxtLink>
    <UButton icon="i-heroicons-x-mark" color="gray" class="md:hidden" variant="link" @click="showNav = false" />
  </div>
  <div class="flex gap-2">
    <UButton icon="i-heroicons-plus" class="grow" color="gray" @click="newChat">
      New chat
    </UButton>
    <UButton icon="i-heroicons-cog" color="gray" @click="openSettings = true" />
  </div>
  <div>
    <NuxtLink v-for="chat in sortedChats" :key="chat.id" :to="`/chats/${chat.id}`" class="flex items-center gap-2 grow px-2 py-1 my-2 group rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" active-class="bg-gray-50 dark:bg-gray-800 ring-2 ring-primary">
      <UIcon name="i-heroicons-chat-bubble-bottom-center" class="shrink-0" />
      <span class="truncate grow">{{ chat.name }}</span>
      <div class="invisible group-hover:visible">
        <UButton icon="i-heroicons-trash" color="red" variant="ghost" @click.prevent="removeChat(chat.id)" />
      </div>
    </NuxtLink>
  </div>
</template>
