# FPS采集

```
let lastTime = perfermance.now();
let frame = 0;
let lastFrameTime = perfermance.now();

const loop = time => {
  let now = perfermance.now();
  let fs = (now - lastFrameTime);
  lastFrameTime = now;
  let fps = Math.round(1000 / fs);
  frame++;

  if (now > 1000 + lastTime) {
    fps = Math.round((frame * 1000) / (now - lastTime));
    frame = 0;
    lastTime = now;
  }

  window.requestAnimationFrame(loop);
};
```