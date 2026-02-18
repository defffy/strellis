// Send to iframe context
const dispatchStrudelEvent = (event) => {
  window.dispatchEvent(new CustomEvent('STRUDEL_EVENT', {detail: event})); // Dispatch custom event in current window
};

// Use it in your pattern chain
note("C3 E3 G3").s("sine")
  .fmap((event) => {
    dispatchStrudelEvent(event); // Send message as side effect
    return event; // Return event unchanged for audio to continue
  })
