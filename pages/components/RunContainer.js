import SandBox from "./SandBox";

export default function RunContainer({sandboxRunning, clickPlay, clickStop, result, logMsg, waiting}) {
    return (
      <div className="rounded-md border border-gray-100 shadow-md shadow-emerald-600/30 bg-white p-3 flex flex-col gap-2">
        <div className="flex justify-between">
            <h3 className="font-semibold text-gray-500 mb-2">p5.js canvas</h3>
            <div className="flex gap-2">
                {
                    waiting ?
                    <>
                        <button className="rounded-full text-white p-2 text-sm disabled:bg-gray-300"
                        onClick={clickPlay} disabled={waiting}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-white stroke-[2]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                        </button>
                        <button className="rounded-full text-white p-2 text-sm disabled:bg-gray-300"
                        onClick={clickStop} disabled={waiting}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-white stroke-[2]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                            </svg>
                        </button>
                    </>
                    :
                    sandboxRunning ?
                    <>
                        <button className="rounded-full bg-emerald-500 text-white p-2 text-sm disabled:bg-gray-300"
                        onClick={clickPlay} disabled={waiting}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-white stroke-[2]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                        </button>
                        <button className="group rounded-full bg-gray-100 text-white p-2 text-sm ring-1 ring-emerald-500 hover:bg-emerald-200 hover:ring-emerald-700 transition-colors disabled:bg-gray-300"
                        onClick={clickStop} disabled={waiting}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-emerald-500 stroke-[2] group-hover:stroke-emerald-700 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                            </svg>
                        </button>
                    </>
                    :
                    <>
                        <button className="group rounded-full bg-gray-100 text-white p-2 text-sm ring-1 ring-emerald-500 hover:bg-emerald-200 hover:ring-emerald-700 transition-colors disabled:bg-gray-300"
                        onClick={clickPlay} disabled={waiting}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-emerald-500 stroke-[2] group-hover:stroke-emerald-700 transition-colors">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                        </button>
                        <button className="rounded-full bg-emerald-500 text-white p-2 text-sm disabled:bg-gray-300"
                        onClick={clickStop} disabled={waiting}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-white stroke-[2]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
                            </svg>
                        </button>
                    </>
                }

            </div>
        </div>

        <SandBox running={sandboxRunning} result={result}/>

        <textarea className="block w-full bg-gray-100 rounded font-mono p-2 text-sm min-h-[70px] text-gray-500"
        value={logMsg} readOnly/>
      </div>
    );
}