const images = ["image/img1.jpg", "image/img2.jpg", "image/img3.webp", "image/img4.webp"];
let index = 0;

const slideImage = document.getElementById("slide-image");

function showImage(i) {
  slideImage.src = images[i];
}

function nextImage() {
  index = (index + 1) % images.length;
  showImage(index);
}
function prevImage() {
  index = (index - 1 + images.length) % images.length;
  showImage(index);
}
