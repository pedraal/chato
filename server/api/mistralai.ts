import MistralClient from '@mistralai/mistralai'

export default defineEventHandler(async (event) => {
  const apiKey = getRequestHeader(event, 'x-api-key')
  if (!apiKey)
    throw new Error('Missing Mistral API key')
  const mistral = new MistralClient(apiKey)

  const body = await readBody<{ messages: Array<{ role: string, content: string }>, model: string, maxTokens: number }>(event)

  const stream = await mistral.chatStream({
    model: body.model,
    messages: body.messages,
    temperature: 0.1,
  })

  const encoder = new TextEncoder()
  const responseStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.choices[0].delta.content) {
          const streamText = chunk.choices[0].delta.content
          controller.enqueue(encoder.encode(streamText))
        }
      }
    },
  })
  return responseStream
})
