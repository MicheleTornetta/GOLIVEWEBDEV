// let carousel = 0;
// showSample();

// function showSample() {
//   let i;
//   const sample = document.getElementsByClassName("samples");
//   for (i = 0; i < sample.length; i++) {
//     sample[i].style.display = "none";
//   }
//   carousel++;
//   if (carousel > sample.length) {carousel = 1}
//   sample[carousel-1].style.display = "block";
//   setTimeout(showSample, 5000); // Change image every 5 seconds
// }

//scroll
(() => {
  let carousel = 0;
  const SHOW_DURATION_MS = 7000;
  showSample();

  function showSample() {
    const sample = document.getElementsByClassName("samples");
    for (let i = 0; i < sample.length; i++) {
      sample[i].style.display = "none";
    }

    const thisSample = sample[carousel];
    thisSample.style.display = "block";
    thisSample.classList.add("fade");
    thisSample.classList.remove("fade-out");

    setTimeout(() => {
      thisSample.classList.remove("fade");
      thisSample.classList.add("fade-out");
    }, SHOW_DURATION_MS - 1000);

    carousel++;
    if (carousel >= sample.length) {
      carousel = 0;
    }
    setTimeout(showSample, SHOW_DURATION_MS); // Change image every 3 seconds
  }
})();
