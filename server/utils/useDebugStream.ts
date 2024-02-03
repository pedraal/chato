export function useDebugStream(params: Record<string, any>) {
  const event = useEvent()
  setResponseHeader(event, 'Content-Type', 'text/html')
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (const token of debugMarkdown(params)) {
        controller.enqueue(encoder.encode(token))
        await new Promise((resolve) => {
          setTimeout(resolve, 50)
        })
      }
    },
  })
  return stream
}

function debugMarkdown(params: Record<string, any>) {
  delete params.messages

  const message = `
  ## Debug mode enabled
  This is a debug message to test out what would look like if the LLM was returning a markdown response.

  Your request parameters are:
  \`\`\`json
  ${JSON.stringify(params, null, 2)}
  \`\`\`

  Some debug typescript code:
  \`\`\`typescript
  import { foo } from 'bar'

  const baz = foo()

  async function foobarbaz() {
    return await baz
  }
  \`\`\`

  Some debug html code:
  \`\`\`html
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Example</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }

      html,
      body {
        overflow: hidden;
        background: #111;
      }
    </style>
  </head>

  <body>
    <h1>Hello, world!</h1>
    <a href="#">Home</a>
    <script type="module" src="./main"></script>
  </body>

  </html>
  \`\`\`

  Some debug tsx code:
  \`\`\`tsx
  import React from 'react';

  type LinkItem = {
    label: string;
    href: string;
  };

  type Props = {
    links: LinkItem[];
  };

  const LinkList: React.FC<Props> = ({ links }) => {
    return (
      <ul className=\"list-none p-0 m-0\">
      { links.map((link, index) => (
        <li key= { index } className =\"mb-2\">
          <a
            href = { link.href }
            className =\"text-blue-500 hover:text-blue-700 hover:underline\"
          >
            { link.label }
          </a>
        </li>
      ))}
      </ul>
    );
  };

  export default LinkList;

  // Usage:
  const links: LinkItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  <LinkList links={ links } />
  \`\`\`
  `

  const tokens = []
  let remainingMessage = message

  while (remainingMessage.length > 0) {
    const tokenLength = Math.floor(Math.random() * (20 - 5 + 1)) + 5
    const token = remainingMessage.substring(0, tokenLength)
    tokens.push(token)
    remainingMessage = remainingMessage.substring(tokenLength)
  }

  return tokens
}
