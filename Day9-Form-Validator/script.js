// ---------- Simple Form Validator (vanilla JS) ----------
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('regForm');
  const submitBtn = document.getElementById('submitBtn');
  const formMessage = document.getElementById('formMessage');

  const fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    password: document.getElementById('password'),
    confirm: document.getElementById('confirm'),
    terms: document.getElementById('terms'),
  };

  // helpers
  const setError = (el, message) => {
    const help = document.getElementById(el.id + 'Help');
    help.textContent = message || '';
    el.classList.remove('valid');
    el.classList.add('invalid');
  };

  const setValid = (el) => {
    const help = document.getElementById(el.id + 'Help');
    help.textContent = '';
    el.classList.remove('invalid');
    el.classList.add('valid');
  };

  const clearState = (el) => {
    const help = document.getElementById(el.id + 'Help');
    help.textContent = '';
    el.classList.remove('invalid', 'valid');
  };

  // password strength: return score 0..4
  const passwordScore = (pw) => {
    let score = 0;
    if (!pw) return score;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  // validate single field, return boolean
  const validateField = (name) => {
    const el = fields[name];
    const val = (el.value || '').trim();

    if (name === 'name') {
      if (!val) { setError(el, 'Name is required'); return false; }
      if (val.length < 2) { setError(el, 'Enter at least 2 characters'); return false; }
      setValid(el); return true;
    }

    if (name === 'email') {
      if (!val) { setError(el, 'Email is required'); return false; }
      // simple email regex (good for client-side)
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(val)) { setError(el, 'Enter a valid email'); return false; }
      setValid(el); return true;
    }

    if (name === 'phone') {
      if (!val) { clearState(el); return true; } // optional
      const re = /^\+?[0-9]{7,15}$/;
      if (!re.test(val)) { setError(el, 'Enter a valid phone (digits only, 7-15 chars)'); return false; }
      setValid(el); return true;
    }

    if (name === 'password') {
      if (!val) { setError(el, 'Password is required'); updateMeter(0); return false; }
      const score = passwordScore(val);
      updateMeter(score);
      if (score < 3) { setError(el, 'Password too weak (min 8, include upper & number)'); return false; }
      setValid(el); return true;
    }

    if (name === 'confirm') {
      const pw = fields.password.value || '';
      if (!val) { setError(el, 'Please confirm password'); return false; }
      if (val !== pw) { setError(el, 'Passwords do not match'); return false; }
      setValid(el); return true;
    }

    if (name === 'terms') {
      const help = document.getElementById('termsHelp');
      if (!el.checked) { help.textContent = 'You must agree to continue'; return false; }
      help.textContent = '';
      return true;
    }

    return true;
  };

  // update submit button enabled/disabled
  const refreshSubmitState = () => {
    const keysToCheck = ['name','email','password','confirm','terms'];
    const allValid = keysToCheck.every(k => validateField(k));
    submitBtn.disabled = !allValid;
  };

  // meter update
  const pwMeter = document.getElementById('pwMeter');
  const updateMeter = (score) => {
    if (!pwMeter) return;
    pwMeter.value = score;
  };

  // attach input handlers for realtime validation
  ['name','email','phone','password','confirm'].forEach(id => {
    const el = fields[id];
    el.addEventListener('input', () => {
      validateField(id);
      // confirm depends on password
      if (id === 'password' && fields.confirm.value) validateField('confirm');
      refreshSubmitState();
      formMessage.textContent = '';
      formMessage.className = '';
    });
    el.addEventListener('blur', () => validateField(id));
  });

  fields.terms.addEventListener('change', () => {
    validateField('terms');
    refreshSubmitState();
  });

  // final submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.textContent = '';
    formMessage.className = '';

    // validate all fields once more
    const keys = ['name','email','phone','password','confirm','terms'];
    const results = keys.map(k => validateField(k));
    if (results.every(Boolean)) {
      // form is valid — simulate submission
      submitBtn.disabled = true;
      formMessage.textContent = 'Registration successful! ✅';
      formMessage.classList.add('success');
      // optionally you could send data with fetch here
      // reset form after short delay (optional)
      setTimeout(() => {
        form.reset();
        // clear classes & meter
        Object.values(fields).forEach(f => {
          if (f.tagName === 'INPUT') clearState(f);
        });
        updateMeter(0);
        submitBtn.disabled = true;
      }, 900);
    } else {
      formMessage.textContent = 'Please fix errors and try again.';
      formMessage.classList.add('error');
      refreshSubmitState();
    }
  });

  // initial state
  updateMeter(0);
  refreshSubmitState();
});
