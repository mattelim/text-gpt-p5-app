import Head from "next/head";
import { useState, useCallback, useRef, useEffect } from "react";
// import styles from "./index.module.css";
// import { sandboxedEval } from "./sandboxedEval";
import { TextInput } from "./components/TextInput";
import { Editor } from "./components/Editor";
import { RunContainer } from "./components/RunContainer";

export default function Home() {
  const [result, setResult] = useState("// type a text prompt above and click 'Generate p5.js code'");
  const [textInput, setTextInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [sandboxRunning, setSandboxRunning] = useState(false);
  const [logMsg, setlogMsg] = useState("");

  useEffect(() => {
    let ranOnce = false;

    const handler = event => {
      const data = JSON.parse(event.data)
      // console.log("Hello World?", data.logMsg)
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

  
  // let result;
  function textInputChange(event) {
    event.preventDefault();
    setTextInput(event.target.value);
  }

  async function textInputSubmit(event) {
    event.preventDefault();
    setlogMsg("");
    setWaiting(true);
    setResult("// Please be patient, this may take a while...");
    try {
      console.log(textInput);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
        setWaiting(false);
      }
      console.log(data);
      setResult(data.code);
      setSandboxRunning(true);
      console.log("Generated p5 code: " + data.code)
      setWaiting(false);
      // setResult("WHYYY");
      // result = data.result;
      // setTextInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
      setWaiting(false);
    }
    // console.log("Text: " + textInput);
  }

  const editorChange = useCallback((value, viewUpdate) => {
    // console.log('value:', value);
    // result = value;
    setResult(value);
    // console.log('result:', result);
  }, []);
  
  function runClickPlay(event) {
    // console.log("Hi dad")
    event.preventDefault();
    setSandboxRunning(true);
    // try {
    //   // // const result = await sandboxedEval(JSON.stringify(src));
    //   // // const runLog = await sandboxedEval(result, setEvalResult, sandboxDom);
    //   // const runLog = await sandboxedEval(result, setEvalResult);
    //   // // evalResult.value = JSON.stringify(result);
    //   // console.log(runLog);
    //   setSandboxRunning(true);
    // } catch (e) {
    //   // evalResult.value = e;
    // }
  }

  function runClickStop(event) {
    // console.log("Hi dad")
    event.preventDefault();
    setSandboxRunning(false);
    setlogMsg("");
    // try {
    //   // // const result = await sandboxedEval(JSON.stringify(src));
    //   // // const runLog = await sandboxedEval(result, setEvalResult, sandboxDom);
    //   // const runLog = await sandboxedEval(result, setEvalResult);
    //   // // evalResult.value = JSON.stringify(result);
    //   // console.log(runLog);
    //   setSandboxRunning(false);
    // } catch (e) {
    //   // evalResult.value = e;
    // }
  }

  return (
    <>
      <Head>
        <title>Text to p5.js</title>
        <link rel="icon" href="/gpt-p5.svg" />
      </Head>
      <div className="w-full p-5 flex flex-col gap-5 max-w-2xl min-w-[320px]">
        <h1 className="font-semibold text-xl text-gray-700">🤖🌸 GPT-3.5 to p5.js Generative Editor</h1>
        <TextInput key="textinput-01" textInput={textInput} onChange={textInputChange} onSubmit={textInputSubmit} waiting={waiting}/>
        <Editor key="editor-01" result={result} onChange={editorChange} waiting={waiting}/>
        <RunContainer key="runcont-01" sandboxRunning={sandboxRunning} clickPlay={runClickPlay} clickStop={runClickStop} result={result} logMsg={logMsg} waiting={waiting}/>
        <p className="text-gray-400 text-sm text-center mt-3">Made by <a href="https://mattelim.com" target="_blank" className="underline">Matte Lim</a></p>
      </div>
    </>
  );
}
