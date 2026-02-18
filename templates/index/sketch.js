// Listen for messages from the Strudel instance 
let strudelData = {};

window.addEventListener("message", (event) => {
  if (event.data.type === "STRUDEL_EVENT") {
    strudelData = event.data.val; // Store the received data for use in the sketch
  }
});


// Any visualization code can go here, using the strudelData object to access the received data

