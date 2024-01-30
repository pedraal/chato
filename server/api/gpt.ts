import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat'

export default defineEventHandler(async (event) => {
  const apiKey = getRequestHeader(event, 'x-api-key')
  if (!apiKey)
    throw new Error('Missing OpenAI API key')
  const openai = new OpenAI({ apiKey })

  const body = await readBody<{ messages: ChatCompletionMessageParam[], model: string, maxTokens: number }>(event)

  const stream = await openai.chat.completions.create({
    model: body.model,
    stream: true,
    messages: body.messages,
    max_tokens: body.maxTokens,
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
