<script lang="ts" setup>
const { openModal } = useSettings()

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
</script>

<template>
  <UModal v-model="openModal">
    <div class="p-4">
      <UTabs v-model="selected" :items="items" />

      <form class="flex flex-col gap-4" @submit.prevent="openModal = false">
        <template v-if="selected === 0">
          <SettingsGlobalForm />
        </template>
        <template v-else-if="selected === 1">
          <SettingsOpenAiForm />
        </template>
        <template v-else-if="selected === 2">
          <SettingsMistralAiForm />
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
