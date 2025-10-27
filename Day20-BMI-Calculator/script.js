/* ---------- State ---------- */
const unitEl = document.getElementById('unit');
const weightEl = document.getElementById('weight');
const heightEl = document.getElementById('height');
const calcBtn = document.getElementById('calcBtn');
const calcLiveBtn = document.getElementById('calcLive');
const saveBtn = document.getElementById('saveBtn');
const clearInputsBtn = document.getElementById('clearInputs');
const resultBox = document.getElementById('resultBox');
const bmiValueEl = document.getElementById('bmiValue');
const bmiCatEl = document.getElementById('bmiCat');
const adviceEl = document.getElementById('advice');
const historyBody = document.getElementById('historyBody');
const downloadCSV = document.getElementById('downloadCSV');
const clearHistory = document.getElementById('clearHistory');
const statMini = document.getElementById('statMini');
const canvas = document.getElementById('bmiChart');
const ctx = canvas.getContext('2d');

let history = []; // {time, unit, weight, height, bmi, cat}
let live = false;

/* ---------- Helpers ---------- */
function round(n, digits = 1) {
  if (n === null || isNaN(n)) return null;
  return Number(n.toFixed(digits));
}
function nowLabel() {
  return new Date().toLocaleString();
}

/* Convert input to metric meters & kg for calculation
   supported units:
     - metric: weight in kg, height in cm
     - metric-m: weight in kg, height in meters
     - imperial: weight in lbs, height in inches
*/
function toMetric({ unit, weight, height }) {
  let kg = Number(weight) || 0;
  let m = Number(height) || 0;
  if (unit === 'metric') {
    m = m / 100;
  } else if (unit === 'metric-m') {
    // already in meters
  } else if (unit === 'imperial') {
    kg = kg * 0.45359237;
    m = m * 0.0254;
  }
  return { kg, m };
}

function calcBMI(kg, m) {
  if (!m || m <= 0) return null;
  return kg / (m * m);
}

function bmiCategory(bmi) {
  if (bmi === null || isNaN(bmi))
    return { cat: 'N/A', advice: 'Invalid input — please check your values and try again.' };
  if (bmi < 18.5)
    return {
      cat: 'Underweight',
      advice:
        'Health Tip: Eat nutritious food and focus on healthy weight gain. Consult a doctor if needed.',
    };
  if (bmi < 25)
    return {
      cat: 'Normal',
      advice: 'Great! Maintain a balanced diet and regular exercise.',
    };
  if (bmi < 30)
    return {
      cat: 'Overweight',
      advice:
        'Start controlling weight through diet and exercise; talk to a nutritionist if needed.',
    };
  return {
    cat: 'Obese',
    advice:
      'High health risk — consult a doctor and make necessary lifestyle changes.',
  };
}

/* ---------- UI actions ---------- */
function updateResult(showAdvice = true) {
  const unit = unitEl.value;
  const weight = Number(weightEl.value);
  const height = Number(heightEl.value);
  const { kg, m } = toMetric({ unit, weight, height });
  const bmi = calcBMI(kg, m);
  const bmiR = bmi === null ? '—' : round(bmi, 1);
  bmiValueEl.textContent = bmiR;
  const catObj = bmi === null ? { cat: '—', advice: '—' } : bmiCategory(bmi);
  bmiCatEl.textContent = catObj.cat;
  adviceEl.textContent = showAdvice ? catObj.advice || '' : '';
  return { bmi: bmi === null ? null : round(bmi, 2), cat: catObj.cat };
}

calcBtn.addEventListener('click', () => updateResult(true));

// Live toggle button
calcLiveBtn.addEventListener('click', () => {
  live = !live;
  calcLiveBtn.textContent = live ? 'Live: ON' : 'Live (auto)';
  calcLiveBtn.classList.toggle('secondary', !live);
  if (live) {
    [weightEl, heightEl, unitEl].forEach((el) => el.addEventListener('input', liveHandler));
    updateResult(true);
  } else {
    [weightEl, heightEl, unitEl].forEach((el) => el.removeEventListener('input', liveHandler));
  }
});
function liveHandler() {
  updateResult(true);
}

// Save to history
saveBtn.addEventListener('click', () => {
  const unit = unitEl.value;
  const weight = weightEl.value;
  const height = heightEl.value;
  if (!weight || !height) {
    alert('Please enter both Weight and Height.');
    return;
  }
  const res = updateResult(false);
  const entry = {
    time: new Date().toISOString(),
    timeLabel: nowLabel(),
    unit,
    weight,
    height,
    bmi: res.bmi,
    cat: res.cat,
  };
  history.unshift(entry);
  renderHistory();
  updateChart();
});

// Clear inputs
clearInputsBtn.addEventListener('click', () => {
  weightEl.value = '';
  heightEl.value = '';
  unitEl.value = 'metric';
  updateResult(false);
});

// Download CSV
downloadCSV.addEventListener('click', () => {
  if (!history.length) {
    alert('History is empty. Please click "Save to History" first.');
    return;
  }
  const rows = [['time', 'timeLabel', 'unit', 'weight', 'height', 'bmi', 'category']];
  history
    .slice()
    .reverse()
    .forEach((h) =>
      rows.push([h.time, h.timeLabel, h.unit, h.weight, h.height, h.bmi, h.cat])
    );
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bmi-history-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Clear history
clearHistory.addEventListener('click', () => {
  if (!confirm('Are you sure you want to clear the history?')) return;
  history = [];
  renderHistory();
  updateChart();
});

/* ---------- Render history & chart ---------- */
function renderHistory() {
  historyBody.innerHTML = '';
  if (!history.length) {
    historyBody.innerHTML = `<tr><td colspan="5" style="color:var(--muted);font-size:13px">No saved entries.</td></tr>`;
    statMini.textContent = 'No entries';
    return;
  }
  history.forEach((h) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${h.timeLabel}</td>
                    <td>${h.weight} ${h.unit === 'imperial' ? 'lbs' : 'kg'}</td>
                    <td>${h.height} ${h.unit === 'metric' ? 'cm' : (h.unit === 'metric-m' ? 'm' : 'in')}</td>
                    <td>${h.bmi === null ? '—' : h.bmi}</td>
                    <td>${h.cat}</td>`;
    historyBody.appendChild(tr);
  });
  statMini.textContent = `${history.length} saved`;
}

function updateChart() {
  const w = (canvas.width = canvas.clientWidth * devicePixelRatio);
  const h = (canvas.height = canvas.clientHeight * devicePixelRatio);
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, cw, ch);

  if (!history.length) {
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px system-ui';
    ctx.fillText('No data saved yet — save entries to see chart.', 12, 22);
    ctx.restore();
    return;
  }

  const data = history.slice().reverse().map((h) => ({ bmi: h.bmi, t: h.timeLabel }));
  const n = data.length;
  const padding = 28;
  const chartW = cw - padding * 2;
  const chartH = ch - padding * 2;
  const maxBMI = Math.max(...data.map((d) => d.bmi || 0), 40);
  const minBMI = Math.min(...data.map((d) => d.bmi || maxBMI), 10);

  ctx.strokeStyle = '#eef4fb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + i * (chartH / 4);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + chartW, y);
    ctx.stroke();
  }

  const gap = n === 1 ? chartW / 2 : chartW / (n - 1);
  const points = data.map((d, i) => {
    const x = padding + i * gap;
    const v = d.bmi || 0;
    const y = padding + chartH - ((v - minBMI) / (maxBMI - minBMI || 1)) * chartH;
    return { x, y, v };
  });

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#0ea5e9';
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  points.forEach((p) => {
    const cat = p.v < 18.5 ? 'u' : p.v < 25 ? 'n' : p.v < 30 ? 'o' : 'b';
    let fill = '#94a3b8';
    if (cat === 'u') fill = '#f97316';
    if (cat === 'n') fill = '#10b981';
    if (cat === 'o') fill = '#f59e0b';
    if (cat === 'b') fill = '#ef4444';
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#475569';
  ctx.font = '11px system-ui';
  const step = Math.max(1, Math.ceil(n / 6));
  points.forEach((p, i) => {
    if (i % step === 0) ctx.fillText(data[i].t.split(',')[0], p.x - 30, ch - padding + 16);
  });

  ctx.fillStyle = '#475569';
  ctx.font = '11px system-ui';
  for (let i = 0; i <= 4; i++) {
    const v = minBMI + ((maxBMI - minBMI) * (4 - i)) / 4;
    const y = padding + i * (chartH / 4);
    ctx.fillText(Math.round(v * 10) / 10, cw - padding - 40, y + 4);
  }

  ctx.restore();
}

/* initialize */
updateResult(false);
renderHistory();
updateChart();

/* small convenience: save when Enter is pressed on height/weight */
[weightEl, heightEl].forEach((el) =>
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      updateResult(true);
      saveBtn.click();
    }
  })
);
