import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function Editor({result, onChange, waiting}) {
    return (
      <div className="max-h-[25vh] overflow-scroll rounded-md border border-gray-100 shadow-md shadow-emerald-600/30 bg-white p-3">
        <h3 className="font-semibold text-gray-500 mb-2">p5.js code</h3>
        <CodeMirror key='code-mirror-01'
          value={result}
          height="100%"
          width="100%"
          style={{border: "1.5px solid #d1d5db", borderRadius: "5px", overflow: "clip"}}
          minHeight="100px"
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
          readOnly={waiting}
        />
      </div>
    );
}