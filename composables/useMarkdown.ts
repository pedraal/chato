import MarkdownIt from 'markdown-it'
import Shiki from '@shikijs/markdown-it'

const md = MarkdownIt()
md.use(await Shiki({ theme: 'catppuccin-mocha' }))

export default function () {
  function parseMarkdown(content: string) {
    return md.render(content, {})
  }

  return {
    parseMarkdown,
  }
}
