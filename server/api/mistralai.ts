import MistralClient from '@mistralai/mistralai'

export default defineEventHandler(async (event) => {
  const apiKey = getRequestHeader(event, 'x-api-key')
  if (!apiKey)
    throw new Error('Missing Mistral API key')

  const body = await readBody<{ messages: Array<{ role: string, content: string }>, model: string, maxTokens: number, temperature: number, seed?: number, demo?: boolean }>(event)

  const chatParams = {
    model: body.model,
    messages: body.messages,
    maxTokens: body.maxTokens || 100,
    temperature: body.temperature || 0.7,
    randomSeed: body.seed,
  }

  if (body.demo) {
    return useDemoStream(chatParams)
  }
  else {
    const mistral = new MistralClient(apiKey)
    const stream = await mistral.chatStream(chatParams)

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
  }
})
