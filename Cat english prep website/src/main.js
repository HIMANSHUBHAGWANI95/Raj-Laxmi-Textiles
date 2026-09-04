// ============================================================
// main.js — App entry point & hash-based router
// ============================================================
import './styles/main.css';
import { store } from './store.js';
import { renderLanding } from './pages/landing.js';
import { renderOnboarding } from './pages/onboarding.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderLesson } from './pages/lesson.js';
import { renderQuiz } from './pages/quiz.js';
import { renderAchievements } from './pages/achievements.js';

// ── Public navigate function ──────────────────────────────
export function navigate(route) {
  window.location.hash = route;
  window.scrollTo(0, 0);
}

// ── Router ───────────────────────────────────────────────
function route() {
  const hash = window.location.hash.replace('#', '') || '';
  const s = store.get();

  // Handle logout route
  if (hash === 'logout') {
    store.logout();
    renderLanding();
    return;
  }

  // Auth guard — no user logged in → always go to landing
  if (!s) {
    renderLanding();
    return;
  }

  // Auth guard — logged in but name not set → onboarding
  if (s.user && !s.user.name && hash !== 'onboarding') {
    renderOnboarding();
    return;
  }
  if (s.user && s.user.name && !s.onboarded && hash !== 'onboarding') {
    renderOnboarding();
    return;
  }

  // Route matching
  if (!hash || hash === 'landing') {
    if (s.user && s.user.name && s.onboarded) { navigate('dashboard'); return; }
    renderLanding();
  } else if (hash === 'onboarding') {
    renderOnboarding();
  } else if (hash === 'dashboard') {
    renderDashboard();
  } else if (hash.startsWith('lesson/')) {
    const parts = hash.split('/');
    renderLesson(parts[1] || 1, parts[2] || 0);
  } else if (hash.startsWith('quiz/')) {
    const parts = hash.split('/');
    renderQuiz(parts[1] || 1);
  } else if (hash === 'achievements') {
    renderAchievements();
  } else {
    navigate('dashboard');
  }

  // Wire up topbar shared events (after page rendered)
  setTimeout(() => {
    document.getElementById('topbar-logo')?.addEventListener('click', () => navigate('dashboard'));
    document.getElementById('topbar-achievements')?.addEventListener('click', () => navigate('achievements'));
    document.getElementById('topbar-logout')?.addEventListener('click', () => navigate('logout'));
  }, 0);
}

// ── Boot ─────────────────────────────────────────────────
function boot() {
  // Hide loading screen with a short delay for effect
  const loadingScreen = document.getElementById('loading-screen');
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => loadingScreen.remove(), 500);
    }
    route();
  }, 1200);
}

// ── Event listeners ──────────────────────────────────────
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', boot);

// Handle keyboard navigation for role="button" elements
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    const el = document.activeElement;
    if (el && (el.getAttribute('role') === 'button' || el.classList.contains('day-card') || el.classList.contains('goal-option'))) {
      e.preventDefault();
      el.click();
    }
  }
});
