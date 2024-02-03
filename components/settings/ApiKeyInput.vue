<script setup lang="ts">
defineProps({
  modelValue: String,
})

defineEmits(['update:modelValue'])

const inputType = ref<'text' | 'password'>('password')
</script>

<template>
  <UInput
    :value="modelValue"
    :type="inputType"
    @input="$emit('update:modelValue', $event.target.value)"
  />
  <UButton icon="i-heroicons-eye" variant="link" color="gray" class="absolute right-2 top-0" @click="inputType = inputType === 'password' ? 'text' : 'password'" />
</template>
