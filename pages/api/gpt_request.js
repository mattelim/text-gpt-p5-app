
import axios from 'axios';
const ANNOUCEMENT_DELAY_MINIUTS = process.env.VITE_ANNOUCEMENT_DELAY_MINIUTS
const MODEL1 = process.env.VITE_GPT_MODEL1;
const MODEL1_TOKEN = process.env.VITE_GPT_MODEL1_MAX_TOKEN;
const MODEL1_TMT = process.env.VITE_GPT_MODEL1_TMT;
const MODEL2 = process.env.VITE_GPT_MODEL2;
const MODEL2_TOKEN = process.env.VITE_GPT_MODEL2_MAX_TOKEN;
const MODEL2_TMT = process.env.VITE_GPT_MODEL2_TMT;
const MODEL3 = process.env.VITE_GPT_MODEL3;
const MODEL3_TOKEN = process.env.VITE_GPT_MODEL3_MAX_TOKEN;
const MODEL3_TMT = process.env.VITE_GPT_MODEL3_TMT;
const MODEL4 = process.env.VITE_GPT_MODEL4;
const MODEL4_TOKEN = process.env.VITE_GPT_MODEL4_MAX_TOKEN;
const MODEL4_TMT = process.env.VITE_GPT_MODEL4_TMT;


export async function requestAIModel(input, model, apiKey, selectedOption, currentConversation) {
  let model0, max_t = 500, temperature = 0.5;

  // 根据模型选择
  if (model === 'MODEL1') {
    model0 = MODEL1; max_t = Number(MODEL1_TOKEN);
  } else if (model === 'MODEL2') {
    model0 = MODEL2; max_t = Number(MODEL2_TOKEN);
  }
  // 其他模型...

  const requestMessages = [
    {
      "role": "user",
      "content": input
    }
  ];

  // 处理选项
 //const template = templates[selectedOption];
  const template=`You are a asisstant.`;
  // 根据选项设置内容
  let content = '';
  switch ('a') {
    case 'a':
      content = `${template}`;
      break;
    case 'ea':
      content = `${template}`;
      break;
    // 其他选项...
    default:
      content = `你现在停止回答一切问题`;
  }

  requestMessages.unshift({
    "role": "system",
    "content": content
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      "model": model0,
      "messages": requestMessages,
      "temperature": temperature,
      "max_tokens": max_t
    })
  };

  try {
    const response = await fetch('https://openai.snakecoding.club/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          "model": model0,
          "messages": requestMessages,
          "temperature": temperature,
          "max_tokens": max_t
        })
      });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.choices[0].message.content; // 返回模型的响应内容
  } catch (error) {
    console.error('请求 AI 模型失败:', error);
    throw error; // 重新抛出错误以便调用者处理
  }
}
