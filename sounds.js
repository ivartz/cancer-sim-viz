const play1 = document.getElementById('play-english');
const sound1 = document.getElementById('sound-english');
let isPlaying1 = false;

play1.onclick =
  function() {
    if (!isPlaying1) {
      isPlaying1 = true;
      sound1.play();
    }
    else {
      isPlaying1 = false;
      sound1.pause();
    }
  return false;
  };

const play2 = document.getElementById('play-norwegian');
const sound2 = document.getElementById('sound-norwegian');
let isPlaying2 = false;

play2.onclick =
  function() {
    if (!isPlaying2) {
      isPlaying2 = true;
      sound2.play();
    }
    else {
      isPlaying2 = false;
      sound2.pause();
    }
  return false;
  };