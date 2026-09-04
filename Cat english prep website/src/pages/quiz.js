// ============================================================
// pages/quiz.js
// ============================================================
import { store } from '../store.js';
import { getDay } from '../curriculum.js';
import { navigate } from '../main.js';
import { awardXP, checkBadges } from '../gamification.js';
import { Mascot, attachMascotClick, setMascotState } from '../mascot.js';
import { openChatPanel } from '../components/chatPanel.js';
import { launchConfetti } from '../components/confetti.js';
import { showToast } from '../components/toast.js';
import { renderTopbar } from './dashboard.js';

export function renderQuiz(dayNum) {
  const day = getDay(parseInt(dayNum));
  if (!day) { navigate('dashboard'); return; }

  // Shuffle questions for variety
  const questions = [...day.quiz].sort(() => Math.random() - 0.5);
  let currentQ = 0;
  let correct = 0;
  let wrong = 0;
  let answered = false;

  const s = store.get();
  const app = document.getElementById('app');

  function render() {
    if (currentQ >= questions.length) {
      renderResult();
      return;
    }
    const q = questions[currentQ];
    const progress = Math.round((currentQ / questions.length) * 100);

    app.innerHTML = `
      ${renderTopbar(s.user.name, s.gamification.xp, s.gamification.streak)}
      <div class="quiz-layout">
        <div class="quiz-container">
          <!-- Header -->
          <div class="quiz-header">
            <button class="btn btn-ghost btn-sm" id="quiz-back-btn">← Exit</button>
            <div class="progress-bar" style="flex:1;">
              <div class="progress-bar-fill purple" style="width:${progress}%"></div>
            </div>
            <div class="quiz-progress-text">Q ${currentQ + 1} / ${questions.length}</div>
          </div>

          <!-- Score line -->
          <div style="display:flex;gap:16px;margin-bottom:16px;">
            <span class="chip chip-success">✓ ${correct} correct</span>
            ${wrong > 0 ? `<span class="chip chip-error">✗ ${wrong} wrong</span>` : ''}
            <span class="chip chip-accent">Day ${day.day}: ${day.title}</span>
          </div>

          <!-- Question Card -->
          <div class="quiz-card" id="quiz-card">
            <div class="quiz-question">${q.q}</div>
            <div class="answer-options" id="answer-options">
              ${q.options.map((opt, i) => `
                <button class="answer-option" data-index="${i}" id="option-${i}" aria-label="Option ${String.fromCharCode(65+i)}: ${opt}">
                  <span class="option-label">${String.fromCharCode(65 + i)}</span>
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>
            <div id="explanation-area"></div>
          </div>

          <button class="btn btn-primary quiz-next-btn" id="next-q-btn" style="display:none;">
            ${currentQ + 1 < questions.length ? 'Next Question →' : 'See Results 🎯'}
          </button>
        </div>

        <!-- Sidebar -->
        <aside class="sidebar">
          ${Mascot.createSidebarHTML('think', `
            <div class="divider"></div>
            <div class="sidebar-section">
              <div class="sidebar-section-title">📊 Quiz Stats</div>
              <div class="sidebar-stat">
                <div class="sidebar-stat-label"><span>✅</span> Correct</div>
                <div class="sidebar-stat-value" style="color:var(--success)">${correct}</div>
              </div>
              <div class="sidebar-stat">
                <div class="sidebar-stat-label"><span>❌</span> Wrong</div>
                <div class="sidebar-stat-value" style="color:var(--error)">${wrong}</div>
              </div>
              <div class="sidebar-stat">
                <div class="sidebar-stat-label"><span>📝</span> Questions</div>
                <div class="sidebar-stat-value">${questions.length}</div>
              </div>
            </div>
            <div class="divider"></div>
            <button class="sidebar-btn" id="chat-btn-quiz">🤖 Ask CAT</button>
          `)}
        </aside>
      </div>
    `;

    answered = false;

    // Answer buttons
    document.querySelectorAll('.answer-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const selected = parseInt(btn.dataset.index);
        const isCorrect = selected === q.answer;

        // Disable all options
        document.querySelectorAll('.answer-option').forEach(b => b.disabled = true);

        // Highlight correct/wrong
        document.querySelector(`#option-${q.answer}`).classList.add('correct');
        if (!isCorrect) {
          btn.classList.add('wrong');
          wrong++;
          store.recordAnswer(false);
          awardXP('wrongAnswer');
          setMascotState('concerned');
        } else {
          correct++;
          store.recordAnswer(true);
          awardXP('correctAnswer', (badge) => showToast(`🏆 Badge: ${badge.name}!`, 'success', 4000));
          setMascotState('celebrate');
          document.getElementById('quiz-card').classList.add('animate-correct');
        }

        // Show explanation
        const expArea = document.getElementById('explanation-area');
        expArea.innerHTML = `
          <div class="explanation-box ${isCorrect ? 'correct' : 'wrong'}">
            <div class="exp-label">${isCorrect ? '🎉 Purr-fect! That\'s correct!' : '😸 Almost! Here\'s why:'}</div>
            <p>${q.explanation}</p>
          </div>
        `;

        // Show next button
        document.getElementById('next-q-btn').style.display = 'block';
        checkBadges((badge) => showToast(`🏆 Badge: ${badge.name}!`, 'success', 4000));
      });
    });

    document.getElementById('next-q-btn').addEventListener('click', () => {
      currentQ++;
      render();
    });

    document.getElementById('quiz-back-btn').addEventListener('click', () => navigate(`lesson/${day.day}/0`));
    document.getElementById('chat-btn-quiz')?.addEventListener('click', openChatPanel);
    attachMascotClick('mascot-widget', 'think');
    document.getElementById('topbar-logo')?.addEventListener('click', () => navigate('dashboard'));
  }

  function renderResult() {
    const total = questions.length;
    const scorePercent = Math.round((correct / total) * 100);
    const isPerfect = scorePercent === 100;
    const isGood = scorePercent >= 70;

    store.saveQuizScore(day.day, scorePercent);
    store.markDayDone(day.day);
    awardXP('completeDay', (badge) => showToast(`🏆 Badge: ${badge.name}!`, 'success', 4000));
    if (isPerfect) awardXP('perfectQuiz');
    checkBadges((badge) => showToast(`🏆 Badge: ${badge.name}!`, 'success', 4000));

    if (isGood) launchConfetti(4000);

    const mascotState = isPerfect ? 'fire' : isGood ? 'celebrate' : 'encourage';
    const resultMsg = isPerfect
      ? "PURR-FECT SCORE! You're absolutely amazing! 🏆"
      : isGood
      ? "Great job! You're making paw-some progress! 🐱"
      : "Good effort! Let's review and try again! 💪";

    app.innerHTML = `
      ${renderTopbar(s.user.name, store.get().gamification.xp, s.gamification.streak)}
      <div class="quiz-layout">
        <div class="quiz-container">
          <div class="quiz-result">
            <img src="/mascot/${mascotState}.png" class="quiz-result-mascot" alt="CAT celebrating" />
            <div class="chip ${isPerfect ? 'chip-accent' : isGood ? 'chip-success' : 'chip-purple'}" style="margin:0 auto 12px;">
              Day ${day.day} Complete! ${day.emoji}
            </div>
            <h2>${day.title}</h2>
            <p style="margin:8px 0 4px;">${resultMsg}</p>
            <div class="result-score">${scorePercent}%</div>

            <div class="result-stats">
              <div class="result-stat">
                <div class="result-stat-num good">${correct}</div>
                <div class="result-stat-label">Correct</div>
              </div>
              <div class="result-stat">
                <div class="result-stat-num bad">${wrong}</div>
                <div class="result-stat-label">Wrong</div>
              </div>
              <div class="result-stat">
                <div class="result-stat-num" style="color:var(--accent)">${total}</div>
                <div class="result-stat-label">Total Qs</div>
              </div>
            </div>

            ${isPerfect ? `
              <div style="background:var(--accent-dim);border:1px solid var(--accent);border-radius:var(--radius-md);padding:14px;margin:16px 0;font-family:var(--font-heading);font-size:0.95rem;">
                🏅 +50 Bonus XP for a perfect score!
              </div>
            ` : ''}

            ${day.day < 7 ? `
              <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin:16px 0;text-align:left;">
                <div style="font-family:var(--font-heading);font-size:0.85rem;font-weight:700;color:var(--accent);margin-bottom:6px;">🐱 Up next: Day ${day.day + 1}</div>
                <div style="font-size:0.9rem;color:var(--text-secondary);">${import.meta.env.VITE_NEXT || ''}</div>
              </div>
            ` : ''}

            <div class="result-actions">
              <button class="btn btn-secondary" id="result-review-btn">📖 Review Lesson</button>
              <button class="btn btn-primary" id="result-continue-btn">
                ${day.day < 7 ? 'Next Day →' : '🏆 All Done!'}
              </button>
            </div>
          </div>
        </div>

        <aside class="sidebar">
          ${Mascot.createSidebarHTML(mascotState, `
            <div class="divider"></div>
            <div class="sidebar-section">
              <div class="sidebar-section-title">📊 Quiz Summary</div>
              <div class="sidebar-stat">
                <div class="sidebar-stat-label">Score</div>
                <div class="sidebar-stat-value" style="color:${isPerfect ? 'var(--accent)' : isGood ? 'var(--success)' : 'var(--error)'}">${scorePercent}%</div>
              </div>
              <div class="sidebar-stat">
                <div class="sidebar-stat-label">XP Earned</div>
                <div class="sidebar-stat-value" style="color:var(--accent)">+${100 + (isPerfect ? 50 : 0) + correct * 10}</div>
              </div>
            </div>
            <div class="divider"></div>
            <button class="sidebar-btn primary" id="chat-btn-result">🤖 Ask CAT</button>
          `)}
        </aside>
      </div>
    `;

    document.getElementById('result-review-btn').addEventListener('click', () => navigate(`lesson/${day.day}/0`));
    document.getElementById('result-continue-btn').addEventListener('click', () => {
      if (day.day < 7) navigate(`lesson/${day.day + 1}/0`);
      else navigate('achievements');
    });
    document.getElementById('chat-btn-result')?.addEventListener('click', openChatPanel);
    attachMascotClick('mascot-widget', mascotState);
    document.getElementById('topbar-logo')?.addEventListener('click', () => navigate('dashboard'));
    document.getElementById('topbar-achievements')?.addEventListener('click', () => navigate('achievements'));
  }

  // Start quiz
  render();
}
