// ============================================================
// pages/landing.js — Multi-user Login Gateway & Landing Page
// ============================================================
import { store } from '../store.js';
import { navigate } from '../main.js';
import { showToast } from '../components/toast.js';

export function renderLanding() {
  const grammarWords = ['noun', 'verb', 'clause', 'tense', 'pronoun', 'adjective', 'idiom', 'syntax', 'phrase', 'grammar'];
  const app = document.getElementById('app');
  
  // Default to login mode
  let mode = 'login'; 

  function updateDOM() {
    app.innerHTML = `
      <div class="landing-page" id="landing-page">
        <div class="landing-bg"></div>
        <div class="landing-particles" id="landing-particles"></div>

        <div class="landing-content">
          <div class="landing-mascot-wrap" id="landing-mascot-wrap">
            <img src="/mascot/wave.png" alt="CAT the grammar kitten waving" class="landing-mascot" id="landing-mascot" />
            <div class="landing-mascot-badge">7-Day Bootcamp</div>
          </div>

          <div>
            <h1 class="landing-title">
              Master CAT English<br/>in <span class="highlight">7 Days</span> 🐱
            </h1>
            <p class="landing-subtitle">
              Learn the 20% of grammar rules that appear in 80% of CAT questions —
              guided by your personal kitten coach.
            </p>
          </div>

          <div class="auth-card">
            <div class="auth-tabs">
              <button class="auth-tab ${mode === 'login' ? 'active' : ''}" id="tab-login">Log In</button>
              <button class="auth-tab ${mode === 'register' ? 'active' : ''}" id="tab-register">Register</button>
            </div>

            ${mode === 'login' ? renderLoginForm() : renderRegisterForm()}
          </div>

          <p class="landing-message" id="landing-message">"Meow! I'll be your grammar buddy!" — CAT 🐱</p>
        </div>
      </div>
    `;

    // Recalculate particles
    spawnParticles(grammarWords);

    // Event listeners
    attachAuthEvents();
  }

  function renderLoginForm() {
    return `
      <form class="auth-form" id="login-form" novalidate>
        <div class="input-group">
          <label for="login-id" class="input-label">Login ID / Username</label>
          <input
            type="text"
            class="input"
            id="login-id"
            placeholder="Enter your Login ID... 🐾"
            required
            autofocus
          />
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%">
          Resume My Journey →
        </button>
      </form>
    `;
  }

  function renderRegisterForm() {
    return `
      <form class="auth-form" id="register-form" novalidate>
        <div class="input-group">
          <label for="reg-id" class="input-label">Choose a Login ID / Username</label>
          <input
            type="text"
            class="input"
            id="reg-id"
            placeholder="Choose username (e.g. lakshya) 🐾"
            maxlength="20"
            required
          />
        </div>
        <div class="input-group">
          <label for="reg-name" class="input-label">Your Name</label>
          <input
            type="text"
            class="input"
            id="reg-name"
            placeholder="Enter your name... 🐱"
            maxlength="40"
            required
          />
        </div>
        <div class="input-group">
          <label for="reg-email" class="input-label">Email Address (optional)</label>
          <input
            type="email"
            class="input"
            id="reg-email"
            placeholder="Your email address (optional)"
          />
        </div>
        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%">
          Register & Start Bootcamp →
        </button>
      </form>
    `;
  }

  function attachAuthEvents() {
    // Tab switching
    document.getElementById('tab-login')?.addEventListener('click', () => {
      if (mode !== 'login') {
        mode = 'login';
        updateDOM();
      }
    });

    document.getElementById('tab-register')?.addEventListener('click', () => {
      if (mode !== 'register') {
        mode = 'register';
        updateDOM();
      }
    });

    // Mascot click cycle
    let msgIndex = 0;
    const msgs = [
      '"Meow! Ready to master CAT English?" 🐱',
      '"I\'ll guide you through every grammar rule!" 🎓',
      '"7 days, 80/20 rule — let\'s do this!" 🔥',
      '"Even tricky tenses will become easy!" ⭐',
    ];
    document.getElementById('landing-mascot-wrap')?.addEventListener('click', () => {
      msgIndex = (msgIndex + 1) % msgs.length;
      const msgEl = document.getElementById('landing-message');
      if (msgEl) msgEl.textContent = msgs[msgIndex];
    });

    // Forms
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const loginId = document.getElementById('login-id').value.trim().toLowerCase();
      if (!loginId) {
        showToast('Please enter your Login ID!', 'error');
        return;
      }

      if (store.login(loginId)) {
        showToast(`Welcome back, ${store.get().user.name}! 🐱`, 'success');
        navigate('dashboard');
      } else {
        showToast('Login ID not found. Please register!', 'error');
        const msgEl = document.getElementById('landing-message');
        if (msgEl) msgEl.textContent = '🐱 No record of this ID! Maybe switch to "Register" tab?';
      }
    });

    document.getElementById('register-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const regId = document.getElementById('reg-id').value.trim().toLowerCase();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();

      if (!regId) {
        showToast('Please choose a Login ID!', 'error');
        return;
      }
      if (!name) {
        showToast('Please enter your name!', 'error');
        return;
      }

      // Validate ID: alphanumeric only
      if (!/^[a-z0-9_]{3,20}$/.test(regId)) {
        showToast('Login ID must be 3-20 characters (letters, numbers, underscores only).', 'error');
        return;
      }

      if (store.register(regId, name, email)) {
        showToast('Registration successful! 🌟', 'success');
        navigate('onboarding');
      } else {
        showToast('Login ID already exists. Try a different one!', 'error');
        const msgEl = document.getElementById('landing-message');
        if (msgEl) msgEl.textContent = '🐱 That ID is already taken. Try another name!';
      }
    });
  }

  function spawnParticles(words) {
    const container = document.getElementById('landing-particles');
    if (!container) return;
    container.innerHTML = ''; // Clear existing
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = words[i % words.length];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = Math.random() * 100 + 'vh';
      p.style.animationDuration = (20 + Math.random() * 20) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
      container.appendChild(p);
    }
  }

  // Initial draw
  updateDOM();
}
