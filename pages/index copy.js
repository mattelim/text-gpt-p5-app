import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import TextInput from "./components/TextInput";
import Editor from "./components/Editor";
import RunContainer from "./components/RunContainer";

export default function Home() {
  const [result, setResult] = useState("// type a text prompt above and click 'Generate p5.js code'");
  const [textInput, setTextInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [sandboxRunning, setSandboxRunning] = useState(false);
  const [logMsg, setlogMsg] = useState("");
  const [selVal, setSelVal] = useState("");

  const egArray = [];

  useEffect(() => {
    let ranOnce = false;

    const handler = event => {
      const data = JSON.parse(event.data)
      if (!ranOnce) {
        setlogMsg(data.logMsg);
        ranOnce = true;
      } else {
        setlogMsg(msg => msg + '\n' + data.logMsg);
      }
    }

    window.addEventListener("message", handler)

    // clean up
    return () => window.removeEventListener("message", handler)
  }, [result, sandboxRunning])

  function textInputChange(event) {
    event.preventDefault();
    setTextInput(event.target.value);
  }

  async function textInputSubmit(event) {
    event.preventDefault();
    setlogMsg("");
    setWaiting(true);
    setResult("// Please be patient, this may take a while...");
    setSelVal("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REMOTE_API_URL || ''}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textInput }),
      });
console.log("textInputSubmit function");
      const data = await response.json();
      if (response.status !== 200) {
        setWaiting(false);
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.code);
      setSandboxRunning(true);
      setWaiting(false);
    } catch(error) {
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
    if(selectedEg) {
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

  return (
    <>
      <Head>
        <title>AI 创意编程</title>
        <meta name="description" content="Turn text into p5.js code using GPT and display it" />
        <link rel="icon" href="/gpt-p5.svg" />
      </Head>
      <div className="w-full p-5 flex flex-col gap-5 max-w-2xl min-w-[320px] relative 2xl:max-w-7xl">
        <header className="flex gap-3 justify-between">
          <div className="flex gap-3">
            <img src="gpt-p5-emerald.png" alt="logo" className="h-11 w-11 p-2 bg-white rounded-full shadow shadow-emerald-600/30 overflow-visible"/>
          <div className="text-gray-700">
            <h1 className="font-semibold text-xl ">
            AI 创意编程
            </h1>
            <p>体验AI的力量</p>
          </div>
          </div>
          <div className="flex flex-col gap-4 xs:flex-row xs:gap-3">
            <a href="https://github.com/mattelim/text-gpt-p5-app" target="_blank" className="xs:order-last"><img src="github-mark.svg" alt="github" className="w-8 aspect-square opacity-30 hover:opacity-100 xs:w-6"/></a>
            <a href="https://www.buymeacoffee.com/mattelim" target="_blank"><img src="bmc-logo.svg" alt="buy me a coffee" className="w-8 aspect-square opacity-30 hover:opacity-100 xs:w-6"/></a>
          </div>
        </header>
        <div className="flex flex-col gap-4 2xl:flex-row w-full">
          <div className="flex flex-col gap-4 2xl:w-1/2">
            <TextInput key="textinput-01" textInput={textInput} onChange={textInputChange} onSubmit={textInputSubmit} waiting={waiting} selectVal={selVal} selectChange={textSelectChange} egArray={egArray}/>
            <Editor key="editor-01" result={result} onChange={editorChange} waiting={waiting}/>
          </div>
          <div className="flex flex-col gap-4 2xl:w-1/2">
            <RunContainer key="runcont-01" sandboxRunning={sandboxRunning} clickPlay={runClickPlay} clickStop={runClickStop} result={result} logMsg={logMsg} waiting={waiting}/>
          </div>
        </div>
        <p className="text-gray-400 text-sm text-center mt-3">Made by <a href="https://mattelim.com" target="_blank" className="underline">Matte Lim</a></p>
      </div>
    </>
  );
}
