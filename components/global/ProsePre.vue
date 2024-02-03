<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
})

const { copy, copied, isSupported } = useClipboard({ source: props.code })

const toast = useToast()
watch(copied, (v) => {
  if (v)
    toast.add({ description: 'Code copied in the clipboard 👍', timeout: 1000 })
})
</script>

<template>
  <div class="relative">
    <UButton v-if="isSupported" icon="i-heroicons-clipboard-document-list" class="absolute top-2 right-2" variant="outline" @click="copy(code)" />
    <pre :class="$props.class" class="bg-gray-800"><slot /></pre>
  </div>
</template>
