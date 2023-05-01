'use client';

import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import TextInput from "./components/TextInput";
import Editor from "./components/Editor";
import RunContainer from "./components/RunContainer";

export default function Home() {
  const [result, setResult] = useState("// type a text prompt above and click 'Generate p5.js code'");
  const [textInput, setTextInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [sandboxRunning, setSandboxRunning] = useState(false);
  const [logMsg, setlogMsg] = useState("");
  const [selVal, setSelVal] = useState("");
  const [freeGen, setFreeGen] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const MAX_FREE_ARTICLES = 5;

  useEffect(() => {
      // Retrieve the last access date and reset the free article count if necessary
      const lastAccessDate = localStorage.getItem('lastAccessDate');
      const today = new Date().toLocaleDateString();
      if (lastAccessDate !== today) {
        localStorage.setItem('lastAccessDate', today);
        localStorage.setItem('freeGen', '5');
        setFreeGen(5);
      } else {
        // Retrieve the free article count from local storage
        const count = parseInt(localStorage.getItem('freeGen'));
        if (!isNaN(count)) {
          setFreeGen(count);
        }
      }
  }, []);

  function handleGenClick() {
    // if (freeGen >= MAX_FREE_ARTICLES) {
    //   // Redirect the user to the login page or subscription page
    //   window.location.href = '/login';
    // } else {
      // Increment the free article count and save it to local storage
      localStorage.setItem('freeGen', `${freeGen - 1}`);
      setFreeGen(freeGen - 1);
      // Show the article content
    // }
  }

  // useEffect(() => {
  //   const freeGen = JSON.parse(localStorage.getItem('freeGen'));
  //   setFreeGen(freeGen || 5);
  // }, []);

  // if (typeof window !== 'undefined') {
  //   console.log('we are running on the client')
  //   const saved = localStorage.getItem("name");
  //   const initialValue = JSON.parse(saved);
  //   setFreeGen(initialValue || 0);
  //   // return initialValue || "";
  // } else {
  //   console.log('we are running on the server');
  // }
  // const [freeGen, setFreeGen] = useState(() => {
  //   // getting stored value
  //   const saved = localStorage.getItem("name");
  //   const initialValue = JSON.parse(saved);
  //   return initialValue || "";
  // });

  const egArray = [
    {
      value: "Conway's Game of Life",
      prompt: "Conway's Game of Life",
      code: `function setup() {
          createCanvas(400, 400);
          background(255);
          frameRate(10);
          cells = Array(floor(width / 20));
          for (let i = 0; i < cells.length; i++) {
            cells[i] = Array(floor(height / 20));
            for (let j = 0; j < cells[i].length; j++) {
              cells[i][j] = floor(random(2));
            }
          }
        }
        function draw() {
          background(255);
          for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[i].length; j++) {
              let x = i * 20;
              let y = j * 20;
              if (cells[i][j] == 1) {
                fill(0);
                stroke(0);
                rect(x, y, 20, 20);
              }
            }
          }
          let nextGen = Array(cells.length);
          for (let i = 0; i < cells.length; i++) {
            nextGen[i] = Array(cells[i].length);
            for (let j = 0; j < cells[i].length; j++) {
              let state = cells[i][j];
              let neighbours = countNeighbours(cells, i, j);
              if (state == 0 && neighbours == 3) {
                nextGen[i][j] = 1;
              } else if (state == 1 && (neighbours < 2 || neighbours > 3)) {
                nextGen[i][j] = 0;
              } else {
                nextGen[i][j] = state;
              }
            }
          }
          cells = nextGen;
        }
        function countNeighbours(cells, x, y) {
          let sum = 0;
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              let col = (x + i + cells.length) % cells.length;
              let row = (y + j + cells[0].length) % cells[0].length;
              sum += cells[col][row];
            }
          }
          sum -= cells[x][y];
          return sum;
        }`
    },
    {
      value: "2D flocking animation",
      prompt: "2D flocking animation",
      code: `const flock = [];
  
      function setup() {
        createCanvas(800, 600);
        
        for(let i = 0; i < 100; i++) {
          flock.push(new Boid());
        }
      }
      
      function draw() {
        background(255);
        
        for(let boid of flock) {
          boid.flock(flock);
          boid.update();
          boid.edges();
          boid.show();
        }
      }
      
      class Boid {
        constructor() {
          this.position = createVector(random(width), random(height));
          this.velocity = p5.Vector.random2D();
          this.velocity.setMag(random(2, 4));
          this.acceleration = createVector();
          this.maxForce = 0.2;
          this.maxSpeed = 4;
        }
        
        flock(boids) {
          let alignment = createVector();
          let cohesion = createVector();
          let separation = createVector();
          
          let perceptionRadius = 50;
          let total = 0;
          
          for(let other of boids) {
            let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            
            if(other != this && distance < perceptionRadius) {
              alignment.add(other.velocity);
              cohesion.add(other.position);
              separation.add(p5.Vector.sub(this.position, other.position));
              total++;
            }
          }
          
          if(total > 0) {
            alignment.div(total);
            alignment.setMag(this.maxSpeed);
            alignment.sub(this.velocity);
            alignment.limit(this.maxForce);
            
            cohesion.div(total);
            cohesion.sub(this.position);
            cohesion.setMag(this.maxSpeed);
            cohesion.sub(this.velocity);
            cohesion.limit(this.maxForce);
            
            separation.div(total);
            separation.setMag(this.maxSpeed);
            separation.sub(this.velocity);
            separation.limit(this.maxForce);
          }
          
          this.acceleration.add(alignment);
          this.acceleration.add(cohesion);
          this.acceleration.add(separation);
        }
        
        update() {
          this.velocity.add(this.acceleration);
          this.velocity.limit(this.maxSpeed);
          this.position.add(this.velocity);
          this.acceleration.mult(0);
        }
        
        show() {
          strokeWeight(8);
          stroke(55, 139, 255);
          point(this.position.x, this.position.y);
        }
        
        edges() {
          if(this.position.x > width) this.position.x = 0;
          else if(this.position.x < 0) this.position.x = width;
          
          if(this.position.y > height) this.position.y = 0;
          else if(this.position.y < 0) this.position.y = height;
        }
      }`
    },
    {
      value: "3D forms panning",
      prompt: "Panning around a 3d scene with spheres, cubes, pyramids",
      code: `const spheres = [];
      const cubes = [];
      const pyramids = [];
      
      function setup() {
        createCanvas(400, 400, WEBGL);
        for (let i = 0; i < 5; i++) {
          spheres.push(new Sphere(random(-100, 100), random(-100, 100), random(-100, 100)));
          cubes.push(new Cube(random(-100, 100), random(-100, 100), random(-100, 100)));
          pyramids.push(new Pyramid(random(-100, 100), random(-100, 100), random(-100, 100)));
        }
      }
      
      function draw() {
        background(200);
        noStroke();
        lights();
        rotateX(frameCount * 0.01);
        rotateY(frameCount * 0.01);
        for (let i = 0; i < 5; i++) {
          spheres[i].show();
          cubes[i].show();
          pyramids[i].show();
        }
      }
      
      class Sphere {
        constructor(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        show() {
          push();
          translate(this.x, this.y, this.z);
          sphere(20);
          pop();
        }
      }
      
      class Cube {
        constructor(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        show() {
          push();
          translate(this.x, this.y, this.z);
          box(40);
          pop();
        }
      }
      
      class Pyramid {
        constructor(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
        }
        show() {
          push();
          translate(this.x, this.y, this.z);
          beginShape();
          vertex(0, -20, 0);
          vertex(10, 10, -10);
          vertex(-10, 10, -10);
          endShape(CLOSE);
          pop();
        }
      }`
    },
    {
      value: "Radial lines on click",
      prompt: "A line in a random direction starts from where the user presses",
      code: `function setup() {
        createCanvas(400, 400);
      }
      
      function draw() {
        strokeWeight(2);
        if (mouseIsPressed) {
          let angle = random(0, 360);
          let dx = cos(angle);
          let dy = sin(angle);
          line(mouseX, mouseY, mouseX + dx * 50, mouseY + dy * 50);
        }
      }`
    },
    {
      value: "Gravity balls on click",
      prompt: "every click creates a bouncing ball that eventually rests on the floor",
      code: `function setup() {
        createCanvas(400,400);
        rectMode(CENTER);
      }
      
      let balls = [];
      
      function draw() {
        background(200);
        for(let ball of balls) {
          ball.show();
          ball.move();
          ball.bounce();
          ball.stop();
        }
      }
      
      function mousePressed() {
        balls.push(new Ball(mouseX,mouseY,random(10,30)));
      }
      
      class Ball {
        constructor(x,y,r) {
          this.pos = createVector(x,y);
          this.vel = createVector(random(-3,3),random(-8,-3));
          this.acc = createVector(0,0.1);
          this.r = r;
          this.rest = false;
        }
        
        show() {
          strokeWeight(2);
          stroke(0);
          fill(255,0,0);
          ellipse(this.pos.x,this.pos.y,this.r*2,this.r*2);
        }
        
        move() {
          if(!this.rest) {
            this.vel.add(this.acc);
            this.pos.add(this.vel);
          }
        }
        
        bounce() {
          if(this.pos.y+this.r > height) {
            this.vel.y *= -0.8;
            this.pos.y = height-this.r;
          }
        }
        
        stop() {
          if(this.vel.y < 0.1 && this.pos.y+this.r >= height) {
            this.rest = true;
            this.vel = createVector(0,0);
            this.acc = createVector(0,0);
          }
        }
      }`
    },
    {
      value: "Bouncing balls on click",
      prompt: "bouncing balls everywhere",
      code: `let balls = [];

      function setup() {
        createCanvas(windowWidth, windowHeight);
      }
      
      function draw() {
        background(220);
      
        for (let i = 0; i < balls.length; i++) {
          balls[i].update();
          balls[i].show();
        }
      }
      
      class Ball {
        constructor(x, y, speedX, speedY, size) {
          this.x = x;
          this.y = y;
          this.speedX = speedX;
          this.speedY = speedY;
          this.size = size;
        }
      
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
      
          if (this.x < 0 || this.x > width) {
            this.speedX *= -1;
          }
          if (this.y < 0 || this.y > height) {
            this.speedY *= -1;
          }
        }
      
        show() {
          noStroke();
          fill(random(255), random(255), random(255));
          ellipse(this.x, this.y, this.size);
        }
      }
      
      function mousePressed() {
        balls.push(new Ball(mouseX, mouseY, random(-10, 10), random(-10, 10), random(20, 50)));
      }`
    },
    {
      value: "Color noise static",
      prompt: "CRT TV static",
      code: `const numRects = 500;
      const rectWidth = 2;
      const rectHeight = 2;
      let rects = [];
      
      function setup() {
        createCanvas(windowWidth, windowHeight);
        for (let i = 0; i < numRects; i++) {
          rects.push({
            x: random(width),
            y: random(height),
            r: random(255),
            g: random(255),
            b: random(255)
          });
        }
        background(0);
      }
      
      function draw() {
        for (let i = 0; i < numRects; i++) {
          noStroke();
          fill(rects[i].r, rects[i].g, rects[i].b);
          rect(rects[i].x, rects[i].y, rectWidth, rectHeight);
          if (random(100) < 1) {
            rects[i].x = random(width);
            rects[i].y = random(height);
          }
        }
      }`
    },
    {
      value: "Zen ripples",
      prompt: "perlin noise moving ripples, super zen",
      code: `const ripples = [];
  
      function setup() {
        createCanvas(windowWidth, windowHeight);
        stroke(255);
        noFill();
        for (let i = 0; i < 10; i++) {
          ripples.push(new Ripple(random(width), random(height)));
        }
      }
      
      function draw() {
        background(0);
        for (let i = 0; i < ripples.length; i++) {
          ripples[i].update();
          ripples[i].display();
        }
      }
      
      class Ripple {
        constructor(x, y) {
          this.pos = createVector(x, y);
          this.r = 50;
          this.maxR = 500;
        }
      
        update() {
          this.r += noise(frameCount / 100, this.pos.y / 100) * 5;
          if (this.r > this.maxR) {
            this.r = 0;
            this.pos.x = random(width);
            this.pos.y = random(height);
          }
        }
      
        display() {
          ellipse(this.pos.x, this.pos.y, this.r, this.r / 2);
        }
      }`
    },
  ];

  useEffect(() => {
    let ranOnce = false;

    const handler = event => {
      const data = JSON.parse(event.data)
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
  }, [result, sandboxRunning])

  function textInputChange(event) {
    event.preventDefault();
    setTextInput(event.target.value);
    setCharCount(event.target.value.length);
  }

  async function textInputSubmit(event) {
    event.preventDefault();
    setlogMsg("");
    setWaiting(true);
    setResult("// Please be patient, this may take a while...");
    setSelVal("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_REMOTE_API_URL || ''}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        setWaiting(false);
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.code);
      setSandboxRunning(true);
      setWaiting(false);
      handleGenClick();
    } catch(error) {
      console.error(error);
      alert(error.message);
      setWaiting(false);
    }
  }

  const editorChange = useCallback((value, viewUpdate) => {
    setResult(value);
  }, []);
  
  function runClickPlay(event) {
    event.preventDefault();
    setSandboxRunning(true);
  }

  function runClickStop(event) {
    event.preventDefault();
    setSandboxRunning(false);
    setlogMsg("");
  }

  function textSelectChange(event) {
    setSelVal(event.target.value);
    event.preventDefault();
    const search = event.target.value;
    const selectedEg = egArray.find((obj) => obj.value === search);
    if(selectedEg) {
      setTextInput(selectedEg.prompt);
      setResult(selectedEg.code);
      setSandboxRunning(true);
    } else {
      setTextInput('');
      setResult('');
      setSandboxRunning(false);
    }
  }

// const maxFreeGens = 5;

// // Check if the user is logged in
// if (userLoggedIn) {
//   // Allow unlimited access to articles
// } else {
//   // Retrieve the last access date and reset the free article count if necessary
//   const lastAccessDate = localStorage.getItem('lastAccessDate');
//   const today = new Date().toLocaleDateString();
//   if (lastAccessDate !== today) {
//     localStorage.setItem('lastAccessDate', today);
//     localStorage.setItem('freeGenCount', 0);
//   }
//   // Check if the user has exceeded the maximum number of free articles
//   const freeGenCount = localStorage.getItem('freeGenCount');
//   if (freeGenCount && parseInt(freeGenCount) >= maxFreeGens) {
//     // Redirect the user to the login page or subscription page
//     window.location.href = '/login';
//   } else {
//     // Increment the free article count and save it to local storage
//     localStorage.setItem('freeGenCount', freeGenCount ? parseInt(freeGenCount) + 1 : 1);
//     // Allow access to the article
//   }
// }

// const maxFreeGens = 5;

// // Check if the user is logged in
// if (userLoggedIn) {
//   // Allow unlimited access to articles
// } else {
//   // Retrieve the last access date and reset the free article count if necessary
//   const lastAccessDate = localStorage.getItem('lastAccessDate');
//   const today = new Date().toLocaleDateString();
//   if (lastAccessDate !== today) {
//     localStorage.setItem('lastAccessDate', today);
//     localStorage.setItem('freeGenCount', 0);
//   }
//   // Check if the user has exceeded the maximum number of free articles
//   const freeGenCount = localStorage.getItem('freeGenCount');
//   if (freeGenCount && parseInt(freeGenCount) >= maxFreeGens) {
//     // Redirect the user to the login page or subscription page
//     window.location.href = '/login';
//   } else {
//     // Increment the free article count and save it to local storage
//     localStorage.setItem('freeGenCount', freeGenCount ? parseInt(freeGenCount) + 1 : 1);
//     // Allow access to the article
//   }
// }

  return (
    <>
      <Head>
        <title>Text-GPT-p5</title>
        <meta name="description" content="Turn text into p5.js code using GPT and display it" />
        <link rel="icon" href="/gpt-p5.svg" />
      </Head>
      <div className="w-full p-5 flex flex-col gap-5 max-w-2xl min-w-[320px]">
        <header className="flex gap-3 justify-between">
          <div className="flex gap-3">
            <img src="gpt-p5-emerald.png" alt="logo" className="h-11 w-11 p-2 bg-white rounded-full shadow shadow-emerald-600/30 overflow-visible"/>
          <div className="text-gray-700">
            <h1 className="font-semibold text-xl ">
              Text-GPT-p5
            </h1>
            <p>A text to p5.js generative editor powered by GPT-3.5 ✨</p>
          </div>
          </div>
          <div className="flex flex-col gap-4 xs:flex-row xs:gap-3">
            <a href="https://github.com/mattelim/text-gpt-p5-app" target="_blank" className="xs:order-last"><img src="github-mark.svg" alt="github" className="w-8 aspect-square opacity-30 hover:opacity-100 xs:w-6"/></a>
            <a href="https://www.buymeacoffee.com/mattelim" target="_blank"><img src="bmc-logo.svg" alt="buy me a coffee" className="w-8 aspect-square opacity-30 hover:opacity-100 xs:w-6"/></a>
          </div>
        </header>
        <TextInput key="textinput-01" textInput={textInput} onChange={textInputChange} onSubmit={textInputSubmit} waiting={waiting} selectVal={selVal} selectChange={textSelectChange} egArray={egArray} freeGen={freeGen} charCount={charCount}/>
        <Editor key="editor-01" result={result} onChange={editorChange} waiting={waiting}/>
        <RunContainer key="runcont-01" sandboxRunning={sandboxRunning} clickPlay={runClickPlay} clickStop={runClickStop} result={result} logMsg={logMsg} waiting={waiting}/>
        <p className="text-gray-400 text-sm text-center mt-3">Made by <a href="https://mattelim.com" target="_blank" className="underline">Matte Lim</a></p>
      </div>
    </>
  );
}
