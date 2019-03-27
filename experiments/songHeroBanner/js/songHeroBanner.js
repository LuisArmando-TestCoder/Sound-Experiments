(function() {
  function create(array, obj) {
    array.push(obj);
  }
  function drawShapes(array, func) {
    function circles() {
      array.forEach(obj => {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);
        if (typeof func) func(obj);
      });
    }
    function rects() {
      array.forEach(obj => {
        if (typeof func) func(obj);
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      });
    }
    return {
      circles: circles,
      rects: rects
    };
  }
  function updateShapes(array, func) {
    array.forEach(obj => {
      func(obj);
    });
  }
  function appendCanvas(parent) {
    const cnv = document.createElement("canvas");
    quicker().canvasManageSize(cnv);
    parent.appendChild(cnv);
    return cnv;
  }
  function clearFrame(ctx) {
    ctx.clearRect(0, 0, c.width, c.height);
  }
  function animate() {
    clearFrame(ctx);

    drawShapes(circles, obj => {
      ctx.fillStyle = obj.color;
      ctx.fill();
    }).circles();

    drawShapes(audioBars, obj => {
      ctx.fillStyle = obj.color;
      ctx.fill();
    }).rects();
    let barIndex = 0;
    const _size = 7,
      _spacing = 2;
    updateShapes(audioBars, obj => {
      obj.x =
        c.width / 2 +
        barIndex * (_size + _spacing) -
        (barsAmount * _size) / 2 -
        (_spacing * barsAmount) / 2;
      obj.y = c.height / 2;
      if (songContext) {
        obj.height = -songContext.getFrequency().array[barIndex];
        barIndex++;
      }
    });

    updateShapes(circles, obj => {
      obj.x += 0.05 * obj.r;
      let frequency = 0;
      if (songContext) {
        let audioArray = songContext.getFrequency().array;
        frequency = audioArray.reduce((a, b) => a + b) * audioArray.length;
      }
      if (obj.x - obj.r > c.width) {
        obj.x = -obj.r;
        obj.y = quicker().makeIntegerRandom(0, c.height);
      }
      obj.r = obj.size + frequency * 0.000001;
      obj.color = `rgba(255, 255, 255, 
      ${obj.opacity.number(10) * 0.025})`;
    });

    ctx.beginPath();
    ctx.stroke();
    ctx.strokeStyle = "#ffffbf";
    requestAnimationFrame(animate);
  }
  function repeat(times, func) {
    for (let i = 0; i < times; i++) {
      func(i);
    }
  }
  function moveAround(n) {
    let direction = n / quicker().makeFloatingRandom(50, 100);
    function number(max) {
      if (n > max || n < 0) direction = -direction;
      n += direction;
      return n;
    }
    return {
      number: number
    };
  }
  const c = appendCanvas(document.getElementById("starsCnvParent"));
  const ctx = c.getContext("2d");
  const circles = [];
  const audioBars = [];
  const nodesAmount = 89,
    barsAmount = 21;
  const startSongBtn = document.getElementById("startSong");

  let audioFlag = false;
  let songContext = 0;
  let audio = new Audio();
  audio.src = "calm00.mp3";

  repeat(nodesAmount, i => {
    let size = quicker().makeFloatingRandom(0.1, 30); // 30 for calmness
    let opacity = moveAround(quicker().makeIntegerRandom(1, 9));
    create(circles, {
      x: quicker().makeIntegerRandom(0, c.width - size * 2),
      y: quicker().makeIntegerRandom(0, c.height - size * 2),
      r: size,
      size: size,
      opacity: opacity,
      color: `rgba(255, 255, 255, ${opacity.number(10) * 0.1})`,
      velocity: quicker().makeIntegerRandom(3, 6) * size
    });
  });

  repeat(barsAmount, i => {
    const _size = 7,
      _spacing = 2;
    create(audioBars, {
      x:
        c.width / 2 +
        i * (_size + _spacing) -
        (barsAmount * _size) / 2 -
        (_spacing * barsAmount) / 2,
      y: c.height / 2,
      width: _size,
      height: songContext,
      color: "rgb(255, 255, 255)"
    });
  });

  // startSongBtn.style.setProperty('transform', 'scale(0)');
  // startSongBtn.style.setProperty('transform', 'scale(1)');
  startSongBtn.addEventListener("click", () => {
    if (!songContext) songContext = quicker().analyseAudio(audio);
    if (!audioFlag) {
      audio.play();
      startSongBtn.style.setProperty("transform", "scale(0.25)");
      startSongBtn.style.setProperty("border-radius", "0");
    } else {
      audio.pause();
      startSongBtn.style.setProperty("transform", "scale(1)");
      startSongBtn.style.setProperty("border-radius", "50%");
    }
    audioFlag = !audioFlag;
  });
  animate();
  // quicker().showFrameRate();
})();
// https://luisarmando-testcoder.github.io/keeper/mp3/calm00.mp3
