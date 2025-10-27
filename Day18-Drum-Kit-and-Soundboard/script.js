// 🔊 ড্রাম সাউন্ড ম্যাপিং
const sounds = {
  A: "sounds/drums2.mp3",
  S: "sounds/drums1.mp3",
  D: "sounds/drums3.mp3",
  F: "sounds/drums4.mp3",
  G: "sounds/drums5.mp3",
  H: "sounds/drums6.mp3",
};

// 🎹 কী প্রেস করলে বাজবে
document.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();
  playSound(key);
});

// 🖱 বাটনে ক্লিক করলে বাজবে
document.querySelectorAll(".drum").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-key");
    playSound(key);
  });
});

// 🎵 সাউন্ড প্লে ফাংশন
function playSound(key) {
  const sound = sounds[key];
  if (!sound) return;

  const audio = new Audio(sound);
  audio.currentTime = 0;
  audio.play();

  const button = document.querySelector(`.drum[data-key="${key}"]`);
  if (button) {
    button.classList.add("playing");
    setTimeout(() => button.classList.remove("playing"), 150);
  }
}