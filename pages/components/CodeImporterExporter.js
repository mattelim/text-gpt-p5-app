import React from 'react';
import { saveAs } from 'file-saver';

const CodeImporterExporter = ({ conversationHistory, result, textInput, setConversationHistory, setResult, setTextInput }) => {
  // 导出代码为 JSON 文件
  const exportCode = () => {
    const codeToExport = {
      history: conversationHistory,
      result: result,
      textInput: textInput,
    };
    const blob = new Blob([JSON.stringify(codeToExport, null, 2)], { type: 'application/json' });
    saveAs(blob, 'code_export.json');
  };

  // 导入代码
  const importCode = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const importedData = JSON.parse(e.target.result);
      setConversationHistory(importedData.history || []);
      setResult(importedData.result || "// 请在上面指令区输入你的指令，然后点“提交”");
      setTextInput(importedData.textInput || "");
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <button onClick={exportCode} className="floating-button-exporter mt-4 p-2 bg-green-500 text-white rounded">
        导出
      </button>
      <label className="floating-button-importer custom-file-input mt-4">
        导入
        <input type="file" accept=".json" onChange={importCode} className="file-input" />
      </label>
    </div>
  );
};

export default CodeImporterExporter;
