interface ProgressItem {
  file: string
  loaded: number
  progress: number
  total: number
  name: string
  status: string
}

interface TranscriberUpdateData {
  data: [
    string,
    { chunks: { text: string, timestamp: [number, number | null] }[] },
  ]
  text: string
}

interface TranscriberCompleteData {
  data: {
    text: string
    chunks: { text: string, timestamp: [number, number | null] }[]
  }
}

export interface TranscriberData {
  isBusy: boolean
  text: string
  chunks: { text: string, timestamp: [number, number | null] }[]
}

export default function () {
  const { transcriberSettings } = useSettings()

  const transcript = ref<TranscriberData | null>(null)
  const isBusy = ref(false)
  const isLoadingModel = ref(false)
  const progressItems = ref<ProgressItem[]>([])

  const transcriberParams = computed(() => {
    return {
      model: transcriberSettings.value.model,
      multilingual: true,
      quantized: true,
      subtask: transcriberSettings.value.subtask,
      language: transcriberSettings.value.language,
    }
  })

  const { data, post } = useWebWorker(new URL('../assets/ai_worker.js', import.meta.url).toString(), { type: 'module' })
  watch(data, data => workerEventHandler(data))

  function sendTranscriptionRequest(audioData: AudioBuffer) {
    transcript.value = null
    isBusy.value = true

    let audio: Float32Array
    // Stereo or mono handling
    if (audioData.numberOfChannels === 2) {
      const SCALING_FACTOR = Math.sqrt(2)

      const left = audioData.getChannelData(0)
      const right = audioData.getChannelData(1)

      audio = new Float32Array(left.length)
      for (let i = 0; i < audioData.length; ++i)
        audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2
    }
    else {
      audio = audioData.getChannelData(0)
    }

    post({
      audio,
      ...transcriberParams.value,
    })
  }

  function workerEventHandler(message: any) {
    switch (message.status) {
      case 'progress':
        progressItems.value = progressItems.value.map((item) => {
          if (item.file === message.file)
            return { ...item, progress: message.progress }

          return item
        })
        break
      case 'update':
        // eslint-disable-next-line no-case-declarations
        const updateMessage = message as TranscriberUpdateData
        transcript.value = {
          isBusy: true,
          text: updateMessage.data[0],
          chunks: updateMessage.data[1].chunks,
        }
        break
      case 'complete':
        // eslint-disable-next-line no-case-declarations
        const completeMessage = message as TranscriberCompleteData
        transcript.value = {
          isBusy: false,
          text: completeMessage.data.text,
          chunks: completeMessage.data.chunks,
        }
        isBusy.value = false
        break

      case 'initiate':
        isLoadingModel.value = true
        progressItems.value.push(message)
        break
      case 'ready':
        isLoadingModel.value = false
        break
      case 'error':
        isBusy.value = false
        useToast().add({
          title: 'Transcription error',
          description: `${message.data.message} This is most likely because you are using Safari on an M1/M2 Mac. Please try again from Chrome, Firefox, or Edge.\n\nIf this is not the case, please file a bug report.`,
          color: 'red',
        })
        break
      case 'done':
        progressItems.value = progressItems.value.filter(item => item.file !== message.file)
        break

      default:
        break
    }
  }

  return {
    transcript,
    isBusy,
    isLoadingModel,
    progressItems,
    sendTranscriptionRequest,
  }
}
