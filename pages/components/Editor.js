import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import CodeImporterExporter from "./CodeImporterExporter"; // 导入新组件
export default function Editor({ result, onChange, waiting, conversationHistory, textInput, setConversationHistory, setResult, setTextInput }) {
  return (
    <div className="max-h-[25vh] overflow-scroll rounded-md border border-gray-100 shadow-md shadow-emerald-600/30 bg-white p-3" style={{ minHeight: "550px" }}>
      <div className="flex justify-between items-center mb-2"> {/* 使用 Flexbox 布局 */}
        <h3 className="font-semibold text-gray-500">程序代码：</h3>
        <div className="ml-auto"> {/* 使用 ml-auto 将组件推到右侧 */}
          <CodeImporterExporter
            conversationHistory={conversationHistory}
            result={result}
            textInput={textInput}
            setConversationHistory={setConversationHistory}
            setResult={setResult}
            setTextInput={setTextInput}
          />
        </div>
      </div>
      <CodeMirror key='code-mirror-01'
        value={result}
        height="100%"
        width="100%"
        style={{ border: "1.5px solid #d1d5db", borderRadius: "5px", overflow: "clip" }}
        minHeight="200px"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
        readOnly={waiting}
      />

    </div>
  );
}