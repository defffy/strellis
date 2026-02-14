// Listen for messages from the Strudel instance 
let strudelData = {};

window.addEventListener("message", (event) => {
  if (event.data.type === "STRUDEL_EVENT") {
    strudelData = event.data.val; // Store the received data for use in the sketch
  }

});

function setup() {
   createCanvas(windowWidth, windowHeight);
}

function draw(){
  console.log(strudelData); // Log the received data to verify it's working
   background("blue");
   fill(getFillFromNote(strudelData.note));
    const scale = getScaleFromNote(strudelData.note);
    
   const n = noise(frameCount * 0.01);
   ellipse(windowWidth * n, windowHeight * n, 50 * scale, 50 * scale);
}

function getScaleFromNote(note) {
  if(note === "C3") return 1;
  if(note === "G3") return 2;
  if(note === "E3") return 0.5;
   return 1;
}

function getFillFromNote(note) {
  if(note === "C3") return color(255, 0, 0);
  if(note === "G3") return color(0, 255, 0);
  if(note === "E3") return color(0, 0, 255);
   return color(255);
}
