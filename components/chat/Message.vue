<script lang="ts" setup>
import { parseMarkdown } from '@nuxtjs/mdc/dist/runtime'
import type { Message } from '~/composables/useChat'

const props = defineProps<{
  message: Message
}>()
const { deleteMessage } = useChat()

const { data, refresh } = await useAsyncData(props.message.id, () => parseMarkdown(props.message.content))

watchThrottled(
  () => props.message.content,
  () => { refresh() },
  { throttle: 200 },
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
      <MDCRenderer v-if="data" :body="data.body" :data="data.data" class="prose dark:prose-invert max-w-2xl" />
    </div>
  </div>
</template>
