(() => {
  const canvas = document.getElementById('draw');
  const ctx = canvas.getContext('2d', { alpha: true });
  const colorPicker = document.getElementById('colorPicker');
  const sizeInput = document.getElementById('size');
  const eraserBtn = document.getElementById('eraser');
  const clearBtn = document.getElementById('clear');
  const undoBtn = document.getElementById('undo');
  const saveBtn = document.getElementById('save');

  let drawing = false;
  let last = { x: 0, y: 0 };
  let isEraser = false;
  let lineWidth = parseInt(sizeInput.value, 10);
  let strokeStyle = colorPicker.value;

  // keep history for undo (store dataURLs)
  const history = [];
  const maxHistory = 20;

  function resizeCanvas() {
    // save current content
    const data = canvas.toDataURL();
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.floor(w * window.devicePixelRatio);
    canvas.height = Math.floor(h * window.devicePixelRatio);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // restore
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, w, h);
    img.src = data;
  }

  // initialize canvas full size
  function initSize() {
    // make canvas fill parent
    const wrap = canvas.parentElement;
    canvas.style.width = '100%';
    canvas.style.height = (wrap.clientHeight) + 'px';
    resizeCanvas();
  }

  window.addEventListener('resize', () => {
    // small debounce
    clearTimeout(window._resizeTimer);
    window._resizeTimer = setTimeout(resizeCanvas, 200);
  });

  initSize();

  function pushHistory() {
    try {
      if (history.length >= maxHistory) history.shift();
      history.push(canvas.toDataURL());
    } catch (e) { console.warn('history push failed', e); }
  }

  function restoreFromDataURL(dataURL) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
    img.src = dataURL;
  }

  function ptrPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top)
    };
  }

  function start(e) {
    e.preventDefault();
    drawing = true;
    const p = e instanceof PointerEvent ? ptrPos(e) : ptrPos(e);
    last.x = p.x; last.y = p.y;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    if (isEraser) ctx.globalCompositeOperation = 'destination-out'; else ctx.globalCompositeOperation = 'source-over';

    // push before stroke for undo
    pushHistory();
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const p = ptrPos(e);
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.x = p.x; last.y = p.y;
  }

  function end(e) {
    if (!drawing) return;
    drawing = false;
  }

  // Pointer events (works for mouse + touch)
  canvas.addEventListener('pointerdown', start);
  canvas.addEventListener('pointermove', draw);
  window.addEventListener('pointerup', end);
  canvas.addEventListener('pointerleave', end);

  // Controls
  colorPicker.addEventListener('input', (ev) => {
    strokeStyle = ev.target.value;
    if (!isEraser) ctx.strokeStyle = strokeStyle;
  });

  sizeInput.addEventListener('input', (ev) => {
    lineWidth = parseInt(ev.target.value, 10);
    ctx.lineWidth = lineWidth;
  });

  eraserBtn.addEventListener('click', () => {
    isEraser = !isEraser;
    eraserBtn.textContent = isEraser ? 'Eraser ✓' : 'Eraser';
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    if (!isEraser) ctx.strokeStyle = strokeStyle;
  });

  clearBtn.addEventListener('click', () => {
    pushHistory();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  undoBtn.addEventListener('click', () => {
    if (!history.length) return;
    const lastData = history.pop();
    // clear then draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    restoreFromDataURL(lastData);
  });

  saveBtn.addEventListener('click', () => {
    // flatten if using destination-out (transparent) -> white background optional
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  // initialize default stroke
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.fillStyle = '#fff';

  // seed history with blank canvas
  pushHistory();
})();
