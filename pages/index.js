import Head from "next/head";
import { useState, useCallback, useRef, useEffect } from "react";
// import styles from "./index.module.css";
import { sandboxedEval } from "./sandboxedEval";

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function Home() {
  // const [result, setResult] = useState("// type a text prompt above and click 'Generate p5 code'");
  let result;
  
  function TextInput() {
    const [textInput, setTextInput] = useState("");

    async function onSubmit(event) {
      event.preventDefault();
      try {
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
        }

        // setResult(data.result);
        result = data.result;
        // setTextInput("");
      } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
    }

    return (
      <div className="rounded border border-gray-100 shadow-md bg-white p-3">
        <form onSubmit={onSubmit} className="w-full">
          <textarea className="block min-h-[70px] border-[1.5px] border-emerald-500 p-2 rounded w-full mb-2 text-sm"
            type="text"
            name="animal"
            placeholder="Enter a text prompt for a p5.js sketch"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <input className="bg-emerald-500 p-2 rounded w-full text-white text-sm" type="submit" value="Generate p5 code" />
        </form>
      </div>
    );
  }

  function Editor() {
    const onChange = useCallback((value, viewUpdate) => {
      // console.log('value:', value);
      result = value;
      // setResult(value)
      console.log('result:', result)
    }, []);
    return (
      <div className="overflow-scroll rounded border border-gray-100 shadow-md bg-white">
        <CodeMirror key='code-mirror-01'
          value="// type a text prompt above and click 'Generate p5 code'"
          height="100%"
          width="100%"
          minHeight="100px"
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
        />
      </div>
    );
  }

  function RunContainer() {
    // const [evalResult, setEvalResult] = useState("");
    const [sandboxRunning, setSandboxRunning] = useState(false);
    // const sandboxDom = document.getElementById("sandbox");
    // console.log(sandboxRunning);

    function clickPlay(event) {
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

    function clickStop(event) {
      // console.log("Hi dad")
      event.preventDefault();
      setSandboxRunning(false);
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

    function SandBox({running}) {

      const srcdoc = (src) =>
      `<!doctype html>
      <html>
        <head>
          <script src="https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.js"></script>
        </head>
        <body>
          <main></main>
          <!-- <textarea id="console" readonly class="block w-full bg-gray-100 rounded font-mono p-2 text-sm min-h-[70px] text-gray-500"></textarea> -->
        </body>
        <script>
          delete window.fetch;
          delete window.XMLHttpRequest;

          console.log = function(logMsg) {
            window.parent.postMessage(JSON.stringify({ logMsg }), '*');
          };

          ${src}
        </script>
      </html>`;
      
      if (!running) {
        return <div className="w-full min-h-[500px] bg-gray-100 rounded text-sm text-gray-400 flex justify-center items-center">No sketches running</div>
      }
      return (
        <div className="w-full min-h-[500px]">
          <iframe width="100%" height="500" srcDoc={srcdoc(result)} sandbox="allow-scripts" />
        </div>
      );
    }

    function LogFauxBox() {
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
      }, [])

      return <textarea className="block w-full bg-gray-100 rounded font-mono p-2 text-sm min-h-[70px] text-gray-500"
        value={logMsg} readOnly/>
    }

    return (
      <div className="rounded border border-gray-100 shadow-md bg-white p-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <button className="rounded-full bg-emerald-500 text-white p-2 text-sm"
          onClick={clickPlay}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-white stroke-[2]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
            </svg>
          </button>
          <button className="rounded-full bg-emerald-500 text-white p-2 text-sm"
          onClick={clickStop}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-white stroke-[2]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
            </svg>
          </button>
        </div>

        {/* <div id="sandbox">The canvas will go here</div> */}
        <SandBox running={sandboxRunning}/>

        <LogFauxBox />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Text to p5.js</title>
        <link rel="icon" href="/gpt-p5.svg" />
      </Head>
      <div className="w-full p-5 flex flex-col gap-5">
        <TextInput />
        <Editor key="editor-01"/>
        <RunContainer />
      </div>
    </>
  );
}
