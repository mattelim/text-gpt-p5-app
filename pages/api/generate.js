import OpenAI from "openai";
import Cors from 'cors';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : '*' ;

const cors = Cors({
  origin: whitelist
})

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: apiKey,
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

/* For testing */
// export default async function (req, res) {
//   setTimeout(() => {
//     res.status(200).json({ code: `console.log("hello world ${req.body.prompt}")`});
//   }, 1000);
// }

export default async function (req, res) {
  await runMiddleware(req, res, cors);

  if (!apiKey) {
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          "role": "system",
          "content": "You are an expert p5.js coder. You are convert user text input into p5.js code."
        },
        {
          "role": "user",
          "content": 
          `Answer only in code, you can add explanations as comments within the code. 
          
          Your response must be in the following p5.js format:
          \`\`\`
          // <initialize variables>

          function setup() {
            // <setup code>
          }
          
          // <other code>

          function draw() {
            // <draw code>
          } 

          // <other code>
          \`\`\`

          
          User text input:
          """
          ${prompt}
          """`
        }
      ]
    });
    console.log(completion); 
  console.log("Sent: " + completion.choices[0].message.content);
  res.status(200).json({ code: completion.choices[0].message.content});
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.'
        }
      });
    }
  }
}
