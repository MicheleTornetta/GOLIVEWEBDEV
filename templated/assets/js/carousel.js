(() => {
  const SPEED = 100;

  const carousel = document.getElementById("carousel");

  let left = 0;

  let lastCallTime = 0;

  function animate(now) {
    const delta = (now - lastCallTime) / 1000;
    lastCallTime = now;

    const firstImage = carousel.children[0];
    const width = firstImage.offsetWidth;

    if (-left >= width) {
      carousel.removeChild(firstImage);
      carousel.appendChild(firstImage);

      left += width;
    }

    carousel.style.left = left + "px";
    left -= delta * SPEED;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
