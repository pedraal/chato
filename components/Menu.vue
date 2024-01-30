<script setup lang="ts">
const { openModal: openSettings, showNav } = useSettings()
const { newChat, sortedChats, chats } = useChats()
</script>

<template>
  <div class="flex justify-between">
    <NuxtLink to="/" class="my-2 text-primary-500 font-bold flex items-center gap-2">
      <UIcon name="i-game-icons-castle" class="shrink-0 scale-150 ml-2" dynamic />
      Chato
    </NuxtLink>
    <UButton icon="i-heroicons-x-mark" color="gray" class="md:hidden" variant="link" @click="showNav = false" />
  </div>
  <div class="flex gap-2">
    <UButton icon="i-heroicons-plus" class="grow" color="gray" @click="newChat">
      New chat
    </UButton>
    <UButton icon="i-heroicons-cog" color="gray" @click="openSettings = true" />
  </div>
  <div v-for="chat in sortedChats" :key="chat.id" class="group flex items-center">
    <NuxtLink :to="`/chats/${chat.id}`" class="flex items-center gap-2 max-w-full md:max-w-52 grow pr-2" active-class="text-primary-500">
      <UIcon name="i-heroicons-chat-bubble-bottom-center" class="shrink-0" />
      <span class="truncate">{{ chat.name }}</span>
    </NuxtLink>
    <div class="invisible group-hover:visible">
      <UButton icon="i-heroicons-trash" variant="soft" color="red" @click="chats = chats.filter(c => c.id !== chat.id)" />
    </div>
  </div>
</template>
