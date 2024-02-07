<script setup lang="ts">
const { showNav } = useSettings()
const { models, activeChat } = useChats()

const { apiKey, input, send, sending, aiWriting } = useChat()

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

  if (import.meta.client)
    window.sessionStorage.setItem('mdc-shiki-highlighter', 'browser')
})

const { transcript, isBusy: transcriberIsBusy, progressItems: transcriberProgressItems, sendTranscriptionRequest } = useTranscriber()
const { audioData, setAudioFromRecording } = useRecording()

// const { audioData: sampleAudioData, downloadAudioFromUrl } = useSampleAudio()
// async function testWorker() {
//   await downloadAudioFromUrl('/sample_fr_2.mp3')
//   sendTranscriptionRequest(sampleAudioData.value.buffer)
// }

watch(audioData, (v) => {
  if (v.buffer)
    sendTranscriptionRequest(v.buffer)
})

watch(transcript, (v) => {
  if (!v?.text?.length)
    return

  input.value = v.text
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
      <ChatMessage v-for="message in activeChat.messages" :key="message.id" :message="message" />
    </div>
    <div v-if="transcriberProgressItems.length || transcriberIsBusy" class="p-2">
      <template v-if="transcriberProgressItems.length">
        <UProgress :value="transcriberProgressItems[0].progress" />
        <p class="text-primary">
          Loading model : {{ transcriberProgressItems[0].file }}
        </p>
      </template>
      <template v-else-if="transcriberIsBusy">
        <UProgress animation="carousel" />
        <p class="text-primary">
          Transcribing...
        </p>
      </template>
      <!-- <div v-else class="flex gap-2">
        <UButton @click="testWorker">
          Test transcribe
        </UButton>

        <audio class="w-full" controls>
          <source src="/sample_fr_2.mp3" type="audio/mp3">
        </audio>
      </div> -->
    </div>
    <div class="p-2 flex gap-2">
      <UTextarea v-model="input" class="w-full" autofocus :disabled="!apiKey || sending || transcriberIsBusy" :placeholder="!apiKey ? 'Open settings to add your API keys' : 'Ask something'" :ui="{ padding: { sm: 'pr-12' } }" @keydown.enter.exact.prevent="send" />
      <div class="flex flex-col gap-2">
        <UButton icon="i-heroicons-paper-airplane" @click="send" />
        <MicrophoneRecorder @recording-complete="setAudioFromRecording" />
      </div>
    </div>
  </div>
</template>
