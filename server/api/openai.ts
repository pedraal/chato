import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat'
import type { Stream } from 'openai/streaming'

export default defineEventHandler(async (event) => {
  const apiKey = getRequestHeader(event, 'x-api-key')
  if (!apiKey)
    throw new Error('Missing OpenAI API key')

  const body = await readBody<{ messages: ChatCompletionMessageParam[], model: string, maxTokens: number, temperature: number, seed?: number, demo?: boolean }>(event)

  const chatParams = {
    model: body.model,
    stream: true,
    messages: body.messages,
    max_tokens: body.maxTokens || 100,
    temperature: body.temperature || 0.7,
    seed: body.seed,
  }

  if (body.demo) {
    return useDemoStream(chatParams)
  }
  else {
    const openai = new OpenAI({ apiKey })
    const stream = await openai.chat.completions.create(chatParams) as Stream<OpenAI.Chat.Completions.ChatCompletionChunk>

    const encoder = new TextEncoder()
    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.choices[0].delta.content) {
            const streamText = chunk.choices[0].delta.content
            controller.enqueue(encoder.encode(streamText))
          }
        }
        controller.close()
      },
    })
    return responseStream
  }
})
