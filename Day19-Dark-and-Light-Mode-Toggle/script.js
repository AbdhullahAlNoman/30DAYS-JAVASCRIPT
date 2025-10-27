const toggleBtn = document.getElementById("toggleBtn");
const icon = document.getElementById("icon");
const body = document.body;

// localStorage থেকে থিম লোড
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark-mode");
  icon.textContent = "🌞";
  toggleBtn.innerHTML = '<span id="icon">🌞</span> Switch to Light Mode';
}

// বাটনে ক্লিক করলে থিম বদলাবে
toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    icon.textContent = "🌞";
    toggleBtn.innerHTML = '<span id="icon">🌞</span> Switch to Light Mode';
    localStorage.setItem("theme", "dark");
  } else {
    icon.textContent = "🌙";
    toggleBtn.innerHTML = '<span id="icon">🌙</span> Switch to Dark Mode';
    localStorage.setItem("theme", "light");
  }
});