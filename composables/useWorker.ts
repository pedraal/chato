interface MessageEventHandler {
  (event: MessageEvent): void
}

export default function (handler: MessageEventHandler) {
  const worker = ref<Worker | null>(null)

  onMounted(() => {
    worker.value = createWorker(handler)
  })

  function createWorker(messageEventHandler: MessageEventHandler): Worker {
    const worker = new Worker(new URL('../assets/ai_worker.js', import.meta.url), {
      type: 'module',
    })
    // Listen for messages from the Web Worker
    worker.addEventListener('message', messageEventHandler)
    return worker
  }

  return {
    worker,
  }
}
