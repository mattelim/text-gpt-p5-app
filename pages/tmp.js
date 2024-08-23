<iframe width="100%" height="500" srcdoc="<!doctype html>
    <html>
      <head>
        <script src=&quot;https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.js&quot;></script>
      </head>
      <body style=&quot;background-color:#d1d5db; padding:0; margin:0; min-height: 500px;&quot;>
        <main style=&quot;display: flex; justify-content: center; align-items: center; min-height: 500px;&quot;></main>
      </body>
      <script>
        delete window.fetch;
        delete window.XMLHttpRequest;

        console.log = function(logMsg) {
          window.parent.postMessage(JSON.stringify({ logMsg }), '*');
        };

        // 创建一个画布
  function setup() {
    createCanvas(600, 600); // 创建一个600x600大小的画布
  }

  // 在画布上绘制内容
  function draw() {
  background(30); // 设置背景颜色为深色，以突显图案
  noFill(); // 不填充形状
  
  // 循环绘制多个图形，形成炫酷的图案
  for (let i = 0; i < 360; i += 10) { // 每隔10度循环
    stroke(map(i, 0, 360, 0, 255), 100, 200); // 根据角度设定颜色
    strokeWeight(2); // 设置线条的粗细

    // 计算圆形的位置和大小
    let x = width / 2 + cos(radians(i)) * (200 + 50 * sin(radians(frameCount + i))); 
    let y = height / 2 + sin(radians(i)) * (200 + 50 * sin(radians(frameCount + i))); 

    // 绘制一个圆形
    ellipse(x, y, 50 + 20 * sin(frameCount * 0.1 + radians(i)), 50 + 20 * sin(frameCount * 0.1 + radians(i))); 
  }
  }
 
      </script>
    </html>" sandbox="allow-scripts">

 </iframe>