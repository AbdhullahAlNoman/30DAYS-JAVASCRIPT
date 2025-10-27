 // Character pools
    const pools = {
      lower: 'abcdefghijklmnopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()-_=+[]{};:,.<>/?' // sensible set
    };

    const ambig = 'O0Il1';

    // DOM
    const output = document.getElementById('output');
    const lengthIn = document.getElementById('length');
    const lowerC = document.getElementById('lower');
    const upperC = document.getElementById('upper');
    const numsC = document.getElementById('numbers');
    const symC = document.getElementById('symbols');
    const excludeAmb = document.getElementById('excludeAmb');
    const noRepeat = document.getElementById('noRepeat');
    const pronounce = document.getElementById('pronounce');
    const generateBtn = document.getElementById('generate');
    const exampleBtn = document.getElementById('exampleBtn');
    const copyBtn = document.getElementById('copyBtn');
    const meterBar = document.getElementById('meterBar');
    const strengthText = document.getElementById('strengthText');

    // Utilities
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function pickRandom(str) {
      return str.charAt(Math.floor(Math.random() * str.length));
    }

    function generatePassword(options) {
      const len = Math.max(1, options.length);

      // Pronounceable simple approach: alternate consonant-vowel
      if (options.pronounce) {
        const consonants = (pools.lower + pools.upper).replace(/[aeiouAEIOU]/g, '');
        const vowels = 'aeiouAEIOU';
        const base = [];
        let useCons = Math.random() > 0.5;
        for (let i = 0; i < len; i++) {
          if (useCons) base.push(pickRandom(consonants)); else base.push(pickRandom(vowels));
          useCons = !useCons;
        }
        let pw = base.join('');
        if (options.numbers) pw = injectChars(pw, pools.numbers, Math.floor(len / 6));
        if (options.symbols) pw = injectChars(pw, pools.symbols, Math.floor(len / 8));
        if (options.excludeAmb) pw = pw.split('').filter(c => !ambig.includes(c)).join('');
        if (options.noRepeat) pw = removeRepeats(pw, options.length);
        return pw.slice(0, len);
      }

      // Build pool
      let pool = '';
      if (options.lower) pool += pools.lower;
      if (options.upper) pool += pools.upper;
      if (options.numbers) pool += pools.numbers;
      if (options.symbols) pool += pools.symbols;
      if (!pool) return '';

      if (options.excludeAmb) pool = pool.split('').filter(c => !ambig.includes(c)).join('');

      // noRepeat handling
      if (options.noRepeat && len > pool.length) {
        // impossible to create without repeats -- fallback to allow repeats
        // we'll still try: generate unique then fill
        console.warn('Requested no-repeat but length > pool. Allowing repeats.');
      }

      const arr = [];
      for (let i = 0; i < len; i++) {
        arr.push(pickRandom(pool));
      }

      if (options.noRepeat) {
        // try to make unique by shuffling pool
        const unique = shuffleArray(pool.split('')).slice(0, len);
        if (unique.length === len) return unique.join('');
        // fallback
      }

      return arr.join('');
    }

    function injectChars(base, pool, count) {
      const arr = base.split('');
      for (let i = 0; i < count; i++) {
        const pos = Math.floor(Math.random() * (arr.length + 1));
        arr.splice(pos, 0, pickRandom(pool));
      }
      return arr.join('');
    }

    function removeRepeats(str, targetLen) {
      const out = [];
      for (const ch of str) if (!out.includes(ch)) out.push(ch);
      // if too short, pad using original string chars
      let idx = 0;
      while (out.length < targetLen && idx < str.length) {
        if (!out.includes(str[idx])) out.push(str[idx]);
        idx++;
      }
      // if still short, repeat last char
      while (out.length < targetLen) out.push(str[out.length - 1] || 'x');
      return out.join('');
    }

    function entropyEst(poolSize, length) {
      return Math.log2(Math.pow(poolSize, length) || 1);
    }

    function updateStrength(pw) {
      const pool = new Set();
      for (const ch of pw) {
        if (/[a-z]/.test(ch)) pool.add('a');
        else if (/[A-Z]/.test(ch)) pool.add('A');
        else if (/[0-9]/.test(ch)) pool.add('0');
        else pool.add('#');
      }
      const sizes = { 'a':26,'A':26,'0':10,'#':32 };
      let poolSize = 0; for (const p of pool) poolSize += sizes[p] || 0;
      const ent = entropyEst(poolSize || 1, pw.length);
      const percent = Math.min(100, Math.round((ent / 80) * 100)); // 80 bits ~ very strong
      meterBar.style.width = percent + '%';
      const text = ent < 28 ? 'Weak' : ent < 50 ? 'Fair' : ent < 60 ? 'Good' : 'Strong';
      strengthText.textContent = text + ` (${Math.round(ent)} bits)`;
    }

    generateBtn.addEventListener('click', () => {
      const options = {
        length: parseInt(lengthIn.value, 10) || 12,
        lower: lowerC.checked,
        upper: upperC.checked,
        numbers: numsC.checked,
        symbols: symC.checked,
        excludeAmb: excludeAmb.checked,
        noRepeat: noRepeat.checked,
        pronounce: pronounce.checked
      };
      let pw = generatePassword(options);
      if (!pw) pw = 'Please enable at least one character set.';
      output.value = pw;
      updateStrength(pw);
    });

    exampleBtn.addEventListener('click', () => {
      const results = [];
      const opts = {
        length: parseInt(lengthIn.value, 10) || 12,
        lower: lowerC.checked,
        upper: upperC.checked,
        numbers: numsC.checked,
        symbols: symC.checked,
        excludeAmb: excludeAmb.checked,
        noRepeat: noRepeat.checked,
        pronounce: pronounce.checked
      };
      for (let i = 0; i < 4; i++) results.push(generatePassword(opts));
      output.value = results.join('  ');
      updateStrength(results[0] || '');
    });

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(output.value);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
      } catch (e) {
        copyBtn.textContent = 'Copy Failed';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 1200);
      }
    });

    // generate initial sample
    generateBtn.click();