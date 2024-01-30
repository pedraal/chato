export interface Model {
  id: string
  label: string
  api: string
}

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface Chat {
  id: string
  name: string
  model: Model
  messages: Message[]
  lastMessageAt: Date
}
