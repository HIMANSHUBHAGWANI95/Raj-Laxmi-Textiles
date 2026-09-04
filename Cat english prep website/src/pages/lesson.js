// ============================================================
// pages/lesson.js
// ============================================================
import { store } from '../store.js';
import { curriculum, getDay } from '../curriculum.js';
import { navigate } from '../main.js';
import { awardXP, checkBadges } from '../gamification.js';
import { Mascot, attachMascotClick, setMascotState } from '../mascot.js';
import { openChatPanel } from '../components/chatPanel.js';
import { showToast } from '../components/toast.js';
import { renderTopbar } from './dashboard.js';

export function renderLesson(dayNum, topicIndex = 0) {
  const day = getDay(parseInt(dayNum));
  if (!day) { navigate('dashboard'); return; }

  const topicIdx = Math.max(0, Math.min(parseInt(topicIndex), day.topics.length - 1));
  const topic = day.topics[topicIdx];
  const s = store.get();
  const xp = s.gamification.xp;
  const streak = s.gamification.streak;
  const isTopicDone = store.isTopicDone(day.day, topicIdx);

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderTopbar(s.user.name, xp, streak)}
    <div class="lesson-layout">
      <main class="lesson-main">
        <!-- Breadcrumb -->
        <div class="lesson-breadcrumb" id="back-btn" role="button" tabindex="0">
          ← Back to Dashboard
        </div>

        <!-- Lesson Header -->
        <div class="lesson-header">
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
            <span class="chip chip-accent">Day ${day.day}</span>
            <span class="chip chip-purple">${day.emoji} ${day.title}</span>
            ${isTopicDone ? '<span class="chip chip-success">✓ Completed</span>' : ''}
          </div>
          <h1>${topic.name}</h1>
        </div>

        <!-- Topic Navigation Pills -->
        <div class="topics-nav" id="topics-nav">
          ${day.topics.map((t, i) => `
            <button class="topic-pill ${i === topicIdx ? 'active' : store.isTopicDone(day.day, i) ? 'done' : ''}"
                    data-topic="${i}" aria-label="Topic: ${t.name}">
              ${store.isTopicDone(day.day, i) ? '✓ ' : ''}${t.name}
            </button>
          `).join('')}
        </div>

        <!-- Topic Content -->
        <div class="topic-content" id="topic-content">
          ${renderTopicContent(topic.content)}
          ${renderMiniQuiz(topic.miniQuiz)}
        </div>

        <!-- Lesson Navigation -->
        <div class="lesson-nav">
          ${topicIdx > 0
            ? `<button class="btn btn-secondary" id="prev-topic-btn">← Previous Topic</button>`
            : `<button class="btn btn-secondary" id="back-dash-btn">🏠 Dashboard</button>`
          }
          ${topicIdx < day.topics.length - 1
            ? `<button class="btn btn-primary" id="next-topic-btn">Next Topic →</button>`
            : `<button class="btn btn-primary" id="start-quiz-btn">🎯 Take Day ${day.day} Quiz →</button>`
          }
        </div>
      </main>

      <!-- Sidebar -->
      <aside class="sidebar">
        ${Mascot.createSidebarHTML('teach', `
          <div class="divider"></div>
          <div class="sidebar-section">
            <div class="sidebar-section-title">📊 Day ${day.day} Progress</div>
            <div style="margin:8px 0;">
              <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:6px;">
                <span style="color:var(--text-muted)">Topics</span>
                <span style="font-family:var(--font-heading);font-weight:700;">${getTopicsDoneCount(day)} / ${day.topics.length}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" style="width:${store.getDayProgress(day.day, day.topics.length)}%"></div>
              </div>
            </div>
            ${day.topics.map((t, i) => `
              <div class="sidebar-stat">
                <div class="sidebar-stat-label" style="font-size:0.8rem;">
                  <span>${store.isTopicDone(day.day, i) ? '✅' : i === topicIdx ? '📖' : '⬜'}</span>
                  ${t.name}
                </div>
              </div>
            `).join('')}
          </div>
          <div class="divider"></div>
          <button class="sidebar-btn primary" id="chat-btn">🤖 Ask CAT</button>
          <button class="sidebar-btn" id="quiz-sidebar-btn">🎯 Go to Quiz</button>
        `)}
      </aside>
    </div>
  `;

  // Mark topic as read after 3 seconds
  if (!isTopicDone) {
    setTimeout(() => {
      store.markTopicDone(day.day, topicIdx);
      awardXP('completeTopic', handleBadgeUnlock);
      showToast(`+50 XP — "${topic.name}" completed! 🐱`, 'success');
      const pill = document.querySelector(`.topic-pill[data-topic="${topicIdx}"]`);
      if (pill) { pill.classList.add('done'); pill.classList.remove('active'); pill.textContent = `✓ ${topic.name}`; }
      checkBadges(handleBadgeUnlock);
    }, 3000);
  }

  // Nav events
  document.getElementById('back-btn').addEventListener('click', () => navigate('dashboard'));
  document.getElementById('back-dash-btn')?.addEventListener('click', () => navigate('dashboard'));
  document.getElementById('prev-topic-btn')?.addEventListener('click', () => navigate(`lesson/${day.day}/${topicIdx - 1}`));
  document.getElementById('next-topic-btn')?.addEventListener('click', () => {
    store.markTopicDone(day.day, topicIdx);
    navigate(`lesson/${day.day}/${topicIdx + 1}`);
  });
  document.getElementById('start-quiz-btn')?.addEventListener('click', () => {
    store.markTopicDone(day.day, topicIdx);
    navigate(`quiz/${day.day}`);
  });
  document.getElementById('quiz-sidebar-btn')?.addEventListener('click', () => navigate(`quiz/${day.day}`));
  document.getElementById('chat-btn').addEventListener('click', openChatPanel);
  document.getElementById('topbar-logo')?.addEventListener('click', () => navigate('dashboard'));
  document.getElementById('topbar-achievements')?.addEventListener('click', () => navigate('achievements'));

  // Topic pill navigation
  document.querySelectorAll('.topic-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      store.markTopicDone(day.day, topicIdx);
      navigate(`lesson/${day.day}/${pill.dataset.topic}`);
    });
  });

  // Attach mini quiz answer button handlers
  document.querySelectorAll('.mini-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const qIdx = parseInt(btn.dataset.qidx);
      const oIdx = parseInt(btn.dataset.oidx);
      const q = topic.miniQuiz[qIdx];
      const card = document.getElementById(`mini-q-${qIdx}`);
      const options = card.querySelectorAll('.mini-option');

      if (card.classList.contains('answered')) return;
      card.classList.add('answered');

      // Disable all options
      options.forEach(b => b.disabled = true);

      const isCorrect = oIdx === q.answer;
      btn.classList.add(isCorrect ? 'correct' : 'wrong');
      if (!isCorrect) {
        options[q.answer].classList.add('correct');
        setMascotState('concerned');
      } else {
        setMascotState('celebrate');
        card.classList.add('animate-correct');
      }

      // Record answer and award XP
      store.recordAnswer(isCorrect);
      awardXP(isCorrect ? 'correctAnswer' : 'wrongAnswer', handleBadgeUnlock);

      // Show explanation
      const expDiv = document.getElementById(`mini-exp-${qIdx}`);
      expDiv.innerHTML = `
        <div class="explanation-box ${isCorrect ? 'correct' : 'wrong'}" style="margin-top: var(--space-md);">
          <div class="exp-label">${isCorrect ? '🎉 Correct!' : '🐱 Let\'s learn why:'}</div>
          <p>${q.explanation}</p>
        </div>
      `;
      expDiv.style.display = 'block';
    });
  });

  attachMascotClick('mascot-widget', 'teach');
}

function renderMiniQuiz(miniQuiz) {
  if (!miniQuiz || miniQuiz.length === 0) return '';
  return `
    <div class="mini-quiz-section">
      <h3 style="margin-top: var(--space-xl); border-top: 1px solid var(--border); padding-top: var(--space-xl);">
        🎯 Concept Check Quiz
      </h3>
      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: var(--space-lg);">
        Test your understanding of the concept above before moving forward!
      </p>
      <div class="mini-quiz-list">
        ${miniQuiz.map((q, qIdx) => `
          <div class="mini-quiz-card" id="mini-q-${qIdx}">
            <div class="mini-quiz-question">Q${qIdx + 1}: ${q.q}</div>
            <div class="answer-options">
              ${q.options.map((opt, oIdx) => `
                <button class="answer-option mini-option" data-qidx="${qIdx}" data-oidx="${oIdx}">
                  <span class="option-label">${String.fromCharCode(65 + oIdx)}</span>
                  <span>${opt}</span>
                </button>
              `).join('')}
            </div>
            <div class="mini-quiz-explanation" id="mini-exp-${qIdx}" style="display: none;"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function getTopicsDoneCount(day) {
  let count = 0;
  for (let i = 0; i < day.topics.length; i++) {
    if (store.isTopicDone(day.day, i)) count++;
  }
  return count;
}

function handleBadgeUnlock(badge) {
  showToast(`🏆 Badge unlocked: ${badge.name}!`, 'success', 4000);
}

function renderTopicContent(content) {
  return content.map(block => {
    switch (block.type) {
      case 'text':
        return `
          <div class="topic-section">
            ${block.heading ? `<h3>${block.heading}</h3>` : ''}
            <p>${block.body}</p>
          </div>
        `;
      case 'rule':
        return `
          <div class="rule-box">
            <div class="rule-icon">${block.icon || '📌'}</div>
            <p>${block.body}</p>
          </div>
        `;
      case 'example':
        return `
          <div class="example-box">
            <div class="example-label">${block.label}</div>
            <ul>
              ${block.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        `;
      case 'error_correct':
        return `
          <div class="error-correct-grid">
            <div class="error-box wrong">
              <div class="box-label">❌ Incorrect</div>
              <p>${block.wrong}</p>
            </div>
            <div class="error-box right">
              <div class="box-label">✅ Correct</div>
              <p>${block.right}</p>
            </div>
          </div>
          ${block.note ? `<p style="font-size:0.82rem;color:var(--text-muted);margin-top:4px;font-style:italic;">💡 ${block.note}</p>` : ''}
        `;
      case 'cat_tip':
        return `
          <div class="cat-tip">
            <div class="tip-icon">🐱</div>
            <p>${block.body}</p>
          </div>
        `;
      case 'visual':
        return `
          <div class="visual-block">
            ${block.label ? `<div class="visual-label">${block.label}</div>` : ''}
            <pre class="visual-diagram">${block.diagram}</pre>
          </div>
        `;
      case 'table':
        return `
          <div class="table-wrapper">
            ${block.label ? `<div class="table-label">${block.label}</div>` : ''}
            <table class="lesson-table">
              <thead><tr>${block.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
              <tbody>${block.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
          </div>
        `;
      case 'levels':
        return `
          <div class="levels-block">
            ${block.label ? `<div class="levels-label">${block.label}</div>` : ''}
            <div class="levels-grid">
              ${block.beginner ? `<div class="level-card beginner"><div class="level-tag">🟢 Beginner</div><p>${block.beginner}</p></div>` : ''}
              ${block.intermediate ? `<div class="level-card intermediate"><div class="level-tag">🟡 Intermediate</div><p>${block.intermediate}</p></div>` : ''}
              ${block.advanced ? `<div class="level-card advanced"><div class="level-tag">🔴 Advanced</div><p>${block.advanced}</p></div>` : ''}
              ${block.cat ? `<div class="level-card cat"><div class="level-tag">🏆 CAT Level</div><p>${block.cat}</p></div>` : ''}
              ${block.editorial ? `<div class="level-card editorial"><div class="level-tag">📰 Editorial</div><p>${block.editorial}</p></div>` : ''}
            </div>
          </div>
        `;
      case 'memory':
        return `
          <div class="memory-box">
            <div class="memory-icon">🧠</div>
            <div>
              <div class="memory-title">${block.title || 'Memory Trick'}</div>
              <p>${block.body}</p>
            </div>
          </div>
        `;
      default:
        return '';
    }
  }).join('');
}
