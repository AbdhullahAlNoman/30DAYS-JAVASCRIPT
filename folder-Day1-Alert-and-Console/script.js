document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('message');
  const btnAlert = document.getElementById('btnAlert');
  const btnBrowserLog = document.getElementById('btnBrowserLog');
  const btnPageConsole = document.getElementById('btnPageConsole');
  const btnClear = document.getElementById('btnClear');
  const pageConsole = document.getElementById('pageConsole');
  const consoleCount = document.getElementById('consoleCount');

  // Helper functions
  function getValueTrimmed() {
    return input.value ? input.value.trim() : '';
  }

  function updateCount() {
    const count = pageConsole.querySelectorAll('.log-entry').length;
    consoleCount.textContent = `${count} entr${count === 1 ? 'y' : 'ies'}`;
  }

  function showEmptyWarning() {
    alert('Please type something first!');
  }

  function doAlert() {
    const txt = getValueTrimmed();
    if (!txt) return showEmptyWarning();
    alert(txt);
  }

  function doBrowserLog() {
    const txt = getValueTrimmed();
    if (!txt) return showEmptyWarning();
    console.log('[UserLog]', txt);
    addToPageConsole(txt, { type: 'browser' });
  }

  function addToPageConsole(message, opts = {}) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';

    const meta = document.createElement('div');
    meta.className = 'log-meta';
    const time = new Date();
    const timeStr = time.toLocaleString();
    meta.textContent = `${opts.type === 'browser' ? 'Logged to Browser Console • ' : ''}${timeStr}`;

    const body = document.createElement('div');
    body.className = 'log-body';
    body.textContent = message;

    entry.appendChild(meta);
    entry.appendChild(body);

    // Add newest message on top
    if (pageConsole.firstChild) pageConsole.insertBefore(entry, pageConsole.firstChild);
    else pageConsole.appendChild(entry);

    updateCount();
  }

  function clearPageConsole() {
    pageConsole.innerHTML = '';
    updateCount();
  }

  // Event listeners
  btnAlert.addEventListener('click', doAlert);
  btnBrowserLog.addEventListener('click', doBrowserLog);
  btnPageConsole.addEventListener('click', () => {
    const txt = getValueTrimmed();
    if (!txt) return showEmptyWarning();
    addToPageConsole(txt, { type: 'page' });
  });
  btnClear.addEventListener('click', clearPageConsole);

  // Press Enter → add to page console
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const txt = getValueTrimmed();
      if (!txt) return showEmptyWarning();
      addToPageConsole(txt, { type: 'page' });
      input.select();
    }
  });

  // Initial demo entry
  addToPageConsole('Welcome! Your logs will appear here.', { type: 'page' });
});
