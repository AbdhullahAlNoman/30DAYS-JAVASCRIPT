   let count = 0;
const countDisplay = document.getElementById("count");

function increase() {
  count++;
  countDisplay.innerText = count;
}

function decrease() {
  count--;
  countDisplay.innerText = count;
}

function reset() {
  count = 0;
  countDisplay.innerText = count;
}
