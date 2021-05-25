const play1 = document.getElementById('play-english');
const sound1 = document.getElementById('sound-english');

play1.onclick =
  function() {
    sound1.play();
  return false;
  };

const play2 = document.getElementById('play-norwegian');
const sound2 = document.getElementById('sound-norwegian');

play2.onclick =
  function() {
    sound2.play();
  return false;
  };