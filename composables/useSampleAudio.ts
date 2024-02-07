export default function () {
  const audioData = ref<{
    buffer: AudioBuffer
    url: string
    mimeType: string
  } | null>(null)

  const progress = ref<number | null>(null)

  async function downloadAudioFromUrl(url: string) {
    try {
      audioData.value = null
      progress.value = 0
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()

      const headers = response.headers
      const mimeType = headers.get('content-type') || 'audio/wav'

      const data = arrayBuffer as ArrayBuffer

      const audioCTX = new AudioContext({
        sampleRate: TRANSCRIBER_AUDIO_SAMPLES_RATE,
      })
      const blobUrl = URL.createObjectURL(
        new Blob([data], { type: 'audio/*' }),
      )
      const decoded = await audioCTX.decodeAudioData(data)
      audioData.value = {
        buffer: decoded,
        url: blobUrl,
        mimeType,
      }
    }
    catch (error) {
      console.error('Request failed or aborted', error)
    }
    finally {
      progress.value = null
    }
  }

  return {
    audioData,
    progress,
    downloadAudioFromUrl,
  }
}
