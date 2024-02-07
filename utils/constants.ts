export const API_KEY_DISCLAIMER = 'Your API key will be exclusively saved in your browser storage. Hovewer it is sent to this app server to make calls to LLMs API. It won\'t be logged anywhere neither.'

export const OPEN_AI_MODELS = {
  'gpt-3.5-turbo-0125': 'GPT-3.5 Turbo',
  'gpt-4-1106-preview': 'GPT-4',
  'gpt-4-0125-preview': 'GPT-4 Turbo',
}

export const MISTRAL_AI_MODELS = {
  'mistral-tiny': 'Mistral Tiny',
  'mistral-small': 'Mistral Small',
  'mistral-medium': 'Mistral Medium',
}

// List of supported languages:
// https://help.openai.com/en/articles/7031512-whisper-api-faq
// https://github.com/openai/whisper/blob/248b6cb124225dd263bb9bd32d060b6517e067f8/whisper/tokenizer.py#L79
export const TRANSCRIBER_LANGUAGES = {
  en: 'english',
  fr: 'french',
  zh: 'chinese',
  de: 'german',
  es: 'spanish/castilian',
  ru: 'russian',
  ko: 'korean',
  ja: 'japanese',
  pt: 'portuguese',
  tr: 'turkish',
  pl: 'polish',
  ca: 'catalan/valencian',
  nl: 'dutch/flemish',
  ar: 'arabic',
  sv: 'swedish',
  it: 'italian',
  id: 'indonesian',
  hi: 'hindi',
  fi: 'finnish',
  vi: 'vietnamese',
  he: 'hebrew',
  uk: 'ukrainian',
  el: 'greek',
  ms: 'malay',
  cs: 'czech',
  ro: 'romanian/moldavian/moldovan',
  da: 'danish',
  hu: 'hungarian',
  ta: 'tamil',
  no: 'norwegian',
  th: 'thai',
  ur: 'urdu',
  hr: 'croatian',
  bg: 'bulgarian',
  lt: 'lithuanian',
  la: 'latin',
  mi: 'maori',
  ml: 'malayalam',
  cy: 'welsh',
  sk: 'slovak',
  te: 'telugu',
  fa: 'persian',
  lv: 'latvian',
  bn: 'bengali',
  sr: 'serbian',
  az: 'azerbaijani',
  sl: 'slovenian',
  kn: 'kannada',
  et: 'estonian',
  mk: 'macedonian',
  br: 'breton',
  eu: 'basque',
  is: 'icelandic',
  hy: 'armenian',
  ne: 'nepali',
  mn: 'mongolian',
  bs: 'bosnian',
  kk: 'kazakh',
  sq: 'albanian',
  sw: 'swahili',
  gl: 'galician',
  mr: 'marathi',
  pa: 'punjabi/panjabi',
  si: 'sinhala/sinhalese',
  km: 'khmer',
  sn: 'shona',
  yo: 'yoruba',
  so: 'somali',
  af: 'afrikaans',
  oc: 'occitan',
  ka: 'georgian',
  be: 'belarusian',
  tg: 'tajik',
  sd: 'sindhi',
  gu: 'gujarati',
  am: 'amharic',
  yi: 'yiddish',
  lo: 'lao',
  uz: 'uzbek',
  fo: 'faroese',
  ht: 'haitian creole/haitian',
  ps: 'pashto/pushto',
  tk: 'turkmen',
  nn: 'nynorsk',
  mt: 'maltese',
  sa: 'sanskrit',
  lb: 'luxembourgish/letzeburgesch',
  my: 'myanmar/burmese',
  bo: 'tibetan',
  tl: 'tagalog',
  mg: 'malagasy',
  as: 'assamese',
  tt: 'tatar',
  haw: 'hawaiian',
  ln: 'lingala',
  ha: 'hausa',
  ba: 'bashkir',
  jw: 'javanese',
  su: 'sundanese',
}

export const TRANSCRIBER_MODELS = {
  'Xenova/whisper-tiny': [41, 152],
  'Xenova/whisper-base': [77, 291],
  'Xenova/whisper-small': [249],
  'Xenova/whisper-medium': [776],
}

export const TRANSCRIBER_SUBTASKS = {
  transcribe: 'Transcribe',
  translate: 'Translate to english',
}

export const AUDIO_MIME_TYPES = [
  'audio/webm',
  'audio/mp4',
  'audio/ogg',
  'audio/wav',
  'audio/aac',
]

export const TRANSCRIBER_AUDIO_SAMPLES_RATE = 16000