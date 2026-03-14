// Send to iframe context
const sendToIframe = (event, eventName) => {
  window.dispatchEvent(new CustomEvent('STRUDEL_EVENT', {detail: {event, eventName}})); // Dispatch custom event in current window
};



stack(
s("bd? hh sd? cp").gain(0.5).lpf(1000),
s("<bd bd>*8").lpf(500).gain(0.5).fmap((event) => {
    sendToIframe(event, 'STRUDEL_B'); // Send message as side effect
    return event; // Return event unchanged for audio to continue
  }),
s("<hh hh hh hh>*4").gain(0.9).lpf(800),
n("<1 4 3 2>*16").scale("a:minor:pentatonic").s("sawtooth").gain(0.25).vib("<.5 1 2 4 8 16>").fmap((event) => {
    sendToIframe(event, 'STRUDEL_M'); // Send message as side effect
    return event; // Return event unchanged for audio to continue
  }),
note("<c a g b2>").s('supersaw').tremolo(2)
)