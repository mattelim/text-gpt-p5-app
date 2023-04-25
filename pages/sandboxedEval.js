const srcdoc = (origin, senderId, receiverId, src) =>
`<!doctype html>
<html>
<head>
<script src="https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.js"></script>
</head>
<body>
<main></main>
<script>
// delete window.fetch;
// delete window.XMLHttpRequest;
const origin = "${origin}";
const senderId = "${senderId}";
const receiverId = "${receiverId}";

console.log = function(result) {
    // document.getElementById('console').innerHTML = result;
    window.parent.postMessage({ id: senderId, result }, origin);
};
console.log('your result');
console.log('your result');
console.log('your result');

// const handleMessage = (event) => {
//   if (event.source !== window.parent) {
//     return;
//   }
//   if (event.origin !== origin) {
//     return;
//   }
//   const { id, src, scope } = event.data || {};
//   if (id !== receiverId) {
//     return;
//   }
//   try {
//     const result =
//       new Function(...Object.keys(scope), '"use strict";' + src)(...Object.values(scope));
//     window.parent.postMessage({ id: senderId, result }, origin);
//   } catch (error) {
//     window.parent.postMessage({ id: senderId, error }, origin);
//   }
//   window.removeEventListener("message", handleMessage);
// };
// window.addEventListener("message", handleMessage);
// window.parent.postMessage({ id: senderId, ready: true }, origin);

// new Function('"use strict";' + {src})();
${src}

let x = 100;
let y = 100;

function setup() {
  createCanvas(200,200);
  frameRate(30);
}

function draw() {
  background(0);
  fill(255);
  ellipse(x,y,Math.random()*50,returnVal());
  console.log(Math.random());
  console.log(frameCount);
  console.log(frameRate());
}

function returnVal() {
    return 50;
}

</script>
</body>
</html>`;

function genId() {
    return Array.from(crypto.getRandomValues(new Uint32Array(4)))
        .map((n) => n.toString(36))
        .join("");
}

// export function sandboxedEval(src, setEvalResult, sandboxDom, scope = {}) {
export function sandboxedEval(src, setEvalResult, scope = {}) {
    // console.log("hi there");
    const iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    // iframe.setAttribute("style", "display: none;");
    const senderId = genId();
    const receiverId = genId();

    let firstRun = true;

    return new Promise((resolve, reject) => {
        const handleMessage = (event) => {
            // console.log("hi there");
            if (event.source !== iframe.contentWindow) {
                // console.log("hi 1");
                return;
            }
            const { id, result, error, ready } = event.data ?? {};
            if (id !== senderId) {
                // console.log("hi 2");
                return;
            }
            if (ready) {
                // console.log("hi 3");
                iframe.contentWindow.postMessage({ id: receiverId, src, scope }, "*");
                return;
            }
            if (error) {
                // console.log("hi 4");
                reject(error);
            } else {
                // console.log("hi 5");
                // console.log(result);
                // evalResult.value += "\n" + result;
                if (firstRun) {
                    setEvalResult(evalResult => evalResult + result);
                    firstRun = false;
                } else {
                    setEvalResult(evalResult => evalResult + "\n" + result);
                }
                resolve('Successfully instantiated p5.js in sandboxed iframe.');
                // resolve(result);
            }
            // window.removeEventListener("message", handleMessage);
            // document.body.removeChild(iframe);
        };
        window.addEventListener("message", handleMessage);

        iframe.srcdoc = srcdoc(window.location.origin, senderId, receiverId, src);
        document.body.appendChild(iframe);
        // const sandboxDom = document.getElementById("sandbox");
        // sandboxDom.appendChild(iframe);
    });
}
