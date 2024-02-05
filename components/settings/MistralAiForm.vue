<script lang="ts" setup>
import { apiKeyDisclaimer } from '~/data/constants'

const { mistralAiSettings } = useSettings()
</script>

<template>
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
