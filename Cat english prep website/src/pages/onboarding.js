// ============================================================
// pages/onboarding.js
// ============================================================
import { store } from '../store.js';
import { navigate } from '../main.js';
import { recordStudySession } from '../gamification.js';

export function renderOnboarding() {
  let currentStep = 1;
  const name = store.get().user.name || 'there';

  const app = document.getElementById('app');

  function renderStep(step) {
    if (step === 1) return renderStep1(name);
    if (step === 2) return renderStep2();
    if (step === 3) return renderStep3(name);
  }

  function mount() {
    app.innerHTML = `
      <div class="onboarding-page">
        <div class="onboarding-card" id="onboarding-card">
          ${renderStep(currentStep)}
        </div>
      </div>
    `;
    attachEvents();
  }

  function attachEvents() {
    document.getElementById('onboard-next')?.addEventListener('click', () => {
      if (currentStep === 2) {
        const sel = document.querySelector('.goal-option.selected');
        const goal = sel ? parseInt(sel.dataset.goal) : 30;
        store.setDailyGoal(goal);
      }
      if (currentStep < 3) {
        currentStep++;
        document.getElementById('onboarding-card').innerHTML = renderStep(currentStep);
        attachEvents();
      } else {
        store.setOnboarded();
        recordStudySession();
        navigate('dashboard');
      }
    });

    document.querySelectorAll('.goal-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.goal-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
  }

  mount();
}

function stepDots(current) {
  return `
    <div class="onboarding-step-dots">
      ${[1, 2, 3].map(i => `
        <div class="step-dot ${i < current ? 'done' : i === current ? 'active' : ''}"></div>
      `).join('')}
    </div>
  `;
}

function renderStep1(name) {
  return `
    ${stepDots(1)}
    <img src="/mascot/wave.png" alt="CAT waving" class="onboarding-mascot" />
    <h2 class="onboarding-title">Hi ${name}! I'm CAT 🐱</h2>
    <p class="onboarding-subtitle">
      I'm your personal grammar coach for the next 7 days.<br/>
      I'll guide you through every rule, quiz you, and celebrate every win — just like Duolingo, but cuter. 😸
    </p>
    <div style="background:var(--accent-dim);border:1px solid var(--accent);border-radius:var(--radius-md);padding:16px;margin-bottom:24px;text-align:left;">
      <div style="font-family:var(--font-heading);font-weight:700;color:var(--accent);margin-bottom:8px;">📋 Your 7-Day Plan:</div>
      <div style="font-size:0.88rem;color:var(--text-secondary);line-height:1.8;">
        Day 1 → Parts of Speech &nbsp;|&nbsp; Day 2 → Subject-Verb Agreement<br/>
        Day 3 → Tenses &nbsp;|&nbsp; Day 4 → Sentence Structure<br/>
        Day 5 → Common Errors &nbsp;|&nbsp; Day 6 → Vocabulary<br/>
        Day 7 → Full Mock Practice 🏆
      </div>
    </div>
    <button class="btn btn-primary btn-lg" id="onboard-next" style="width:100%">
      Let's Go! →
    </button>
  `;
}

function renderStep2() {
  const goals = [
    { min: 20, label: 'Casual Learner', sub: '~2-3 topics per day', badge: 'Relaxed' },
    { min: 30, label: 'Focused Student', sub: '~4-5 topics per day', badge: '⭐ Recommended', rec: true },
    { min: 45, label: 'Serious Aspirant', sub: 'Topics + full quiz each day', badge: 'Intensive' },
    { min: 60, label: 'CAT Champion', sub: 'Full day + review sessions', badge: '🔥 Pro' },
  ];
  return `
    ${stepDots(2)}
    <img src="/mascot/teach.png" alt="CAT teaching" class="onboarding-mascot" />
    <h2 class="onboarding-title">Set Your Daily Goal</h2>
    <p class="onboarding-subtitle">How much time can you commit each day? I'll adjust your pace accordingly!</p>
    <div class="goal-options">
      ${goals.map((g, i) => `
        <div class="goal-option ${i === 1 ? 'selected' : ''}" data-goal="${g.min}" role="radio" aria-checked="${i === 1}" tabindex="0">
          <div class="goal-option-radio"></div>
          <div>
            <div class="goal-option-text">${g.min} minutes — ${g.label}</div>
            <div class="goal-option-sub">${g.sub}</div>
          </div>
          <div class="goal-option-badge">${g.badge}</div>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-primary btn-lg" id="onboard-next" style="width:100%">Continue →</button>
  `;
}

function renderStep3(name) {
  return `
    ${stepDots(3)}
    <img src="/mascot/celebrate.png" alt="CAT celebrating" class="onboarding-mascot" />
    <h2 class="onboarding-title">You're All Set, ${name}! 🎉</h2>
    <p class="onboarding-subtitle">
      I'll be right here in the sidebar every step of the way.<br/>
      Click on me anytime for tips, hints, or just a little encouragement! 🐾
    </p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;">
      ${[
        ['🔥', 'Build a streak', 'Study every day'],
        ['⭐', 'Earn XP', 'Answer questions'],
        ['🏆', 'Unlock badges', 'Complete days'],
        ['🤖', 'Ask CAT', 'AI grammar help'],
      ].map(([icon, title, sub]) => `
        <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-md);padding:12px;text-align:center;">
          <div style="font-size:1.5rem;margin-bottom:4px;">${icon}</div>
          <div style="font-family:var(--font-heading);font-size:0.88rem;font-weight:700;">${title}</div>
          <div style="font-size:0.78rem;color:var(--text-secondary);">${sub}</div>
        </div>
      `).join('')}
    </div>
    <button class="btn btn-primary btn-lg" id="onboard-next" style="width:100%">
      Start Day 1 →  🐱
    </button>
  `;
}
