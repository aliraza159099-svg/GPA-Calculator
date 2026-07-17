'use strict';

/* ==========================================================================
   ARB Institute — University GPA Calculator
   Vanilla ES6, no dependencies.
   ========================================================================== */

/* ---------------------------------------------------------------------- *
 * 1. DOM REFERENCES
 * ---------------------------------------------------------------------- */
const root = document.documentElement;

const themeToggle   = document.getElementById('themeToggle');
const clockDateEl   = document.getElementById('clockDate');
const clockTimeEl   = document.getElementById('clockTime');

const setupCard     = document.getElementById('setupCard');
const setupForm     = document.getElementById('setupForm');
const subjectCountI = document.getElementById('subjectCount');
const subjectCountErr = document.getElementById('subjectCountError');
const generateBtn   = document.getElementById('generateBtn');

const subjectsCard  = document.getElementById('subjectsCard');
const subjectsList  = document.getElementById('subjectsList');
const calculateBtn  = document.getElementById('calculateBtn');
const resetBtnTop   = document.getElementById('resetBtnTop');
const resetBtnBottom= document.getElementById('resetBtnBottom');

const resultCard    = document.getElementById('resultCard');
const resultGpaNumber = document.getElementById('resultGpaNumber');
const resultCreditHours = document.getElementById('resultCreditHours');
const resultQualityPoints = document.getElementById('resultQualityPoints');
const resultCourseCount = document.getElementById('resultCourseCount');
const resultLabel   = document.getElementById('resultLabel');
const resultBadge   = document.getElementById('resultBadge');
const resultIcon    = document.getElementById('resultIcon');
const ringFill       = document.getElementById('ringFill');
const scaleMarker    = document.getElementById('scaleMarker');

const loadingOverlay = document.getElementById('loadingOverlay');
const footerYear     = document.getElementById('footerYear');

const RING_CIRCUMFERENCE = 2 * Math.PI * 60; // r=60

footerYear.textContent = new Date().getFullYear();

/* ---------------------------------------------------------------------- *
 * 2. THEME (dark / light) WITH LOCAL STORAGE PERSISTENCE
 * ---------------------------------------------------------------------- */
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-checked', String(theme === 'dark'));
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

function initTheme() {
  const stored = localStorage.getItem('gpa-theme');
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored);
    return;
  }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('gpa-theme', next);
  playTone('toggle');
});

initTheme();

/* ---------------------------------------------------------------------- *
 * 3. LIVE CLOCK
 * ---------------------------------------------------------------------- */
function updateClock() {
  const now = new Date();
  const dateOpts = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const timeOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  clockDateEl.textContent = now.toLocaleDateString(undefined, dateOpts);
  clockTimeEl.textContent = now.toLocaleTimeString(undefined, timeOpts);
}
updateClock();
setInterval(updateClock, 1000);

/* ---------------------------------------------------------------------- *
 * 4. SOUND EFFECTS — Web Audio API (self-contained, no audio files)
 * ---------------------------------------------------------------------- */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  return audioCtx;
}

/**
 * Play a short synthesized tone for UI feedback.
 * kind: 'generate' | 'calculate' | 'reset' | 'toggle' | 'error'
 */
function playTone(kind) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  let freqStart = 440, freqEnd = 440, duration = 0.16, type = 'sine', peak = 0.14;

  switch (kind) {
    case 'generate':
      freqStart = 520; freqEnd = 780; duration = 0.18; type = 'triangle'; break;
    case 'calculate':
      freqStart = 440; freqEnd = 660; duration = 0.28; type = 'sine'; peak = 0.16; break;
    case 'success':
      freqStart = 600; freqEnd = 900; duration = 0.35; type = 'sine'; peak = 0.15; break;
    case 'reset':
      freqStart = 500; freqEnd = 260; duration = 0.22; type = 'triangle'; break;
    case 'toggle':
      freqStart = 700; freqEnd = 500; duration = 0.1; type = 'square'; peak = 0.06; break;
    case 'error':
      freqStart = 220; freqEnd = 160; duration = 0.22; type = 'sawtooth'; peak = 0.1; break;
    default:
      freqStart = 440; freqEnd = 440; duration = 0.12; type = 'sine';
  }

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 40), now + duration);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

/* ---------------------------------------------------------------------- *
 * 5. SPEECH SYNTHESIS — Web Speech API
 * ---------------------------------------------------------------------- */
function speak(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  } catch (err) {
    /* Speech synthesis is a progressive enhancement; fail silently. */
  }
}

window.addEventListener('load', () => {
  // Small delay lets voices load in most browsers.
  setTimeout(() => {
    speak('Welcome to the University G P A Calculator. Please enter the number of subjects.');
  }, 500);
});

/* ---------------------------------------------------------------------- *
 * 6. BUTTON RIPPLE EFFECT
 * ---------------------------------------------------------------------- */
function attachRipple(button) {
  button.addEventListener('click', (e) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${(e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2}px`;
    ripple.style.top = `${(e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2}px`;
    button.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}
document.querySelectorAll('.btn').forEach(attachRipple);

/* ---------------------------------------------------------------------- *
 * 7. VALIDATION HELPERS
 * ---------------------------------------------------------------------- */
function showFieldError(inputEl, errorEl, message) {
  inputEl.classList.add('invalid');
  inputEl.setAttribute('aria-invalid', 'true');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
  }
}
function clearFieldError(inputEl, errorEl) {
  inputEl.classList.remove('invalid');
  inputEl.removeAttribute('aria-invalid');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('show');
  }
}

/* ---------------------------------------------------------------------- *
 * 8. STEP 1 — GENERATE SUBJECT ROWS
 * ---------------------------------------------------------------------- */
setupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const raw = subjectCountI.value.trim();
  const count = Number(raw);

  clearFieldError(subjectCountI, subjectCountErr);

  if (raw === '' || !Number.isFinite(count) || !Number.isInteger(count) || count < 1) {
    showFieldError(subjectCountI, subjectCountErr, 'Please enter a whole number of 1 or more.');
    playTone('error');
    speak('Please complete all fields correctly.');
    return;
  }
  if (count > 12) {
    showFieldError(subjectCountI, subjectCountErr, 'For readability, please enter 12 subjects or fewer.');
    playTone('error');
    return;
  }

  playTone('generate');
  buildSubjectRows(count);

  loadingOverlay.hidden = false;
  window.setTimeout(() => {
    loadingOverlay.hidden = true;
    subjectsCard.hidden = false;
    subjectsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    speak('Please select the credit hours and grade for each subject.');
    const firstInput = subjectsList.querySelector('.mini-input');
    if (firstInput) firstInput.focus({ preventScroll: true });
  }, 420);
});

/* Grade options shown in the GPA dropdown, in display order. */
const GRADE_OPTIONS = [
  { value: '4.00', label: 'A (4.00)' },
  { value: '3.66', label: 'A- (3.66)' },
  { value: '3.33', label: 'B+ (3.33)' },
  { value: '3.00', label: 'B (3.00)' },
  { value: '2.66', label: 'B- (2.66)' },
  { value: '2.33', label: 'C+ (2.33)' },
  { value: '2.00', label: 'C (2.00)' },
  { value: '1.66', label: 'C- (1.66)' },
  { value: '1.33', label: 'D+ (1.33)' },
  { value: '1.00', label: 'D (1.00)' },
  { value: '0.00', label: 'F (0.00)' },
];

/* Credit hour options shown in the Credit Hours dropdown. */
const CREDIT_OPTIONS = [1, 2, 3, 4, 5];

function buildSubjectRows(count) {
  subjectsList.innerHTML = '';
  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= count; i++) {
    const row = document.createElement('div');
    row.className = 'subject-row';
    row.style.animationDelay = `${i * 0.06}s`;

    const creditOptionsHtml = CREDIT_OPTIONS
      .map((c) => `<option value="${c}">${c}</option>`)
      .join('');

    const gradeOptionsHtml = GRADE_OPTIONS
      .map((g) => `<option value="${g.value}">${g.label}</option>`)
      .join('');

    row.innerHTML = `
      <div class="subject-index" aria-hidden="true">${i}</div>
      <div class="subject-fields">
        <div class="mini-field">
          <label for="credit-${i}">Subject ${i} &middot; Credit Hours</label>
          <select
            id="credit-${i}"
            class="mini-input credit-input"
            data-subject="${i}"
            aria-describedby="credit-err-${i}"
          >
            <option value="" disabled selected>Select</option>
            ${creditOptionsHtml}
          </select>
        </div>
        <div class="mini-field">
          <label for="gpa-${i}">Subject ${i} &middot; GPA</label>
          <select
            id="gpa-${i}"
            class="mini-input gpa-input"
            data-subject="${i}"
            aria-describedby="gpa-err-${i}"
          >
            <option value="" disabled selected>Select</option>
            ${gradeOptionsHtml}
          </select>
        </div>
      </div>
      <p class="mini-error" id="credit-err-${i}" role="alert"></p>
      <p class="mini-error" id="gpa-err-${i}" role="alert"></p>
    `;
    fragment.appendChild(row);
  }

  subjectsList.appendChild(fragment);

  // Live-clear validation styling as the user corrects values.
  subjectsList.querySelectorAll('.mini-input').forEach((input) => {
    input.addEventListener('change', () => {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      const isCredit = input.classList.contains('credit-input');
      const idx = input.dataset.subject;
      const errorEl = document.getElementById(isCredit ? `credit-err-${idx}` : `gpa-err-${idx}`);
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
    });
  });
}

/* ---------------------------------------------------------------------- *
 * 9. STEP 2 — VALIDATE + CALCULATE GPA
 * ---------------------------------------------------------------------- */
calculateBtn.addEventListener('click', () => {
  const creditInputs = Array.from(subjectsList.querySelectorAll('.credit-input'));
  const gpaInputs = Array.from(subjectsList.querySelectorAll('.gpa-input'));

  let valid = true;
  let totalCredits = 0;
  let totalQualityPoints = 0;
  let firstInvalid = null;

  creditInputs.forEach((creditInput, i) => {
    const gpaInput = gpaInputs[i];
    const idx = creditInput.dataset.subject;
    const creditErr = document.getElementById(`credit-err-${idx}`);
    const gpaErr = document.getElementById(`gpa-err-${idx}`);

    const creditVal = parseFloat(creditInput.value);
    const gpaVal = parseFloat(gpaInput.value);

    let rowValid = true;

    if (creditInput.value === '' || !Number.isFinite(creditVal) || creditVal <= 0) {
      creditInput.classList.add('invalid');
      creditInput.setAttribute('aria-invalid', 'true');
      creditErr.textContent = 'Please select credit hours.';
      creditErr.classList.add('show');
      rowValid = false;
    } else {
      creditInput.classList.remove('invalid');
      creditErr.textContent = '';
      creditErr.classList.remove('show');
    }

    if (gpaInput.value === '' || !Number.isFinite(gpaVal) || gpaVal < 0 || gpaVal > 4) {
      gpaInput.classList.add('invalid');
      gpaInput.setAttribute('aria-invalid', 'true');
      gpaErr.textContent = 'Please select a grade.';
      gpaErr.classList.add('show');
      rowValid = false;
    } else {
      gpaInput.classList.remove('invalid');
      gpaErr.textContent = '';
      gpaErr.classList.remove('show');
    }

    if (!rowValid) {
      valid = false;
      if (!firstInvalid) firstInvalid = creditInput.classList.contains('invalid') ? creditInput : gpaInput;
    } else {
      totalCredits += creditVal;
      totalQualityPoints += creditVal * gpaVal;
    }
  });

  if (!valid) {
    playTone('error');
    speak('Please complete all fields correctly.');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  playTone('calculate');

  loadingOverlay.hidden = false;
  window.setTimeout(() => {
    loadingOverlay.hidden = true;
    const semesterGpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
    showResult(semesterGpa, totalCredits, totalQualityPoints, creditInputs.length);
  }, 500);
});

/* ---------------------------------------------------------------------- *
 * 10. RESULT RENDERING
 * ---------------------------------------------------------------------- */
const PERFORMANCE_TIERS = [
  { min: 3.999, label: 'Outstanding',        color: 'var(--accent-gold)',    icon: 'star' },
  { min: 3.70,  label: 'Excellent',          color: 'var(--accent-gold)',    icon: 'medal' },
  { min: 3.30,  label: 'Very Good',          color: 'var(--accent-emerald)', icon: 'check' },
  { min: 3.00,  label: 'Good',               color: 'var(--accent-emerald)', icon: 'check' },
  { min: 2.50,  label: 'Satisfactory',       color: 'var(--text-secondary)', icon: 'flag' },
  { min: -1,    label: 'Needs Improvement',  color: 'var(--accent-crimson)', icon: 'alert' },
];

const ICONS = {
  star:  '<path d="M12 2l2.9 6.6 7.1.7-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7L2 9.3l7.1-.7L12 2z" fill="currentColor"/>',
  medal: '<circle cx="12" cy="15" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 3h6l-2 6.5h-2L9 3z" fill="currentColor"/><path d="M12 12.5l1.2 2.4 2.6.4-1.9 1.8.45 2.6L12 18.4l-2.35 1.3.45-2.6-1.9-1.8 2.6-.4z" fill="var(--surface-solid)"/>',
  check: '<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 12.5l2.5 2.5 5.5-5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  flag:  '<line x1="6" y1="3" x2="6" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6 4h11l-3 4 3 4H6" fill="currentColor"/>',
  alert: '<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="7" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1.1" fill="currentColor"/>',
};

function getTier(gpa) {
  return PERFORMANCE_TIERS.find((t) => gpa >= t.min) || PERFORMANCE_TIERS[PERFORMANCE_TIERS.length - 1];
}

function showResult(gpa, totalCredits, totalQualityPoints, courseCount) {
  const clampedGpa = Math.max(0, Math.min(4, gpa));
  const tier = getTier(clampedGpa);

  resultGpaNumber.textContent = clampedGpa.toFixed(2);
  resultCreditHours.textContent = totalCredits.toFixed(2);
  resultQualityPoints.textContent = totalQualityPoints.toFixed(2);
  resultCourseCount.textContent = String(courseCount);
  resultLabel.textContent = tier.label;
  resultLabel.style.color = tier.color;
  resultBadge.style.color = tier.color;
  resultBadge.style.background = `color-mix(in srgb, ${tier.color} 18%, transparent)`;
  resultIcon.innerHTML = ICONS[tier.icon];

  const offset = RING_CIRCUMFERENCE * (1 - clampedGpa / 4);
  ringFill.style.stroke = tier.color;
  // Force reflow so the transition reliably animates from full offset.
  ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
  void ringFill.getBoundingClientRect();
  requestAnimationFrame(() => {
    ringFill.style.strokeDashoffset = String(offset);
  });

  const markerX = 10 + (clampedGpa / 4) * 300;
  scaleMarker.setAttribute('cx', String(markerX));

  subjectsCard.hidden = true;
  resultCard.hidden = false;
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

  playTone('success');
  speak('Your G P A has been calculated successfully.');
}

/* ---------------------------------------------------------------------- *
 * 11. RESET
 * ---------------------------------------------------------------------- */
function resetAll() {
  playTone('reset');

  setupForm.reset();
  clearFieldError(subjectCountI, subjectCountErr);
  subjectsList.innerHTML = '';

  subjectsCard.hidden = true;
  resultCard.hidden = true;
  setupCard.hidden = false;

  ringFill.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
  scaleMarker.setAttribute('cx', '10');

  setupCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => subjectCountI.focus({ preventScroll: true }), 350);
}

resetBtnTop.addEventListener('click', resetAll);
resetBtnBottom.addEventListener('click', resetAll);
