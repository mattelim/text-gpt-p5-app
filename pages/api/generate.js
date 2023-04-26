import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// export default async function (req, res) {
//   setTimeout(() => {
//     res.status(200).json({ code: `console.log("hello world ${req.body.prompt}")`});
//   }, 4000);
// }

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const prompt = req.body.prompt || '';
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  console.log('User prompt:', prompt);

  try {
    const completion = await openai.createChatCompletion({
      model:"gpt-3.5-turbo",
      messages:[
          {
            "role": "user", 
            // "content": `Do not explain. Convert the following text into p5js code that runs in the draw function: ${userInput}`
            // "content": `Do not explain. Convert the following text into react-p5 code that runs in the draw function: ${userInput}`
            // "content": `Do not explain, answer only in code. You are converting user text input into react-p5 code that will be run in eval() within a React component. You only need to provide the react-p5 'setup' and 'draw' functions, as well as other helper functions that will be used in them. Your response must start with 'const setup = (p5, canvasParentRef)'. This is the user text input: ${userInput}`
            "content": `Do not explain, answer only in code. You are converting user text input into p5.js code. Your response must start with 'function setup() {' or 'const' or 'let'. Your response must include 'function setup()' and 'function draw()'. This is the user text input: ${prompt}`
          }
        ]
    });
  console.log(completion.data);
  console.log("Sent: " + completion.data.choices[0].message.content);
  res.status(200).json({ code: completion.data.choices[0].message.content});
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

// function generatePrompt(prompt) {
//   const capitalizedprompt =
//     prompt[0].toUpperCase() + prompt.slice(1).toLowerCase();
//   return `Suggest three names for an prompt that is a superhero.

// prompt: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// prompt: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// prompt: ${capitalizedprompt}
// Names:`;
// }
