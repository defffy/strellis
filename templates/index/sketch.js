// Listen for messages from the Strudel instance 
let strudelBData = {};
let strudelMData = {};
let strudelData = {};
let colorPairs;


window.addEventListener("message", (event) => {
   if (event.data.type === "STRUDEL_EVENT") {
      if (event.data.eventName === 'STRUDEL_B') {
         strudelBData = event.data.value;
      } else if (event.data.eventName === 'STRUDEL_M') {
         strudelMData = event.data.value;
      } else {

         strudelData = event.data.value;
      }
   }
});

function setup() {
   createCanvas(windowWidth, windowHeight);
}

function draw() {
   if (!strudelBData.s) {
      return;
   }

   const [bInt1, bInt2] = getSoundValues(strudelBData.s);
   const bNoise = noise(bInt1, bInt2, strudelBData.cutoff);

   console.log(bNoise);
}

function getInt(str) {
   return str.charCodeAt(0);
}

function getSoundValues(str) {
   return str.split('').map(note => {
      return getInt(note);
   })
}