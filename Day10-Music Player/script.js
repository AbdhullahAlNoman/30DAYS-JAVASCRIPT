const audio = document.getElementById("audio");
const title = document.getElementById("song-title");
const progress = document.getElementById("progress");

const songs = [
  { name: "Song 1", path: "music/retro-lounge-389644.mp3" },
  { name: "Song 2", path: "music/running-night-393139.mp3" },
  { name: "Song 3", path: "music/vlog-beat-background-349853.mp3" },
];

let currentSong = 0;

function loadSong(index) {
  audio.src = songs[index].path;
  title.innerText = songs[index].name;
  audio.load();
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function prevSong() {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  loadSong(currentSong);
  audio.play();
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  loadSong(currentSong);
  audio.play();
}

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

function seekSong() {
  audio.currentTime = (progress.value / 100) * audio.duration;
}

const playBtn = document.getElementById("play-btn");

function togglePlay() {
  if (audio.paused) {
    audio.play();
    playBtn.innerText = "⏸";
  } else {
    audio.pause();
    playBtn.innerText = "▶";
  }
}

audio.addEventListener("ended", () => {
  nextSong();
  playBtn.innerText = "▶";
});


audio.addEventListener("ended", nextSong);

loadSong(currentSong);
