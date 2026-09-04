// ============================================================
// pages/dashboard.js
// ============================================================
import { store } from '../store.js';
import { curriculum } from '../curriculum.js';
import { navigate } from '../main.js';
import { Mascot, attachMascotClick } from '../mascot.js';
import { openChatPanel } from '../components/chatPanel.js';
import { getLevel, BADGES } from '../gamification.js';

export function renderDashboard() {
  const s = store.get();
  const name = s.user.name || 'Student';
  const xp = s.gamification.xp;
  const streak = s.gamification.streak;
  const level = getLevel(xp);
  const badges = s.gamification.badges;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Find current day to continue
  const continueDay = curriculum.find(d => !store.isDayDone(d.day)) || curriculum[curriculum.length - 1];

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderTopbar(name, xp, streak)}
    <div class="dashboard-layout">
      <main class="dashboard-main">
        <div class="dashboard-greeting">
          <h1>${greeting}, <span>${name}</span>! 👋</h1>
          <p>${streak > 0 ? `🔥 ${streak}-day streak — keep it alive!` : 'Start your grammar journey today!'}</p>
        </div>

        <!-- Continue Learning Card -->
        <div class="continue-card" id="continue-card" role="button" tabindex="0" aria-label="Continue to ${continueDay.title}">
          <div class="continue-card-info">
            <div class="continue-card-day">📅 Day ${continueDay.day} of 7</div>
            <div class="continue-card-title">${continueDay.emoji} ${continueDay.title}</div>
            <div class="continue-card-meta">${continueDay.tagline}</div>
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
              <span class="chip chip-accent">${continueDay.topics.length} topics</span>
              <span class="chip chip-purple">${continueDay.quiz.length} quiz questions</span>
              <span class="chip chip-teal">+${continueDay.xpReward} XP</span>
            </div>
          </div>
          <img src="${store.isDayDone(continueDay.day) ? '/mascot/celebrate.png' : '/mascot/teach.png'}" class="continue-card-mascot" alt="CAT" />
        </div>

        <!-- 7 Day Grid -->
        <div class="section-title">📚 Your 7-Day Curriculum</div>
        <div class="days-grid" id="days-grid">
          ${curriculum.map(day => renderDayCard(day)).join('')}
        </div>

        <!-- Recent Badges -->
        ${badges.length > 0 ? `
          <div class="section-title">🏆 Your Badges</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;">
            ${badges.slice(-6).map(badgeId => {
              const badge = BADGES.find(b => b.id === badgeId);
              return badge ? `<div title="${badge.desc}" style="background:var(--bg-card);border:1px solid var(--accent);border-radius:var(--radius-md);padding:12px 16px;text-align:center;cursor:default;">
                <div style="font-size:1.6rem;">${badge.emoji}</div>
                <div style="font-size:0.75rem;font-family:var(--font-heading);font-weight:700;margin-top:4px;">${badge.name}</div>
              </div>` : '';
            }).join('')}
            <a href="#achievements" class="card" style="display:flex;align-items:center;justify-content:center;padding:12px 16px;cursor:pointer;border-style:dashed;font-family:var(--font-heading);font-size:0.85rem;color:var(--text-muted);" id="view-all-badges">View All →</a>
          </div>
        ` : ''}

        <!-- Level Card -->
        <div class="section-title">⭐ Your Progress</div>
        <div class="card" style="margin-bottom:24px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <div>
              <div style="font-family:var(--font-heading);font-size:1.1rem;font-weight:700;">${level.name}</div>
              <div style="font-size:0.85rem;color:var(--text-secondary);">Level ${level.level}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-family:var(--font-heading);font-size:1.4rem;font-weight:800;color:var(--accent);">${xp} XP</div>
              ${level.next ? `<div style="font-size:0.8rem;color:var(--text-muted);">${level.next.min - xp} XP to ${level.next.name}</div>` : '<div style="font-size:0.8rem;color:var(--success);">Max Level! 🏆</div>'}
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width:${level.progress}%"></div>
          </div>
        </div>
      </main>

      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        ${Mascot.createSidebarHTML(streak >= 3 ? 'fire' : 'teach')}
        <div class="divider"></div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">📊 Today's Stats</div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-label"><span>🔥</span> Streak</div>
            <div class="sidebar-stat-value" style="color:var(--accent)">${streak} days</div>
          </div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-label"><span>⭐</span> Total XP</div>
            <div class="sidebar-stat-value" style="color:var(--accent)">${xp}</div>
          </div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-label"><span>🏆</span> Badges</div>
            <div class="sidebar-stat-value">${badges.length}</div>
          </div>
          <div class="sidebar-stat">
            <div class="sidebar-stat-label"><span>📅</span> Days Done</div>
            <div class="sidebar-stat-value">${s.progress.completedDays.length}/7</div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">📅 This Week</div>
          <div class="streak-week">
            ${renderStreakWeek(s.gamification.lastStudyDate)}
          </div>
        </div>

        <div class="divider"></div>

        <button class="sidebar-btn primary" id="chat-btn">🤖 Ask CAT Anything</button>
        <button class="sidebar-btn" id="achievements-btn">🏆 View Achievements</button>
        <button class="sidebar-btn" id="logout-btn" style="border-color: rgba(255, 82, 82, 0.3); color: var(--error); background: rgba(255, 82, 82, 0.03);">🚪 Log Out</button>
      </aside>
    </div>
  `;

  // Events
  document.getElementById('continue-card').addEventListener('click', () => navigate(`lesson/${continueDay.day}/0`));
  document.getElementById('chat-btn').addEventListener('click', openChatPanel);
  document.getElementById('achievements-btn').addEventListener('click', () => navigate('achievements'));
  document.getElementById('logout-btn').addEventListener('click', () => navigate('logout'));
  document.getElementById('view-all-badges')?.addEventListener('click', () => navigate('achievements'));

  document.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', () => {
      const day = parseInt(card.dataset.day);
      navigate(`lesson/${day}/0`);
    });
  });

  attachMascotClick('mascot-widget', streak >= 3 ? 'fire' : 'teach');
}

function renderDayCard(day) {
  const isDone = store.isDayDone(day.day);
  const isCurrent = !isDone && (day.day === 1 || store.isDayDone(day.day - 1));
  const progress = store.getDayProgress(day.day, day.topics.length);
  const score = store.get().progress.quizScores[`day${day.day}`];

  return `
    <div class="day-card ${isDone ? 'completed' : isCurrent ? 'current' : ''} card-hover"
         data-day="${day.day}"
         role="button" tabindex="0"
         aria-label="Day ${day.day}: ${day.title}">
      <div class="day-number">Day ${day.day}</div>
      <div class="day-title">${day.emoji} ${day.title}</div>
      <div class="day-topics">${day.topics.map(t => t.name).join(' · ')}</div>
      ${progress > 0 ? `
        <div class="day-progress-bar">
          <div class="progress-bar">
            <div class="progress-bar-fill ${isDone ? 'teal' : ''}" style="width:${isDone ? 100 : progress}%"></div>
          </div>
        </div>
      ` : ''}
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
        <div class="day-xp">⭐ ${day.xpReward} XP</div>
        ${score !== undefined ? `<div class="chip chip-success">Quiz: ${score}%</div>` : ''}
      </div>
    </div>
  `;
}

function renderStreakWeek(lastDate) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date();
  const todayDay = (today.getDay() + 6) % 7; // 0=Mon
  return days.map((d, i) => {
    const isDone = i < todayDay && lastDate;
    const isToday = i === todayDay;
    return `<div class="streak-day ${isDone ? 'done' : isToday ? 'active' : ''}">
      <div class="day-dot"></div>
      <span>${d}</span>
    </div>`;
  }).join('');
}

export function renderTopbar(name, xp, streak) {
  return `
    <nav class="topbar" id="topbar">
      <div class="topbar-logo" id="topbar-logo" role="button" tabindex="0" aria-label="Go to dashboard">
        <img src="/mascot/wave.png" alt="CAT logo" />
        CAT
      </div>
      <div class="topbar-stats">
        <div class="topbar-stat">
          <span class="stat-icon">🔥</span>
          <span id="topbar-streak">${streak}</span>
        </div>
        <div class="topbar-stat">
          <span class="stat-icon">⭐</span>
          <span id="topbar-xp">${xp}</span>
        </div>
        <div class="topbar-stat" style="cursor:pointer;" id="topbar-achievements" title="Achievements">
          <span class="stat-icon">🏆</span>
        </div>
        <div class="topbar-user-chip" title="Logged in as ${name}">
          <span class="stat-icon">👤</span>
          <span class="topbar-username">${name}</span>
        </div>
        <button class="topbar-logout-btn" id="topbar-logout" title="Logout" aria-label="Logout">
          <span>⏏</span>
        </button>
      </div>
    </nav>
  `;
}

