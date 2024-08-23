export default function SandBox({ running, result }) {
  const srcdoc = (src) => `
   <!doctype html>
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.js"></script>
      </head>
      <body style="background-color:#d1d5db; padding:0; margin:0; min-height: 500px;">
        <main style="display: flex; justify-content: center; align-items: center; min-height: 500px;"></main>
      </body>
      <script>
        delete window.fetch;
        delete window.XMLHttpRequest;

        console.log = function(logMsg) {
          // 确保发送的是 JSON 字符串
          window.parent.postMessage(JSON.stringify({ logMsg: logMsg.toString() }), '*'); 
        };

        ${src}

          if (typeof draw === 'function') {
        const originalDraw = draw;
        let frameCount = 0;
        let screenshotTaken = false; // 添加一个标志位，表示是否已截图

        window.draw = function() {
          originalDraw();

          if (frameCount === 3 && !screenshotTaken) { // 只在第一次达到第 3 帧时截图
            const canvas = document.getElementById('defaultCanvas0');
            const dataURL = canvas.toDataURL('image/png');
            
            window.parent.postMessage(JSON.stringify({ type: 'screenshot', dataURL: dataURL }), '*');
            screenshotTaken = true; // 设置标志位
            // 不再调用 noLoop()
          }

          frameCount++;
        };
      }
    </script>
    </html>
  `;

  if (!running) {
    return (
      <div className="w-full min-h-[590px] bg-gray-100 rounded text-sm text-gray-400 flex justify-center items-center">
        没有代码在运行
      </div>
    );
  }

  return (
    <div className="w-full min-h-[500px] border border-gray-300 rounded">
      <iframe
        width="100%"
        height="500"
        srcDoc={srcdoc(result)}
        sandbox="allow-scripts"
      />
    </div>
  );
}