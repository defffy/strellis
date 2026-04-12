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
 s("swpad:10").scrub("{0.1!2 .25@3 0.7!2 <0.8:1.5>}%8").emit('M'), 
  s("[bd]*4").gain(0.5).lpf(300).emit('B')
)

// Finish
// s("this set is done yes ah").slow(1.5)