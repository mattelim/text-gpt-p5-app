import React, { useState } from 'react';
export default function TextInput({ textInput, onChange, onSubmit, waiting, selectVal, selectChange, egArray, textInputSubmit, startNewTopic ,isSubmitting}) {
 
  const handleFocus = () => {
    // 创建一个模拟的事件对象
    const event = {
      target: {
        value: ''
      }
    };
    onChange(event);
  };
  return (
    <div className="rounded-md border border-gray-100 shadow-md shadow-emerald-600/30 bg-white p-3">
      <div className="flex justify-between xs:mb-2">
        <h3 className="font-semibold text-gray-500">下达指令：</h3>

      </div>
      <form className="w-full">
        <textarea key="textarea-01" className="block min-h-[50px] xs:min-h-[120px] border-[1.5px] border-emerald-500 p-2 rounded w-full mb-2 text-sm
          disabled:border-gray-300 disabled:text-gray-600 disabled:bg-gray-100"
          type="text"
          name="prompt"
          placeholder="输入或更新的你指令."
          value={textInput}
          onChange={onChange}
          onFocus={handleFocus}
          disabled={waiting}
        />
        {/* { waiting ? 
          <button className="bg-gray-300 p-2 rounded w-full text-white text-sm px-3" type="submit" disabled>
            <img src="loading.png" alt="loading icon" className="animate-spin w-4 h-4 mr-2 inline" />
            AI 正在生成代码...
          </button>
          : 
          <button className="bg-emerald-500 p-2 rounded w-full text-white text-sm px-3 cursor-pointer" type="submit">提交/更新</button> }
           */}
        <div className="flex gap-3 mt-0 justify-between ">
          <button
            onClick={textInputSubmit}
            className="p-1 bg-green-500 text-white rounded"
            disabled={isSubmitting || waiting} // 禁用按钮
          >
          {waiting ? '正在处理...' : '提交/更新'} {/* 显示不同的文本 */}
          </button>
          <button
            onClick={startNewTopic}
            className="floating-button-new-idea p-1 bg-blue-500 text-white rounded"
          >
            新想法
          </button>

        </div>
      </form>
    </div>
  );
}