 // ====== Sample sentences pool - change or expand ======
    const TEXTS = [
      "The quick brown fox jumps over the lazy dog.",
      "Type fast but type accurate. Practice daily to improve.",
      "জাভাস্ক্রিপ্ট দিয়ে মজা করে কিছু তৈরি করা যেতে পারে।",
      "Practice makes perfect. Keep calm and code on!",
      "Learning to type quickly saves a lot of time."
    ];

    // Elements
    const textDisplay = document.getElementById('textDisplay');
    const input = document.getElementById('input');
    const timeEl = document.getElementById('time');
    const wpmEl = document.getElementById('wpm');
    const accEl = document.getElementById('acc');
    const charsEl = document.getElementById('chars');
    const mistakesEl = document.getElementById('mistakes');
    const resetBtn = document.getElementById('resetBtn');
    const newBtn = document.getElementById('newBtn');
    const startBtn = document.getElementById('startBtn');

    let target = "";
    let started = false;
    let timer = null;
    let elapsed = 0; // seconds
    let mistakes = 0;

    function pickNewText() {
      const idx = Math.floor(Math.random() * TEXTS.length);
      target = TEXTS[idx];
      renderTarget();
    }

    function renderTarget() {
      textDisplay.innerHTML = "";
      for (let i = 0; i < target.length; i++) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = target[i];
        textDisplay.appendChild(span);
      }
      // reset visuals
      updateStats();
      input.value = "";
      started = false;
      clearTimer();
      elapsed = 0;
      timeEl.textContent = "0s";
      wpmEl.textContent = "0";
      accEl.textContent = "100%";
      charsEl.textContent = "0";
      mistakesEl.textContent = "0";
      startBtn.textContent = "Start";
      input.focus();
    }

    function startTimer() {
      if (started) return;
      started = true;
      startBtn.textContent = "Running...";
      timer = setInterval(() => {
        elapsed += 1;
        timeEl.textContent = elapsed + 's';
        updateStats();
      }, 1000);
    }

    function clearTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function updateStats() {
      const typed = input.value;
      let correctChars = 0;
      mistakes = 0;
      const spans = textDisplay.querySelectorAll('.char');

      for (let i = 0; i < spans.length; i++) {
        const span = spans[i];
        const c = typed[i];
        span.classList.remove('correct', 'incorrect', 'current');

        if (c == null) {
          // not typed yet
        } else if (c === span.textContent) {
          span.classList.add('correct');
          correctChars++;
        } else {
          span.classList.add('incorrect');
          mistakes++;
        }
      }

      // mark current cursor position
      if (typed.length < spans.length) {
        spans[typed.length]?.classList.add('current');
      } else if (typed.length === spans.length) {
        // finished exact length
        // show last char as current (or none)
      }

      const typedChars = typed.length;
      charsEl.textContent = typedChars;
      mistakesEl.textContent = mistakes;

      // WPM: common formula = (correct chars / 5) / minutes
      const minutes = elapsed > 0 ? (elapsed / 60) : (typedChars > 0 ? 1/60 : 0); // avoid div by 0
      const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
      wpmEl.textContent = wpm;

      // Accuracy
      const accuracy = typedChars === 0 ? 100 : Math.max(0, Math.round(((typedChars - mistakes) / typedChars) * 100));
      accEl.textContent = accuracy + '%';
    }

    // Prevent paste to keep test honest
    input.addEventListener('paste', (e) => {
      e.preventDefault();
    });

    // Start on first keydown (if not started)
    input.addEventListener('keydown', (e) => {
      if (!started && e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter' ) {
        startTimer();
      }
      // if Enter pressed, prevent newline (single-line experience)
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });

    // On input update stats and check finish
    input.addEventListener('input', () => {
      updateStats();

      // if fully typed target
      const typed = input.value;
      if (typed === target) {
        // finished
        clearTimer();
        started = false;
        startBtn.textContent = "Finished";
        updateStats(); // final update
        // optional: brief flash or sound could be added
      }
    });

    // Buttons
    resetBtn.addEventListener('click', () => {
      renderTarget();
    });

    newBtn.addEventListener('click', () => {
      pickNewText();
      renderTarget();
    });

    startBtn.addEventListener('click', () => {
      if (!started) {
        // Start manually (timer begins but typing still needed)
        startTimer();
        input.focus();
      } else {
        // stop
        clearTimer();
        started = false;
        startBtn.textContent = "Start";
      }
    });

    // Initialize
    pickNewText();
    renderTarget();

    // Accessibility: allow focusing the input by clicking the text display
    textDisplay.addEventListener('click', () => input.focus());
