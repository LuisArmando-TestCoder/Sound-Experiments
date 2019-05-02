function gooeyCanvas(
  elem = "#gooeyCanvas",
  w = window.innerWidth,
  h = window.innerHeight
) {
  function managedSize() {
    c.width = w;
    c.height = h;
    if (w === window.innerWidth) {
      window.addEventListener("resize", () => {
        c.width = window.innerWidth;
        posibleX = [c.width / 4, c.width - c.width / 4];
      });
    }
    if (h === window.innerHeight) {
      window.addEventListener("resize", () => {
        c.height = window.innerHeight;
        posibleY = [c.height / 2, c.height - (c.height / 2) * 2];
      });
    }
  }
  function createElem(arr, obj) {
    arr.push(obj);
  }
  function drawElems(arr) {
    for (let i of arr) {
      ctx.beginPath();
      ctx.fillRect(i.x, i.y, i.w, i.h);
      switch (i.d) {
        case "u":
          i.x += i.v + soundAmp;
          i.y += i.v + soundAmp;
          break;
        case "d":
          i.x -= i.v + soundAmp;
          i.y -= i.v + soundAmp;
          break;
        case "r":
          i.x -= i.v + soundAmp;
          i.y += i.v + soundAmp;
          break;
        case "l":
          i.x += i.v + soundAmp;
          i.y -= i.v + soundAmp;
      }
      if (i.x + i.w < 0 || i.x - i.w > c.width) {
        i.x = c.width / 2;
      }
      if (i.y + i.h < 0 || i.y - i.h > c.height) {
        i.y = c.height / 2;
      }
      ctx.fillStyle = i.bg;
    }
  }
  function animate() {
    ctx.clearRect(0, 0, c.width, c.height);
    drawElems(arrRects);
    window.requestAnimationFrame(animate);
  }
  const c = document.querySelector(elem);
  const ctx = c.getContext("2d");
  const directionArr = ["u", "d", "l", "r"];
  let posibleX = [c.width / 4, c.width - c.width / 4];
  let posibleY = [c.height / 2, c.height - (c.height / 2) * 2];
  let arrRects;
  let createRects;
  (createRects = function() {
    arrRects = [];
    for (let a = 0; a < 500; a++) {
      const widthSize = quick().r(5, 15);
      const heightSize = quick().r(10, 25);
      createElem(arrRects, {
        x: posibleX[quick().r(0, posibleX.length - 1)],
        y: posibleY[quick().r(0, posibleY.length - 1)],
        w: widthSize,
        h: heightSize,
        v: (widthSize + heightSize) * 0.03,
        d: directionArr[quick().r(0, directionArr.length - 1)],
        bg: `#${quick().r(0, 9)}${quick().r(0, 9)}0`
      });
    }
    arrRectsColorable = arrRects;
  })();
  window.addEventListener("keydown", createRects);
  animate();
  managedSize();
}

gooeyCanvas("#gooeyCanvas", window.innerWidth, 300);
