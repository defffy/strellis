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

samples('github:switchangel/pad')
samples('github:tidalcycles/dirt-samples')
samples('shabda/speech/en-US/m:this,set,is,done,yes,ah')

stack(
  s("bd*4, hh*16").bank("RolandTR808").emit('STRUDEL_B'),
)

// Finish
s("this set is done yes ah").slow(1.75).room(5)