<script lang="ts" setup>
const { openModal, openAiApiKey, mistralApiKey, maxTokens } = useSettings()
const colorMode = useColorMode()
const colorOptions = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const openAiInputType = ref<'text' | 'password'>('password')
const mistralInputType = ref<'text' | 'password'>('password')
</script>

<template>
  <UModal v-model="openModal">
    <div class="p-4">
      <form class="flex flex-col gap-4" @submit.prevent="openModal = false">
        <UFormGroup label="MistralAI API Key" name="mistralApiKey">
          <UInput v-model="mistralApiKey" :type="mistralInputType" />
          <UButton icon="i-heroicons-eye" variant="link" color="gray" class="absolute right-2 top-0" @click="mistralInputType = mistralInputType === 'password' ? 'text' : 'password'" />
        </UFormGroup>
        <UFormGroup label="OpenAI API Key" name="openAiApiKey">
          <UInput v-model="openAiApiKey" :type="openAiInputType" />
          <UButton icon="i-heroicons-eye" variant="link" color="gray" class="absolute right-2 top-0" @click="openAiInputType = openAiInputType === 'password' ? 'text' : 'password'" />
        </UFormGroup>
        <UFormGroup label="GPT Max Tokens" name="maxTokens">
          <UInput v-model="maxTokens" type="number" />
        </UFormGroup>
        <UFormGroup label="Theme" name="theme">
          <USelectMenu v-model="colorMode.preference" :options="colorOptions" value-attribute="value" option-attribute="label" />
        </UFormGroup>
        <div class="text-right">
          <UButton type="submit">
            Save
          </UButton>
        </div>
      </form>
    </div>
  </UModal>
</template>
