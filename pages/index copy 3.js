import Head from "next/head";
import Link from 'next/link'; // 引入 Link 组件
import { useState, useCallback, useEffect } from "react";
import TextInput from "./components/TextInput";
import Editor from "./components/Editor";
import RunContainer from "./components/RunContainer";
import CodeImporterExporter from "./components/CodeImporterExporter"; // 导入新组件
import html2canvas from 'html2canvas';

// Initializing the cors middleware
const whitelist = process.env.NEXT_PUBLIC_WHITELISTED_DOMAINS ? process.env.NEXT_PUBLIC_WHITELISTED_DOMAINS.split(',') : '*';
const MODEL = process.env.NEXT_PUBLIC_MODEL;


const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const api_url = process.env.NEXT_PUBLIC_API_URL;
const temperature = process.env.NEXT_PUBLIC_TEMPERATURE;
const max_tokens = process.env.NEXT_PUBLIC_MAX_TOKENS;
console.log("api_url ", api_url);
export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false); // 定义状态
  const [result, setResult] = useState("// 请在上面指令区输入你的指令，然后点“提交”");
  const [textInput, setTextInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [sandboxRunning, setSandboxRunning] = useState(false);
  const [logMsg, setlogMsg] = useState("");
  const [selVal, setSelVal] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]); // New state for conversation history
  const [author, setAuthor] = useState(""); // 新增作者输入框状态
  const [showError, setShowError] = useState(false);
  const egArray = [];
  const MAX_HISTORY_LENGTH = 4; // 设置最大历史会话数目
  useEffect(() => {
    let ranOnce = false;

    const handler = event => {
      const data = JSON.parse(event.data);
      if (!ranOnce) {
        setlogMsg(data.logMsg);
        ranOnce = true;
      } else {
        setlogMsg(msg => msg + '\n' + data.logMsg);
      }
    };

    window.addEventListener("message", handler);

    // clean up
    return () => window.removeEventListener("message", handler);
  }, [result, sandboxRunning]);

  function textInputChange(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    setTextInput(event.target.value);
  }

  async function textInputSubmit(event) {

    event.preventDefault();
    setlogMsg("");
    setIsSubmitting(true); // 设置按钮为正在处理状态

    setWaiting(true);
    setResult("// 请耐心等会儿，可能会花比较长时间...");
    setSelVal("");
    //console.log("Waiting:", waiting);
    //console.log("提交按钮:", isSubmitting);
    // Update conversation history with the user's input
    const userMessage = { role: "user", content: textInput };
    const newConversation = [...conversationHistory, userMessage];
    // 限制历史会话数目
    if (newConversation.length > MAX_HISTORY_LENGTH) {
      newConversation.splice(0, newConversation.length - MAX_HISTORY_LENGTH); // 保留最新的会话
    }
    setConversationHistory(newConversation);

    const messages = [
      {
        "role": "system",
        "content": `You are an expert p5.js coder. You convert user text input into p5.js code.所有注释用中文;我希望在生成P5.js 动画后，在动画的第 3 帧自动保存截图。
        使用 saveCanvas('screenshot', 'png') 函数将动画保存为名为 'screenshot.png' 的文件。
        `
      },
      ...newConversation, // 将历史对话添加到 messages 数组中
      {
        "role": "user",
        "content":
          `Answer only in code, you can add explanations in chinese as comments within the code . 
        additionally,As a programming teacher for teenagers, you need to patiently explain the programming concepts used in this program  through comments ,
        All comments should start with double slashes:'//'.
       
        `
      }
    ];




    // const canvas = document.getElementById('defaultCanvas0');

    // function captureScreenshot() {
    //   const dataURL = canvas.toDataURL();

    //   // 显示截图
    //   const img = document.createElement('img');
    //   img.src = dataURL;
    //   document.body.appendChild(img);

    //   // 下载截图
    //   const link = document.createElement('a');
    //   link.href = dataURL;
    //   link.download = 'my-artwork.png';
    //   link.click();
    // }






    const requetOption = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        "model": MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens
      })
    }
    console.log("MODEL ", MODEL);
    console.log("requetOption :", requetOption);
    try {
      const response = await fetch('https://openai.snakecoding.club/v1/chat/completions', requetOption);



      const data = await response.json();
      // console.log("completion===>:", data); 
      const result = data.choices[0].message.content;
      const cleanedResult = result.replace(/```javascript|```/g, '').trim();

      console.log("提交按钮2:", isSubmitting);




      //const data = await response.json();
      //console.log("response::",cleanedResult);
      if (response.status !== 200) {
        setWaiting(false);
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      // Update conversation history with the assistant's response
      const assistantMessage = { role: "assistant", content: cleanedResult };
      setConversationHistory(prev => {
        const updatedHistory = [...prev, assistantMessage];
        // 限制历史会话数目
        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
          updatedHistory.splice(0, updatedHistory.length - MAX_HISTORY_LENGTH);
        }
        return updatedHistory;
      });

      setResult(cleanedResult);
      setSandboxRunning(true);
      setWaiting(false);
      setIsSubmitting(false); // 请求完成，设置按钮为可用状态
    } catch (error) {
      console.error("错误信息:", error.message);
      alert("错误信息:", error.message);
      setWaiting(false);
      setIsSubmitting(false); // 请求失败，设置按钮为可用状态
    }
  }


  const editorChange = useCallback((value, viewUpdate) => {
    setResult(value);
  }, []);

  function runClickPlay(event) {
    event.preventDefault();
    setSandboxRunning(true);
  }

  function runClickStop(event) {
    event.preventDefault();
    setSandboxRunning(false);
    setlogMsg("");
  }

  function textSelectChange(event) {
    setSelVal(event.target.value);
    event.preventDefault();
    const search = event.target.value;
    const selectedEg = egArray.find((obj) => obj.value === search);
    if (selectedEg) {
      setlogMsg('');
      setTextInput(selectedEg.prompt);
      setResult(selectedEg.code);
      setSandboxRunning(true);
    } else {
      setlogMsg('');
      setTextInput('');
      setResult('');
      setSandboxRunning(false);
    }
  }
  // 处理作者输入
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
    setShowError(false); // 当输入框内容改变时，隐藏错误提示
  };

  // 分享作品
  const shareWork = async (screenshotDataURL) => {
    if (author.trim() === '') { // 检查作者姓名是否为空
      console.log("输入分享作者的名字！");
      setShowError(true);
      return;
    }
    try {
      // 获取要截图的元素
      // const runContainer = document.querySelector('.run-container'); // 假设你的 RunContainer 组件有一个名为 "run-container" 的类名

      // // 使用 html2canvas 生成截图
      // const canvas = await html2canvas(runContainer);
      // const screenshot = canvas.toDataURL('image/png'); // 获取截图的 Base64 数据 URL

       
      console.log('screenshot 2 :', screenshot);
      // const canvas =  iframe.contentDocument.getElementById('defaultCanvas0');
      // console.log('screenshot  :',canvas );
      // if (canvas) {}
      // const screenshot = canvas.toDataURL('image/jpeg', 0.8);
      // const dataURL = canvas.toDataURL('image/jpeg', 0.8); // 输出 JPEG 格式图片，质量为 0.8


      const requestOption = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: result,
          screenshot: screenshot,
          title: textInput,
          author: author,
        }),
      };
      const response = await fetch('/api/works/', requestOption);
      console.log("requestOption  ", requestOption);
      if (response.ok) {
        const data = await response.json();
        console.log('作品分享成功:', data);
        // 可以在这里添加成功提示，例如弹窗或跳转到作品页面
      } else {
        console.error('作品分享失败:', response.status);
        // 处理分享失败，例如显示错误信息
      }
    } catch (error) {
      console.error('作品分享出错:', error);
      // 处理分享出错，例如显示错误信息
    }
  };
  // New function to start a new topic
  function startNewTopic(event) {
    event.preventDefault(); // 阻止默认行为
    console.log("新想法按钮");
    setConversationHistory([]); // Clear conversation history
    setTextInput(""); // Clear text input
    setResult("// 请在上面指令区输入你的指令，然后点“提交”"); // Reset result
    setlogMsg(""); // Clear log messages
    setSandboxRunning(false); // Stop sandbox if running
  }

  return (
    <>
      <Head>
        <title>斯内克 AI 创意编程</title>
        <meta name="description" content="Turn text into p5.js code using GPT and display it" />
        <link rel="icon" href="/AI-aigr.svg" />
      </Head>
      <div className="w-full p-5 flex flex-col gap-5 max-w-2xl min-w-[320px] relative 2xl:max-w-7xl">
        <header className="flex gap-3 justify-between">
          <div className="flex gap-3">
            <img src="logo-ai.png" alt="logo" className="h-16 w-16 p-1 bg-white rounded-full shadow shadow-emerald-600/30 overflow-visible" />
            <div className="text-gray-700 flex flex-col justify-center h-full">
              <h1 className="logo-title font-semibold text-xl ">
                斯内克 AI 创意编程
              </h1>
              <p className="logo-subtitle" >体验AI的力量 - AI generation</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 xs:flex-row xs:gap-3">
            <div className="flex items-center xs:order-last">
              <a href="https://github.com/mattelim/text-gpt-p5-app" target="_blank" className="mr-3 opacity-30 hover:opacity-100">
                <img src="github-mark.svg" alt="github" className="w-8 aspect-square xs:w-6" />
              </a>
              <a href="https://www.buymeacoffee.com/mattelim" target="_blank" className="opacity-30 hover:opacity-100">
                <img src="bmc-logo.svg" alt="buy me a coffee" className="w-8 aspect-square xs:w-6" />
              </a>
            </div>

            <Link href="/share" className="zplb px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              作品列表</Link>

            <div className="flex flex-col items-start xs:flex-row xs:items-center">
              <button onClick={shareWork} disabled={!result || author.trim() === ''} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
                分享作品
              </button>
              {showError && (
                <p className="text-red-500 text-sm mt-2 xs:mt-0 xs:ml-2">请输入你的名字</p>
              )}
            </div>

            <div className="flex items-center">
              <label htmlFor="author" className="mr-2">你的名字:</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={handleAuthorChange}
                className="border border-gray-300 rounded-md px-2 py-1"
              />
            </div>
          </div>

        </header>
        <div className="flex flex-col gap-4 2xl:flex-row w-full">
          <div className="flex flex-col gap-4 2xl:w-1/2">
            <TextInput
              key="textinput-01"
              textInput={textInput}
              onChange={textInputChange}

              waiting={waiting}
              selectVal={selVal}
              selectChange={textSelectChange}
              egArray={egArray}
              textInputSubmit={textInputSubmit}
              startNewTopic={startNewTopic}
            />
            {/* TODO 需要加个撤回上一步按钮，当更新的命令没有实现或有错误可以重新下命令生成。 */}
            <Editor
              key="editor-01"
              result={result}
              onChange={editorChange}
              waiting={waiting}
              conversationHistory={conversationHistory}

              textInput={textInput}
              setConversationHistory={setConversationHistory}
              setResult={setResult}
              setTextInput={setTextInput}
            />



          </div>

          <div className="flex flex-col gap-4 2xl:w-1/2">
            <RunContainer
              key="runcont-01"
              sandboxRunning={sandboxRunning}
              clickPlay={runClickPlay}
              clickStop={runClickStop}
              result={result}
              logMsg={logMsg}
              waiting={waiting}
            />

          </div>
        </div>

        <p className="text-gray-400 text-sm text-center mt-3">
          Made by <a href="https://mattelim.com" target="_blank" className="underline">Matte Lim</a>/  Modified by <a href="https://snakecoding.club" target="_blank" className="underline">Daniel</a> / AI model : {MODEL}
        </p>

      </div>
    </>
  );
}
