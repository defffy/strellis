const e = (value, eventName) => {

  const msg = {
    type: "STRUDEL_EVENT",
    val: value,
    eventName: eventName,
  };
  window.dispatchEvent(new CustomEvent('STRUDEL_EVENT', { detail: msg }));

}

stack(
  s("bd? hh sd? cp")
    .gain(0.5)
    .lpf(1000),
  s("bd? hh sd? cp").log(value => {
    e(value, 'STRUDEL_B')
    return 'EMIT STRUDEL_B'
  }),
  n("<1 4 3 2>*16")
    .scale("a:minor:pentatonic")
    .s("sawtooth")
    .gain(0.25),
  n("<1 4 3 2>*16")
    .scale("a:minor:pentatonic")
    .s("sawtooth")
    .log(value => {
      e(value, 'STRUDEL_M')
      return 'EMIT STRUDEL_M'
    })
);
