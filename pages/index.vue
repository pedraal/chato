<script setup lang="ts">
const { newChat } = useChats()
</script>

<template>
  <div class="grow flex flex-col justify-center items-center w-full h-full p-4">
    <UAlert title="Heads up!" description="This app is work in progress, expect bugs and unfinished features." icon="i-heroicons-exclamation-triangle" color="amber" variant="soft" />
    <div class="grow text-center max-w-lg w-full flex flex-col gap-3 justify-center">
      <p>
        Create or select a chat to get started
      </p>
      <div>
        <UButton icon="i-heroicons-plus" color="gray" @click="newChat">
          New chat
        </UButton>
      </div>
    </div>
  </div>
</template>
