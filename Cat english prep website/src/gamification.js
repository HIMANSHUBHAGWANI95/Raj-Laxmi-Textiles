// ============================================================
// gamification.js — XP, Streaks, Badges logic
// ============================================================
import { store } from './store.js';
import { showToast } from './components/toast.js';

export const XP_REWARDS = {
  completeTopic:    50,
  correctAnswer:    10,
  wrongAnswer:       2,   // still a little for trying
  perfectQuiz:      50,   // bonus on top of per-question XP
  completeDay:     100,
  streakDay:        75,
  openChat:          5,
};

export const BADGES = [
  {
    id: 'first_step',
    name: 'Rising Star 🌟',
    desc: 'Complete your first lesson topic',
    emoji: '🌟',
    check: (s) => s.progress.completedTopics.length >= 1,
  },
  {
    id: 'day1_done',
    name: 'Grammar Rookie 📖',
    desc: 'Complete Day 1: Parts of Speech',
    emoji: '📖',
    check: (s) => s.progress.completedDays.includes(1),
  },
  {
    id: 'day3_done',
    name: 'Halfway Hero 🏅',
    desc: 'Complete Day 3: Tenses',
    emoji: '🏅',
    check: (s) => s.progress.completedDays.includes(3),
  },
  {
    id: 'all7_done',
    name: 'Grammar Master 🎓',
    desc: 'Complete all 7 days of the bootcamp',
    emoji: '🎓',
    check: (s) => s.progress.completedDays.length >= 7,
  },
  {
    id: 'streak_3',
    name: 'Streak Warrior 🔥',
    desc: 'Maintain a 3-day study streak',
    emoji: '🔥',
    check: (s) => s.gamification.streak >= 3,
  },
  {
    id: 'streak_7',
    name: 'On Fire! 🔥🔥',
    desc: 'Maintain a 7-day study streak',
    emoji: '🔥🔥',
    check: (s) => s.gamification.streak >= 7,
  },
  {
    id: 'perfect_quiz',
    name: 'Purr-fect Score 💯',
    desc: 'Score 100% on any day\'s quiz',
    emoji: '💯',
    check: (s) => Object.values(s.progress.quizScores).some(score => score === 100),
  },
  {
    id: 'xp_500',
    name: 'XP Hunter ⭐',
    desc: 'Earn 500 total XP',
    emoji: '⭐',
    check: (s) => s.gamification.xp >= 500,
  },
  {
    id: 'xp_1000',
    name: 'Grammar Wizard 🧙',
    desc: 'Earn 1000 total XP',
    emoji: '🧙',
    check: (s) => s.gamification.xp >= 1000,
  },
  {
    id: 'chat_used',
    name: 'Chat Buddy 💬',
    desc: 'Use the AI chat feature',
    emoji: '💬',
    check: (s) => s.chatHistory.length >= 1,
  },
  {
    id: 'accurate',
    name: 'Sharp Mind 🎯',
    desc: 'Answer 20 questions correctly',
    emoji: '🎯',
    check: (s) => s.gamification.totalCorrect >= 20,
  },
  {
    id: 'night_owl',
    name: 'Night Owl 🦉',
    desc: 'Study after 10 PM',
    emoji: '🦉',
    check: () => {
      const hour = new Date().getHours();
      return hour >= 22 || hour < 4;
    },
  },
];

// Check & unlock any newly earned badges
export function checkBadges(onUnlock) {
  const s = store.get();
  for (const badge of BADGES) {
    if (!store.hasBadge(badge.id) && badge.check(s)) {
      const isNew = store.unlockBadge(badge.id);
      if (isNew && onUnlock) {
        onUnlock(badge);
      }
    }
  }
}

// Award XP and check badges
export function awardXP(type, onBadgeUnlock) {
  const amount = XP_REWARDS[type] || 0;
  if (amount <= 0) return;
  const newTotal = store.addXP(amount);
  showXPFloat(amount);
  checkBadges(onBadgeUnlock);
  return newTotal;
}

// Floating XP animation
function showXPFloat(amount) {
  const el = document.createElement('div');
  el.className = 'xp-toast';
  el.textContent = `+${amount} XP`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2100);
}

// Update streak
export function recordStudySession() {
  const streak = store.updateStreak();
  if (streak > 1) {
    showToast(`🔥 ${streak}-day streak! Keep going!`, 'info');
  }
  awardXP('streakDay');
  return streak;
}

// XP level system
export function getLevel(xp) {
  const levels = [
    { level: 1, name: 'Beginner',      min: 0 },
    { level: 2, name: 'Learner',       min: 200 },
    { level: 3, name: 'Student',       min: 500 },
    { level: 4, name: 'Scholar',       min: 900 },
    { level: 5, name: 'Expert',        min: 1400 },
    { level: 6, name: 'Grammar Pro',   min: 2000 },
    { level: 7, name: 'Grammar Ace',   min: 2700 },
  ];
  let current = levels[0];
  let next = levels[1];
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].min) {
      current = levels[i];
      next = levels[i + 1] || null;
    }
  }
  const progress = next
    ? Math.round(((xp - current.min) / (next.min - current.min)) * 100)
    : 100;
  return { ...current, next, progress, xp };
}

// Mascot messages by XP milestone
export function getXPMessage(xp) {
  if (xp >= 2000) return "2000 XP! Even I\'m impressed! 😸";
  if (xp >= 1000) return "1000 XP! You\'re a grammar wizard! 🧙";
  if (xp >= 500)  return "500 XP! Faster than I chase mice! 🐭";
  if (xp >= 200)  return "200 XP! You\'re on a roll! 🐱";
  if (xp >= 100)  return "100 XP! You\'re a natural! ⭐";
  return "Keep going, you\'re doing great! 💪";
}
