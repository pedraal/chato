export function useDebugStream(params: Record<string, any>) {
  const event = useEvent()
  setResponseHeader(event, 'Content-Type', 'text/html')
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (const token of JSON.stringify(params, null, 2).split('')) {
        controller.enqueue(encoder.encode(token))
        await new Promise((resolve) => {
          setTimeout(resolve, 5)
        })
      }
    },
  })
  return stream
}
