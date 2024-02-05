<script lang="ts" setup>
import { apiKeyDisclaimer } from '~/data/constants'

const { openAiSettings } = useSettings()
</script>

<template>
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
