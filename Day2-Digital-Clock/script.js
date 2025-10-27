// script.js
function pad(n){ return n < 10 ? '0' + n : n; }

function updateClock(){
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const isAM = hours < 12;

  // 12-hour format conversion
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;

  const timeStr = `${pad(displayHour)}:${pad(minutes)}:${pad(seconds)}`;
  const ampmStr = isAM ? 'AM' : 'PM';

  document.getElementById('time').textContent = timeStr;
  document.getElementById('ampm').textContent = ampmStr;

  // Date string like: Sunday, Oct 26, 2025
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dateStr = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  document.getElementById('date').textContent = dateStr;
}

// start immediately and then update every second
updateClock();
setInterval(updateClock, 1000);
