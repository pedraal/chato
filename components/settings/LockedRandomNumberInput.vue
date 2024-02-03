<script setup lang="ts">
defineProps<{
  modelValue: number | undefined
}>()

defineEmits(['update:modelValue'])

function randomInt() {
  return Math.floor(Math.random() * 10000)
}
</script>

<template>
  <div class="flex gap-2">
    <UInput :value="modelValue" type="number" :disabled="true" class="w-full" />
    <UButton icon="i-heroicons-arrow-path" @click="$emit('update:modelValue', randomInt())" />
    <UButton icon="i-heroicons-x-mark" color="gray" @click="$emit('update:modelValue', undefined)" />
  </div>
</template>
