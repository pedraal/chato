export default function () {
  const audioData = ref<{
    buffer: AudioBuffer
    blob: Blob
    url: string
    mimeType: string
  } | null>(null)

  const progress = ref<number | null>(null)

  async function setAudioFromRecording(data: Blob) {
    audioData.value = null
    progress.value = 0
    const blobUrl = URL.createObjectURL(data)
    const fileReader = new FileReader()
    fileReader.onprogress = (event) => {
      progress.value = event.loaded / event.total || 0
    }
    fileReader.onloadend = async () => {
      const audioCTX = new AudioContext({
        sampleRate: TRANSCRIBER_AUDIO_SAMPLES_RATE,
      })
      const arrayBuffer = fileReader.result as ArrayBuffer
      const decoded = await audioCTX.decodeAudioData(arrayBuffer)
      progress.value = null
      audioData.value = {
        buffer: decoded,
        blob: data,
        url: blobUrl,
        mimeType: data.type,
      }
    }
    fileReader.readAsArrayBuffer(data)
  }

  return {
    audioData,
    setAudioFromRecording,
  }
}
