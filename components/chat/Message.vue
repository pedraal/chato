<script lang="ts" setup>
import { parseMarkdown } from '@nuxtjs/mdc/dist/runtime'
import type { Message } from '~/composables/useChats'

const props = defineProps<{
  message: Message
}>()
const { deleteMessage } = useChat()

const { data, refresh } = await useAsyncData(props.message.id, () => parseMarkdown(props.message.content))

watchThrottled(
  () => props.message.content,
  () => { refresh() },
  { throttle: 100 },
)
</script>

<template>
  <div class="flex gap-4 group mb-6">
    <div class="max-md:hidden">
      <UAvatar :icon="message.role === 'user' ? 'i-heroicons-user' : 'i-heroicons-cpu-chip'" size="sm" :ui="{ icon: { base: 'text-primary dark:text-primary' } }" />
    </div>
    <div>
      <p class="font-bold mb-1.5 mt-1">
        {{ message.role === 'user' ? 'Me' : 'Assistant' }}
        <a class="text-sm text-gray-500 hidden group-hover:inline cursor-pointer ml-2" @click="deleteMessage(message.id)">
          Delete
        </a>
      </p>
      <div v-if="message.role !== 'user'" class="max-w-3xl prose dark:prose-invert [&_*:first-child]:mt-0 [&_*:last-child]:mb-0">
        <MDCRenderer v-if="data" :body="data.body" :data="data.data" class="" />
      </div>
      <div v-else class="max-w-3xl">
        <pre class="w-full font-sans whitespace-pre-wrap">{{ message.content }}</pre>
      </div>
    </div>
  </div>
</template>
