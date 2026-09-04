// ============================================================
// pages/achievements.js
// ============================================================
import { store } from '../store.js';
import { navigate } from '../main.js';
import { BADGES, getLevel, getXPMessage } from '../gamification.js';
import { Mascot, attachMascotClick } from '../mascot.js';
import { openChatPanel } from '../components/chatPanel.js';
import { renderTopbar } from './dashboard.js';

export function renderAchievements() {
  const s = store.get();
  const xp = s.gamification.xp;
  const streak = s.gamification.streak;
  const unlockedBadges = s.gamification.badges;
  const level = getLevel(xp);
  const accuracy = s.gamification.totalAnswered > 0
    ? Math.round((s.gamification.totalCorrect / s.gamification.totalAnswered) * 100)
    : 0;

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderTopbar(s.user.name, xp, streak)}
    <div class="achievements-layout">
      <main class="achievements-main">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;">
          <button class="btn btn-ghost btn-sm" id="back-btn">← Dashboard</button>
          <h2 style="margin:0;">🏆 Achievements</h2>
        </div>

        <!-- Summary Cards -->
        <div class="achievements-summary">
          <div class="summary-card">
            <div class="summary-card-num" style="color:var(--accent)">${xp}</div>
            <div class="summary-card-label">Total XP</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">${level.name} · Lvl ${level.level}</div>
          </div>
          <div class="summary-card">
            <div class="summary-card-num" style="color:var(--error)">🔥 ${streak}</div>
            <div class="summary-card-label">Day Streak</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">${streak > 0 ? 'Keep it going!' : 'Start today!'}</div>
          </div>
          <div class="summary-card">
            <div class="summary-card-num" style="color:var(--success)">${accuracy}%</div>
            <div class="summary-card-label">Quiz Accuracy</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">${s.gamification.totalAnswered} questions answered</div>
          </div>
        </div>

        <!-- XP Level Progress -->
        <div class="section-title">⭐ Level Progress</div>
        <div class="card" style="margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <div>
              <div style="font-family:var(--font-heading);font-size:1.2rem;font-weight:700;">${level.name}</div>
              <div style="font-size:0.85rem;color:var(--text-secondary);">Level ${level.level} • ${xp} XP total</div>
            </div>
            <div style="text-align:right;">
              ${level.next
                ? `<div style="font-size:0.85rem;color:var(--text-secondary);">Next: <strong style="color:var(--text-primary)">${level.next.name}</strong></div>
                   <div style="font-size:0.8rem;color:var(--text-muted);">${level.next.min - xp} XP needed</div>`
                : '<div class="chip chip-accent">MAX LEVEL 🏆</div>'
              }
            </div>
          </div>
          <div class="progress-bar" style="height:10px;">
            <div class="progress-bar-fill" style="width:${level.progress}%"></div>
          </div>
          <div class="cat-tip" style="margin-top:16px;">
            <div class="tip-icon">🐱</div>
            <p>${getXPMessage(xp)}</p>
          </div>
        </div>

        <!-- Daily Progress -->
        <div class="section-title">📅 Daily Progress</div>
        <div class="card" style="margin-bottom:24px;">
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:8px;text-align:center;">
            ${[1,2,3,4,5,6,7].map(d => {
              const isDone = store.isDayDone(d);
              const score = s.progress.quizScores[`day${d}`];
              return `
                <div style="padding:10px 4px;border-radius:var(--radius-md);background:${isDone ? 'var(--accent-dim)' : 'var(--bg-input)'};border:1px solid ${isDone ? 'var(--accent)' : 'var(--border)'};">
                  <div style="font-size:1.2rem;">${isDone ? '✅' : '⬜'}</div>
                  <div style="font-family:var(--font-heading);font-size:0.7rem;font-weight:700;margin-top:4px;">Day ${d}</div>
                  ${score !== undefined ? `<div style="font-size:0.65rem;color:var(--accent);font-weight:700;">${score}%</div>` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Badges -->
        <div class="section-title">🏅 Badges (${unlockedBadges.length} / ${BADGES.length})</div>
        <div class="badges-grid">
          ${BADGES.map(badge => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return `
              <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}" title="${badge.desc}">
                ${!isUnlocked ? '<div class="badge-locked-overlay">🔒</div>' : ''}
                <div class="badge-emoji">${badge.emoji}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.desc}</div>
                ${isUnlocked
                  ? '<div class="chip chip-success" style="margin-top:8px;">Unlocked ✓</div>'
                  : '<div class="chip" style="margin-top:8px;background:var(--bg-input);color:var(--text-muted);">Locked</div>'}
              </div>
            `;
          }).join('')}
        </div>
      </main>

      <aside class="sidebar">
        ${Mascot.createSidebarHTML(unlockedBadges.length >= 5 ? 'celebrate' : 'encourage', `
          <div class="divider"></div>
          <div class="sidebar-section">
            <div class="sidebar-section-title">📊 Stats</div>
            <div class="sidebar-stat">
              <div class="sidebar-stat-label"><span>🏅</span> Badges</div>
              <div class="sidebar-stat-value">${unlockedBadges.length}/${BADGES.length}</div>
            </div>
            <div class="sidebar-stat">
              <div class="sidebar-stat-label"><span>✅</span> Correct</div>
              <div class="sidebar-stat-value" style="color:var(--success)">${s.gamification.totalCorrect}</div>
            </div>
            <div class="sidebar-stat">
              <div class="sidebar-stat-label"><span>📚</span> Topics</div>
              <div class="sidebar-stat-value">${s.progress.completedTopics.length}</div>
            </div>
            <div class="sidebar-stat">
              <div class="sidebar-stat-label"><span>📅</span> Days</div>
              <div class="sidebar-stat-value">${s.progress.completedDays.length}/7</div>
            </div>
          </div>
          <div class="divider"></div>
          <button class="sidebar-btn primary" id="chat-btn">🤖 Ask CAT</button>
          <button class="sidebar-btn" id="study-btn">📚 Keep Studying</button>
          <button class="sidebar-btn" id="logout-btn" style="border-color: rgba(255, 82, 82, 0.3); color: var(--error); background: rgba(255, 82, 82, 0.03);">🚪 Log Out</button>
        `)}
      </aside>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', () => navigate('dashboard'));
  document.getElementById('chat-btn').addEventListener('click', openChatPanel);
  document.getElementById('study-btn').addEventListener('click', () => navigate('dashboard'));
  document.getElementById('logout-btn').addEventListener('click', () => navigate('logout'));
  document.getElementById('topbar-logo')?.addEventListener('click', () => navigate('dashboard'));
  attachMascotClick('mascot-widget', unlockedBadges.length >= 5 ? 'celebrate' : 'encourage');
}
