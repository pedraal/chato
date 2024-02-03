<script lang="ts" setup>
const { openModal, openAiSettings, mistralAiSettings, demoMode } = useSettings()
const colorMode = useColorMode()
const colorOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const items = [
  { label: 'General' },
  { label: 'OpenAI' },
  { label: 'MistralAI' },
]

const selected = ref(0)

watch(openModal, (v) => {
  if (v)
    selected.value = 0
})

const apiKeyDisclaimer = 'Your API key will be exclusively saved in your browser storage. Hovewer it is sent to this app server to make calls to LLMs API. It won\'t be logged anywhere neither.'
</script>

<template>
  <UModal v-model="openModal">
    <div class="p-4">
      <UTabs v-model="selected" :items="items" />

      <form class="flex flex-col gap-4" @submit.prevent="openModal = false">
        <template v-if="selected === 0">
          <UFormGroup label="Theme" name="theme">
            <div class="flex gap-2">
              <USelectMenu v-model="colorMode.preference" :options="colorOptions" value-attribute="value" option-attribute="label" class="grow" />
              <ColorPicker />
            </div>
          </UFormGroup>
          <UFormGroup label="Demo Mode" name="demoMode">
            <div class="flex items-center gap-2">
              <UToggle v-model="demoMode" />
              <span class="text-sm" :class="{ 'text-gray-400 dark:text-gray-500': !demoMode }">Replace third-party API calls by a mocked stream.</span>
            </div>
          </UFormGroup>
        </template>
        <template v-else-if="selected === 1">
          <UFormGroup label="API Key" name="openAiApiKey">
            <SettingsApiKeyInput v-model="openAiSettings.apiKey" />
            <span class="text-sm text-gray-400 dark:text-gray-500">{{ apiKeyDisclaimer }}</span>
          </UFormGroup>
          <UFormGroup label="Chat temperature" name="openAiApiKey">
            <div class="flex items-center gap-2">
              <URange v-model="openAiSettings.temperature" :min="0" :max="1" :step="0.1" />
              <UBadge class="w-9 justify-center">
                {{ openAiSettings.temperature }}
              </UBadge>
            </div>
          </UFormGroup>
          <UFormGroup label="Chat max tokens" name="openAiApiKey">
            <UInput v-model="openAiSettings.maxTokens" type="number" />
          </UFormGroup>
          <UFormGroup label="Chat determinism seed" name="openAiApiKey">
            <SettingsLockedRandomNumberInput v-model="openAiSettings.seed" />
            <p class="text-xs text-gray-400 dark:text-gray-500">
              Leave empty to disable determinism.
            </p>
          </UFormGroup>
        </template>
        <template v-else-if="selected === 2">
          <UFormGroup label="API Key" name="mistralAiApiKey">
            <SettingsApiKeyInput v-model="mistralAiSettings.apiKey" />
            <span class="text-sm text-gray-400 dark:text-gray-500">{{ apiKeyDisclaimer }}</span>
          </UFormGroup>
          <UFormGroup label="Chat temperature" name="mistralAiApiKey">
            <div class="flex items-center gap-2">
              <URange v-model="mistralAiSettings.temperature" :min="0" :max="1" :step="0.1" />
              <UBadge class="w-9 justify-center">
                {{ mistralAiSettings.temperature }}
              </UBadge>
            </div>
          </UFormGroup>
          <UFormGroup label="Chat max tokens" name="mistralAiApiKey">
            <UInput v-model="mistralAiSettings.maxTokens" type="number" />
          </UFormGroup>
          <UFormGroup label="Chat determinism seed" name="openAiApiKey">
            <SettingsLockedRandomNumberInput v-model="mistralAiSettings.seed" />
            <p class="text-xs text-gray-400 dark:text-gray-500">
              Leave empty to disable determinism.
            </p>
          </UFormGroup>
        </template>
        <div class="text-right">
          <UButton type="submit" color="gray">
            Close
          </UButton>
        </div>
      </form>
    </div>
  </UModal>
</template>
