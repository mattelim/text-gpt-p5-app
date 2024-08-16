import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import TextInput from "./components/TextInput";
import Editor from "./components/Editor";
import RunContainer from "./components/RunContainer";
import CodeImporterExporter from "./components/CodeImporterExporter"; // 导入新组件


export default function Home() {
  const [result, setResult] = useState("// 请在上面指令区输入你的指令，然后点“提交”");
  const [textInput, setTextInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [sandboxRunning, setSandboxRunning] = useState(false);
  const [logMsg, setlogMsg] = useState("");
  const [selVal, setSelVal] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]); // New state for conversation history

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
    setWaiting(true);
    setResult("// 请耐心等会儿，可能会花比较长时间...");
    setSelVal("");
  
    // Update conversation history with the user's input
    const userMessage = { role: "user", content: textInput };
    const newConversation = [...conversationHistory, userMessage];
     // 限制历史会话数目
  if (newConversation.length > MAX_HISTORY_LENGTH) {
    newConversation.splice(0, newConversation.length - MAX_HISTORY_LENGTH); // 保留最新的会话
  }
    setConversationHistory(newConversation);
  
    console.log("request JSON:",JSON.stringify({ prompt: textInput, history: newConversation }));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REMOTE_API_URL || ''}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textInput, history: newConversation }), // Include history in the request
      });
  
      const data = await response.json();
      if (response.status !== 200) {
        setWaiting(false);
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
  
      // Update conversation history with the assistant's response
      const assistantMessage = { role: "assistant", content: data.code };
      setConversationHistory(prev => {
        const updatedHistory = [...prev, assistantMessage];
        // 限制历史会话数目
        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
          updatedHistory.splice(0, updatedHistory.length - MAX_HISTORY_LENGTH);
        }
        return updatedHistory;
      });
  
      setResult(data.code);
      setSandboxRunning(true);
      setWaiting(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
      setWaiting(false);
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

  // New function to start a new topic
  function startNewTopic() {
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
        <link rel="icon" href="/snake-ai.svg" />
      </Head>
      <div className="w-full p-5 flex flex-col gap-5 max-w-2xl min-w-[320px] relative 2xl:max-w-7xl">
        <header className="flex gap-3 justify-between">
          <div className="flex gap-3">
            <img src="logo-ai.png" alt="logo" className="h-16 w-16 p-1 bg-white rounded-full shadow shadow-emerald-600/30 overflow-visible"/>
            <div className="text-gray-700 flex flex-col justify-center h-full">
              <h1 className="logo-title font-semibold text-xl ">
              斯内克 AI 创意编程
              </h1>
              <p className="logo-subtitle" >体验AI的力量 - AI generation</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 xs:flex-row xs:gap-3">
            <a href="https://github.com/mattelim/text-gpt-p5-app" target="_blank" className="xs:order-last">
              <img src="github-mark.svg" alt="github" className="w-8 aspect-square opacity-30 hover:opacity-100 xs:w-6"/>
            </a>
            <a href="https://www.buymeacoffee.com/mattelim" target="_blank">
              <img src="bmc-logo.svg" alt="buy me a coffee" className="w-8 aspect-square opacity-30 hover:opacity-100 xs:w-6"/>
            </a>
          </div>
        </header>
        <div className="flex flex-col gap-4 2xl:flex-row w-full">
          <div className="flex flex-col gap-4 2xl:w-1/2">
            <TextInput 
              key="textinput-01" 
              textInput={textInput} 
              onChange={textInputChange} 
              onSubmit={textInputSubmit} 
              waiting={waiting} 
              selectVal={selVal} 
              selectChange={textSelectChange} 
              egArray={egArray}
            />
            {/* TODO 需要加个撤回上一步按钮，当更新的命令没有实现或有错误可以重新下命令生成。 */}
            <Editor 
              key="editor-01" 
              result={result} 
              onChange={editorChange} 
              waiting={waiting}
            />
            <button 
              onClick={startNewTopic} 
              className="floating-button-new-idea mt-4 p-2 bg-blue-500 text-white rounded"
            >
              新想法
            </button>
            <CodeImporterExporter 
          conversationHistory={conversationHistory}
          result={result}
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
          Made by <a href="https://mattelim.com" target="_blank" className="underline">Matte Lim</a>/  Modified by <a href="https://snakecoding.club" target="_blank" className="underline">Daniel</a>
        </p>
      </div>
    </>
  );
}
