export default function SandBox({running, result}) {
    const srcdoc = (src) =>
    `<!doctype html>
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
          window.parent.postMessage(JSON.stringify({ logMsg }), '*');
        };

        ${src}
      </script>
    </html>`;
    
    if (!running) {
      return <div className="w-full min-h-[500px] bg-gray-100 rounded text-sm text-gray-400 flex justify-center items-center">No sketches running</div>
    }
    return (
      <div className="w-full min-h-[500px] border border-gray-300 rounded">
        <iframe width="100%" height="500" srcDoc={srcdoc(result)} sandbox="allow-scripts" />
      </div>
    );
  }