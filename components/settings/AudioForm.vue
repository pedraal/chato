<script lang="ts" setup>
const { transcriberSettings } = useSettings()

const { audioInputs: microphones } = useDevicesList(
  {
    requestPermissions: true,
    constraints: { audio: true },
  },
)

const microphoneAccess = usePermission('microphone')
const microphoneAccessGranted = computed(() => microphoneAccess.value === 'granted')

watch(microphones, () => {
  if (transcriberSettings.value.microphoneId === '')
    transcriberSettings.value.microphoneId = microphones.value[0]?.deviceId || ''
})

function modelEntryToString(entry: [string, number[]]) {
  const [code, weight] = entry
  let weightString: string
  if (weight.length === 2)
    weightString = transcriberSettings.value.quantized ? `${weight[0]}` : `${weight[1]}`
  else
    weightString = `${weight[0]}`

  return `${code.replace('Xenova/', '')} (${weightString}MB)`
}

const languages = Object.entries(TRANSCRIBER_LANGUAGES).map(([code, name]) => ({ code, name }))
const models = computed(() => {
  return Object.entries(TRANSCRIBER_MODELS)
    .filter(([_, weight]) => transcriberSettings.value.quantized ? 1 : weight.length === 2)
    .map(([code, weight]) => {
      return {
        code,
        name: modelEntryToString([code, weight]),
      }
    })
})
const subtasks = Object.entries(TRANSCRIBER_SUBTASKS).map(([code, name]) => ({ code, name }))

watch(() => transcriberSettings.value.quantized, () => {
  if (!models.value.find(m => m.code === transcriberSettings.value.model))
    transcriberSettings.value.model = models.value[0].code
})
</script>

<template>
  <UBadge class="justify-center mt-2">
    Experimental
  </UBadge>
  <span class="text-sm text-gray-400 dark:text-gray-500">Settings for using audio transcription to chat with LLMs using Openai Whisper Speech to Text model locally.</span>
  <UFormGroup label="Microphone" name="microphone">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <UToggle disabled :model-value="microphoneAccessGranted" />
        <span>Access {{ microphoneAccessGranted ? 'granted' : 'required' }}</span>
      </div>
    </div>
    <USelectMenu v-model="transcriberSettings.microphoneId" :options="microphones" value-attribute="deviceId" option-attribute="label" class="grow mt-2" />
  </UFormGroup>
  <UFormGroup label="Transcribe language" name="transcribeLanguage">
    <USelectMenu v-model="transcriberSettings.language" :options="languages" value-attribute="code" option-attribute="name" :ui="{ height: 'max-h-48' }" />
  </UFormGroup>
  <UFormGroup label="Quantized model" name="transcribeQuantized" hint="Recommended">
    <div class="flex items-center gap-2">
      <UToggle v-model="transcriberSettings.quantized" />
      <span class="text-gray-400 dark:text-gray-500 text-sm">Optimize the model for CPU-based inference. Also enables using larger models.</span>
    </div>
  </UFormGroup>
  <UFormGroup label="Transcribe model" name="transcribeModel">
    <USelectMenu v-model="transcriberSettings.model" :options="models" value-attribute="code" option-attribute="name" />
  </UFormGroup>
  <UFormGroup label="Task" name="transcribeTask">
    <USelectMenu v-model="transcriberSettings.subtask" :options="subtasks" value-attribute="code" option-attribute="name" />
  </UFormGroup>
</template>
