# Text→GPT→p5

A text to p5.js Generative Editor powered by GPT-3.5
1. takes plain text prompts 📝
2. makes an OpenAI GPT-3.5 call 🤖
2. converts them into p5.js code 🌸
3. displays the p5.js sketch 🖼️

A Next.js app that

**Front-end**
- Vite
- Typescript
- Multipage (template includes 3 entry points)

**Back-end**
- ts-node 
- Typescript
- Express
- DX libraries
  - Nodemon
  - Livereload
- Included (easily removed)
  - Socket.io
  - Sqlite3
  
### Getting Started

To get started, clone the repository and install the necessary node modules.

`npm install`

### Development 

During development, open two terminal tabs, on one, run:

`npm run build -- --watch`

On the other, run:

`npm run dev`

The first compiles the `.ts` and imported ES node modules into the dist folder. (This is a somewhat unconventional use of Vite – the other way is to use a bundler, but this is a shortcut for me to save time.)

The second runs the `server.ts` file in `nodemon` on port `3000` and watches for any changes to the files. To add more convenience, `livereload` is added so that the `html` pages automatically refreshes in the browser.

#### Testing if the template works

After running the two development steps, you should be able to open these addresses:
- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/1](http://localhost:3000/1)
- [http://localhost:3000/2](http://localhost:3000/2)
- [http://localhost:3000/api/test](http://localhost:3000/api/test)

### Production

To go into production, run:

`npm run build`, then run:

`npm run start`

This starts a production ts-node server on port `3000`.

## Acknowledgments

This template is built using ideas and code from [cyco130/vavite](https://github.com/cyco130/vavite) and [szymmis/vite-express](https://github.com/szymmis/vite-express). 
  
  
