let sound, amplitude, cnv;
let soundAmp = 0;
let soundSpec = 0;
let soundBool = true;
let arrRectsColorable;

const soundPlayer = document.getElementById("soundPlayer");
const chosenSongLabel = document.querySelector(".chosenSongLabel");

function createRandomColorArray() {
  return [
    `#${quick().r(0, 9)}${quick().r(0, 9)}0000`,
    `#00${quick().r(0, 9)}${quick().r(0, 9)}00`,
    `#0000${quick().r(0, 9)}${quick().r(0, 9)}`,
    `#${quick().r(0, 9)}${quick().r(0, 9)}00${quick().r(0, 9)}${quick().r(
      0,
      9
    )}`
  ];
}
function changeArrayColors(specValue) {
  for (let i = 0; i < createRandomColorArray().length; i++) {
    if (specValue > i * 25 && specValue < (i + 1) * 25) {
      arrRectsColorable.forEach(dot => {
        dot.bg = createRandomColorArray()[i];
      });
    }
  }
}
function preload() {
  sound = loadSound(
    "https://luisarmando-testcoder.github.io/keeper/mp3/sexual.mp3"
  );
  let chosenSong = document.getElementById("chosenSong");
  chosenSong.addEventListener("change", () => {
    if (chosenSong.files[0]) {
      sound.stop();
      sound = loadSound(chosenSong.files[0]);
    }
  });
}
function setup() {
  cnv = createCanvas(100, 100);
  amplitude = new p5.Amplitude();
  fft = new p5.FFT();
  soundPlayer.addEventListener("click", () => {
    if (soundBool) {
      sound.play();
    } else {
      sound.pause();
    }
    soundBool = !soundBool;
  });
}
function draw() {
  if (sound.isLoaded()) {
    let sounPlayerCSSRULE = getComputedStyle(soundPlayer).getPropertyValue(
      "transform"
    );
    let specAverage = 0;

    soundSpec = fft.analyze();
    soundSpec.forEach(s => {
      specAverage += s;
    });

    specAverage /= soundSpec.length;

    if (!sound.isPlaying() && !soundBool) {
      sound.play();
    } else if (sound.isPlaying()) {
      changeArrayColors(specAverage);
    }
    if (sounPlayerCSSRULE === "matrix(0, 0, 0, 0, 0, 0)") {
      soundPlayer.style.setProperty("transform", "scale(1)");
      chosenSongLabel.style.setProperty("transform", "scale(1)");
    }
  } else {
    soundPlayer.style.setProperty("transform", "scale(0)");
  }
  soundAmp = parseInt(amplitude.getLevel() * 20);
}
