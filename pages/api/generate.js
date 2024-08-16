import OpenAI from "openai";
import Cors from 'cors';

// Initializing the cors middleware
const whitelist = process.env.WHITELISTED_DOMAINS ? process.env.WHITELISTED_DOMAINS.split(',') : '*';
const MODEL = process.env.MODEL;

const cors = Cors({
  origin: whitelist
});

const apiKey = process.env.OPENAI_API_KEY;
const api_url = process.env.API_URL;

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

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
  const history = req.body.history || []; // Get conversation history from the request
  if (prompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  //console.log('User prompt:', prompt,"  history:",history);

  // Construct messages array
  const messages = [
    {
      "role": "system",
      "content": "You are an expert p5.js coder. You convert user text input into p5.js code.所有注释用中文"
    },
    ...history.map((msg) => ({
      "role": msg.role,
      "content": msg.content
    })),
    {
      "role": "user",
      "content": 
      `Answer only in code, you can add explanations in chinese as comments within the code . 
      additionally,As a programming teacher for teenagers, you need to patiently explain the programming concepts used in this program  through comments ,
      All comments should start with double slashes.
     
      `
    }
  ];
   // Your response must be in the following p5.js format:
      
      // // <initialize variables>

      // function setup() {
      //   // <setup code>
      // }
      
      // // <other code>

      // function draw() {
      //   // <draw code>
      // } 

      // // <other code>

      // User text input:
      // """
      // ${prompt}
      // """
 // console.log('Request message:', messages);
 console.log("message requesting:",JSON.stringify({
  "model": MODEL,
  "messages": messages,
  "temperature": 0.5,
  "max_tokens": 10000
}));
  try {
    const completion = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        "model": MODEL,
        "messages": messages,
        "temperature": 0.5,
        "max_tokens": 10000
      })
    });
  
    const data = await completion.json();
    //console.log("completion===>:", data.choices[0].message.content); 
    const result = data.choices[0].message.content;
    const cleanedResult = result.replace(/```javascript|```/g, '').trim();
    res.status(200).json({ code: cleanedResult });
  } catch (error) {
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
