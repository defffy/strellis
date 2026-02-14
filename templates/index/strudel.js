// Send to iframe context
const sendToIframe = (event) => {
  const iframe = document.querySelector("iframe");

  if(iframe) {
    iframe.contentWindow.postMessage({type: 'STRUDEL_EVENT', val: event}, "*");
  }
};

// Use it in your pattern chain
note("C3 E3 G3").s("sine")
  .fmap((event) => {
    sendToIframe(event); // Send message as side effect
    return event; // Return event unchanged for audio to continue
  })
  .play();
