// Listen for messages from the Strudel instance 
let strudelBData = {};
let strudelMData = {};
let strudelData = {};
let colorPairs;

const COLUMNS_COUNT = 8

window.addEventListener("message", (event) => {
   if (event.data.type === "STRUDEL_EVENT") {
      if (event.data.eventName === 'STRUDEL_B') {
         strudelBData = event.data.val;
      } else if (event.data.eventName === 'STRUDEL_M') {
         strudelMData = event.data.val;
      } else {

         strudelData = event.data.val;
      }
   }
});

function setup() {
   createCanvas(windowWidth, windowHeight);

   colorPairs = [
      [color('#FC427B'), color('#9AECDB')],
      [color('#D6A2E8'), color('#F8EFBA')],
      [color('#55E6C1'), color('#F97F51')],
      [color('#1B9CFC'), color('#CAD3C8')],
      [color('#9AECDB'), color('#EAB543')],
      [color('#BDC581'), color('#2C3A47')],
      [color('#3B3B98'), color('#6D214F')],
      [color('#F8EFBA'), color('#FEA47F')],
   ]
}

function draw() {
   const bNoise = map(getNoiseValueFromNote(strudelBData.note), 0, 1, 0, random(200));
   const mNoise = map(getNoiseValueFromNote(strudelMData.note), 0, 1, random(100), random(255));

   const colorTransition = map(sin(frameCount * 0.05 * bNoise), -1, 1, 0, 1);
   const xTransition = map(sin((frameCount * 0.5 * mNoise)), -1, 1, 0, 1);

   let colorIndex = 0;

   for (let x = 0; x < width; x += width / COLUMNS_COUNT) {
      const palette = colorPairs[colorIndex];
      const rectFill = lerpColor(palette[0], palette[1], colorTransition);
      push();
      noStroke();
      rectFill.setAlpha(bNoise);
      fill(rectFill);
      let baseX = x;
      const endX = x + 200;
      const xVal = lerp(baseX, endX, xTransition);

      translate(xVal, 0)

      if (random(1) > 0.5) {

         rectMode(CENTER);
      } else {
         rectMode(CORNER);
      }

      scale(1 + bNoise * 0.01, 1 + mNoise * 0.01);
      rect(0, 0, width / COLUMNS_COUNT, height);
      pop();

      colorIndex++;
   }
}

/**
* This helper function takes a note and converts it to a noise value.
* If the note is a number, it simply returns the noise value with that number.
* If the note is a string (like "C4"), it splits the note into its name and octave, 
* converts the name to a numerical value, and then returns the noise value based on those parameters.
*/
function getNoiseValueFromNote(note) {
   if (!note) {
      return 1;
   }

   if (typeof note === 'number') {
      return noise(note)
   }


   // Split the note at the number 
   const noteParts = note.match(/([a-gA-G#b]+)(\d+)/);

   const name = noteParts[1];
   const octave = noteParts[2];

   const nameValues = name?.split('').map(letter => {
      const letterPos = letter.charCodeAt(0) - 64;
      return letterPos
   }
   );


   if (!octave && nameValues?.length === 0) {
      return noise(random(100), random(100));
   }

   if (nameValues?.length === 0) {
      return noise(random(100), octave);
   }

   if (!octave) {
      return noise(nameValues[0], random(100));
   }

   if (nameValues?.length > 1) {
      return noise(nameValues[0], nameValues[1], octave);
   } else {
      return noise(nameValues[0], octave);
   }
}


