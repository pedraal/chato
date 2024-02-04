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

const languageIcon = computed(() => {
  switch (props.language) {
    case 'json':
      return 'i-mdi-code-json'
    case 'yaml':
      return 'i-simple-icons-yaml'
    case 'toml':
      return 'i-simple-icons-toml'
    case 'jsx':
      return 'i-mdi-language-jsx'
    case 'tsx':
      return 'i-file-icons-tsx-alt'
    case 'ruby':
      return 'i-mdi-language-ruby'
    case 'python':
      return 'i-mdi-language-python'
    case 'java':
      return 'i-fa6-brands-java'
    case 'php':
      return 'i-mdi-language-php'
    case 'shell':
      return 'i-material-symbols-terminal'
    case 'bash':
      return 'i-material-symbols-terminal'
    case 'sql':
      return 'i-carbon-sql'
    case 'graphql':
      return 'i-mdi-graphql'
    case 'markdown':
      return 'i-tabler-markdown'
    case 'plaintext':
      return 'i-heroicons-document'
    case 'html':
      return 'i-mdi-language-html5'
    case 'css':
      return 'i-mdi-language-css3'
    case 'scss':
      return 'i-mdi-language-scss'
    case 'javascript':
      return 'i-mdi-language-javascript'
    case 'typescript':
      return 'i-mdi-language-typescript'
    default:
      return 'i-tabler-braces'
  }
})

const toast = useToast()
watch(copied, (v) => {
  if (v)
    toast.add({ title: '', description: 'Code copied to the clipboard 👍', timeout: 1500 })
})
</script>

<template>
  <div>
    <div class="bg-gray-900 flex gap-4 items-center justify-between rounded-t-lg py-2 px-4">
      <div class="flex items-center gap-2 text-primary">
        <UIcon :name="languageIcon" class="w-4" dynamic />
        <span class="font-semibold">{{ language }}</span>
      </div>
      <UButton v-if="isSupported" icon="i-heroicons-clipboard-document-list" variant="outline" @click="copy(code)" />
    </div>
    <pre :class="$props.class" class="bg-gray-800 rounded-t-none rounded-b-lg mt-0"><slot /></pre>
  </div>
</template>
