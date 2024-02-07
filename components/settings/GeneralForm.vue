<script lang="ts" setup>
const { demoMode } = useSettings()
const colorMode = useColorMode()
const colorOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]
</script>

<template>
  <UFormGroup label="Theme" name="theme">
    <div class="flex gap-2">
      <USelectMenu v-model="colorMode.preference" :options="colorOptions" value-attribute="value" option-attribute="label" class="grow" />
      <ColorPicker />
    </div>
  </UFormGroup>
  <UFormGroup label="Demo Mode" name="demoMode">
    <div class="flex items-center gap-2">
      <UToggle v-model="demoMode" />
      <span class="text-sm" :class="{ 'text-gray-400 dark:text-gray-500': !demoMode }">Replace third-party API calls by a mocked stream. Don't forget to add API keys to use reel LLMs.</span>
    </div>
  </UFormGroup>
</template>
