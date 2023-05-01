# Text-GPT-p5

A text to p5.js generative editor powered by GPT-3.5 ✨
1. takes plain text prompts 📝
2. makes an OpenAI GPT-3.5 call 🤖
2. converts them into p5.js code 🌸
3. displays the p5.js sketch 🖼️

It is also a sandbox environment for running p5.js (or any javascript code). You can make direct edits to the generated code, which re-runs the sketch immediately, similar to Glitch or Replit. 

### Under the hood

A Next.js full-stack app (React, Next API routes).

Node module(s):
- react-codemirror
- cors
  
### Getting Started

To get started, clone the repository and install the necessary node modules.

`npm install`

### Environment Variables

Make a copy of the `.env.example` file, rename it as `.env`. Enter your OpenAI API key. Specific instructions 5 & 6 [here](https://github.com/openai/openai-quickstart-node).


The example also includes a `NEXT_PUBLIC_REMOTE_API_URL` and `WHITELISTED_DOMAINS`, in case you want to fetch from another server.

### Development, Build, Deploy

Next.js defaults. See `package.json` for commands.
Both dev and production are on port 3000.


## Acknowledgments 🙏

- [processing/p5.js](https://github.com/processing/p5.js)
- [uiwjs/react-codemirror](https://github.com/uiwjs/react-codemirror)
- [codemirror/codemirror5](https://github.com/codemirror/codemirror5)
- [syumai/sandboxed-eval](https://github.com/syumai/sandboxed-eval)
- [openai/openai-quickstart-node](https://github.com/openai/openai-quickstart-node)
- [vercel/next.js/.../cors](https://github.com/vercel/next.js/blob/canary/examples/api-routes-cors/pages/api/cors.ts)
