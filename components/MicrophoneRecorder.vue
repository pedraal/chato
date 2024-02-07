<!--
  const { selectedMicrophone } = useSettings()

  useDevicesList({
    requestPermissions: true,
    constraints: {
      audio: true,
    },
  })

  const { stream, start, stop, enabled } = useUserMedia({
    constraints: {
      audio: { deviceId: selectedMicrophone.value },
    },
  })

  const recorder = ref<MediaRecorder | null>(null)
  // const audioBlob = ref<Blob | null>(null)

  function toggleRecording() {
    if (enabled.value) { stop() }
    else {
      start()
      recorder.value = new MediaRecorder(stream.value)
    }
  }
 -->

<script setup lang="ts">
const emit = defineEmits<{
  recordingComplete: [blob: Blob]
}>()

function getMimeType() {
  const types = [
    'audio/webm',
    'audio/mp4',
    'audio/ogg',
    'audio/wav',
    'audio/aac',
  ]
  for (let i = 0; i < types.length; i++) {
    if (MediaRecorder.isTypeSupported(types[i]))
      return types[i]
  }
  return undefined
}

const duration = ref(0)
const mediaRecorder = ref<MediaRecorder | null>(null)
const chunksRef = ref([])

const { transcriberSettings } = useSettings()
const { stream, start, stop, enabled: recording } = useUserMedia({
  constraints: {
    audio: { deviceId: transcriberSettings.value.microphoneId },
  },
})

async function startRecording() {
  const startTime = Date.now()

  try {
    const mimeType = getMimeType()
    await start()
    mediaRecorder.value = new MediaRecorder(stream.value, { mimeType })
    mediaRecorder.value.start()

    mediaRecorder.value.ondataavailable = async (event) => {
      if (event.data.size > 0)
        chunksRef.value.push(event.data)

      if (mediaRecorder.value.state === 'inactive') {
        const duration = Date.now() - startTime
        let blob = new Blob(chunksRef.value, { type: mimeType })

        if (mimeType === 'audio/webm')
          blob = await webmFixDuration(blob, duration, blob.type)

        emit('recordingComplete', blob)
        chunksRef.value = []
      }
    }
  }
  catch (error) {
    console.error('Error accessing microphone:', error)
  }
}

function stopRecording() {
  if (mediaRecorder.value?.state === 'recording') {
    mediaRecorder.value.stop()
    stop()
    duration.value = 0
    recording.value = false
  }
}

watch(recording, (newVal) => {
  if (newVal) {
    const timer = setInterval(() => {
      duration.value += 1
    }, 1000)

    onBeforeUnmount(() => {
      clearInterval(timer)
    })
  }
})

function handleToggleRecording() {
  if (recording.value)
    stopRecording()
  else
    startRecording()
}
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <UButton :color="recording ? 'red' : 'primary'" :class="[{ recording: 'animate-pulse' }]" icon="i-heroicons-microphone" @click="handleToggleRecording" />
    <!-- <audio v-if="recordedBlob" class="w-full" controls>
      <source :src="audioSrc" :type="recordedBlob?.type">
    </audio> -->
  </div>
</template>
