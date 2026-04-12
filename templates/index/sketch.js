// Listen for messages from the Strudel instance 
let strudelBData = {};
let strudelMData = {};
let strudelData = {};
let strudelPData = {};

function setup() {
   createCanvas(windowWidth, windowHeight);
   frameRate(20);
   angleMode(DEGREES);
}

function draw() {
   if (!strudelBData.s) {
      return
   }

   if (random(1) > 0.5) {
      background(255);
   }

   const bChars = strudelBData.s.split('');
   const bNoise = noise(getInt(bChars[0]), getInt(bChars[1]), strudelBData.cutoff);
   const mNoise = noise(strudelMData.duration, strudelMData.gain, strudelMData.room);


   const bv = map(bNoise, 0, 1, -100, 100);
   const mv = map(mNoise, 0, 1, -100, 100);

   const gridSize = 50;
   const cols = width / gridSize;
   const rows = height / gridSize;



   for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
         const x = i * gridSize;
         const y = j * gridSize;

         push();
         rectMode(CENTER);
         translate(x, y);
         rect(0, 0, gridSize * map(bNoise, 0, 1, 0.4, 2), gridSize * map(bNoise, 0, 1, 0.4, 2));
         pop();

      }
   }
}

function getInt(str) {
   return str.charCodeAt(0);
}

window.addEventListener("message", (event) => {
   if (event.data.type === "STRUDEL_EVENT") {
      if (event.data.eventName === 'B') {
         strudelBData = event.data.value;
      } else if (event.data.eventName === 'M') {
         strudelMData = event.data.value;
      } else if (event.data.eventName === 'P') {
         strudelPData = event.data.value;
      }
   }
});