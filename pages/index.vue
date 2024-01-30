<script setup lang="ts">
const { newChat } = useChats()
</script>

<template>
  <div class="grow flex flex-col justify-center items-center w-full h-full">
    <div class="text-center">
      <p class="mb-2">
        Create or select a chat to get started
      </p>
      <UButton color="gray" @click="newChat">
        New chat
      </UButton>
    </div>
  </div>
</template>
