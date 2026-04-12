Pattern.prototype.emit = function (eventName) {
  return this.log(function (hap) {
    window.dispatchEvent(new CustomEvent('STRUDEL_EVENT', {
      detail: {
        type: 'STRUDEL_EVENT',
        val: hap.value,
        eventName
      }
    }));


    return 'Emitting: ' + eventName;
  })
}

s("[bd]*4").gain(0.5).lpf(300).emit('STRUDEL_B');