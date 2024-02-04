<script setup lang="ts">
const { showNav } = useSettings()
const { mostRecentChatId } = useChats()

useHead({
  title: 'Chato AI',
  meta: [
    { name: 'description', content: 'A web application to interact with various LLMs through their APIs' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', media: '(prefers-color-scheme: light)' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon-dark.ico', media: '(prefers-color-scheme: dark)' },
  ],
})

onMounted(() => {
  if (mostRecentChatId.value)
    navigateTo(`/chats/${mostRecentChatId.value}`)
})
</script>

<template>
  <div class="flex h-screen divide-x dark:divide-gray-600">
    <Settings />
    <nav class="max-md:absolute z-10 transition-all w-full h-full md:w-64 p-2 flex flex-col gap-4 overflow-y-auto overflow-x-hidden max-md:bg-gray-50 max-md:dark:bg-gray-950" :class="[showNav ? 'right-0' : 'right-full']">
      <Menu />
    </nav>
    <main class="w-full md:w-[calc(100%-16rem)]">
      <NuxtPage />
    </main>
    <UNotifications />
  </div>
</template>
