// let carousel = 0;
// showSample();

// function showSample() {
//   let i;
//   const sample = document.getElementsByClassName("Samples");
//   for (i = 0; i < sample.length; i++) {
//     sample[i].style.display = "none";
//   }
//   carousel++;
//   if (carousel > sample.length) {carousel = 1}
//   sample[carousel-1].style.display = "block";
//   setTimeout(showSample, 5000); // Change image every 5 seconds
// }

//scroll

let carousel = 0;
showSample();

function showSample() {
  let i;
  const sample = document.getElementsByClassName("Samples");
  for (i = 0; i < sample.length; i++) {
    sample[i].style.display = "none";
  }
  carousel++;
  if (carousel > sample.length) {carousel = 1}
  sample[carousel-1].style.display = "block";
  setTimeout(showSample, 5000); // Change image every 3 seconds
}