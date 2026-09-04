// ============================================================
// store.js — Multi-user localStorage-backed state manager
// ============================================================

const STORE_KEY_PREFIX = 'cat_grammar_user_';
const USERS_LIST_KEY = 'cat_grammar_users_list';
const CURRENT_USER_KEY = 'cat_grammar_current_user';

const defaultState = {
  user: { username: '', name: '', email: '', joinDate: null, dailyGoal: 30 },
  progress: {
    completedTopics: [],   // ["day1-topic0", "day2-topic1", ...]
    completedDays: [],     // [1, 2, 3, ...]
    quizScores: {},        // { "day1": 85, "day2": 90, ... }
    currentDay: 1,
    currentTopicIndex: 0,
  },
  gamification: {
    xp: 0,
    streak: 0,
    lastStudyDate: null,
    badges: [],
    totalCorrect: 0,
    totalAnswered: 0,
  },
  settings: { reduceMotion: false },
  chatHistory: [],
  onboarded: false,
};

// Get list of all registered usernames
function getUsersList() {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Save list of registered usernames
function saveUsersList(list) {
  try {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save users list:', e);
  }
}

// Get currently logged-in username
function getCurrentUsername() {
  return localStorage.getItem(CURRENT_USER_KEY) || null;
}

// Set currently logged-in username
function setCurrentUsername(username) {
  if (username) {
    localStorage.setItem(CURRENT_USER_KEY, username);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

function loadUserState(username) {
  try {
    const raw = localStorage.getItem(STORE_KEY_PREFIX + username);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    return deepMerge(JSON.parse(JSON.stringify(defaultState)), saved);
  } catch {
    return null;
  }
}

function saveUserState(username, stateData) {
  try {
    localStorage.setItem(STORE_KEY_PREFIX + username, JSON.stringify(stateData));
  } catch (e) {
    console.error(`Failed to save user state for ${username}:`, e);
  }
}

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Initialize active state
let currentUsername = getCurrentUsername();
let state = currentUsername ? loadUserState(currentUsername) : null;

export const store = {
  get: () => state,
  save: () => {
    if (currentUsername && state) {
      saveUserState(currentUsername, state);
    }
  },

  update(path, value) {
    if (!state) return;
    const keys = path.split('.');
    let obj = state;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    this.save();
  },

  // Auth Helpers
  login(username) {
    const cleanUsername = username.trim().toLowerCase();
    const users = getUsersList();
    if (!users.includes(cleanUsername)) {
      return false; // User does not exist
    }
    const loadedState = loadUserState(cleanUsername);
    if (!loadedState) return false;

    currentUsername = cleanUsername;
    setCurrentUsername(cleanUsername);
    state = loadedState;
    this.save();
    return true;
  },

  register(username, name, email) {
    const cleanUsername = username.trim().toLowerCase();
    const users = getUsersList();
    if (users.includes(cleanUsername)) {
      return false; // User already exists
    }

    // Create new user state
    const newState = JSON.parse(JSON.stringify(defaultState));
    newState.user.username = cleanUsername;
    newState.user.name = name.trim();
    newState.user.email = email.trim();
    newState.user.joinDate = new Date().toISOString();

    // Update users list
    users.push(cleanUsername);
    saveUsersList(users);

    // Save state
    saveUserState(cleanUsername, newState);

    // Login as this new user
    currentUsername = cleanUsername;
    setCurrentUsername(cleanUsername);
    state = newState;
    this.save();
    return true;
  },

  logout() {
    currentUsername = null;
    setCurrentUsername(null);
    state = null;
  },

  getCurrentUser() {
    return currentUsername;
  },

  getUsers() {
    return getUsersList();
  },

  hasUser(username) {
    return getUsersList().includes(username.trim().toLowerCase());
  },

  // User details modifiers
  setUser(name, email) {
    if (!state) return;
    state.user.name = name;
    state.user.email = email;
    this.save();
  },

  setDailyGoal(minutes) {
    if (!state) return;
    state.user.dailyGoal = minutes;
    this.save();
  },

  setOnboarded() {
    if (!state) return;
    state.onboarded = true;
    this.save();
  },

  // Progress helpers
  markTopicDone(dayNum, topicIndex) {
    if (!state) return;
    const key = `day${dayNum}-topic${topicIndex}`;
    if (!state.progress.completedTopics.includes(key)) {
      state.progress.completedTopics.push(key);
    }
    this.save();
  },

  isTopicDone(dayNum, topicIndex) {
    if (!state) return false;
    return state.progress.completedTopics.includes(`day${dayNum}-topic${topicIndex}`);
  },

  markDayDone(dayNum) {
    if (!state) return;
    if (!state.progress.completedDays.includes(dayNum)) {
      state.progress.completedDays.push(dayNum);
    }
    state.progress.currentDay = dayNum + 1;
    this.save();
  },

  isDayDone(dayNum) {
    if (!state) return false;
    return state.progress.completedDays.includes(dayNum);
  },

  saveQuizScore(dayNum, score) {
    if (!state) return;
    state.progress.quizScores[`day${dayNum}`] = score;
    this.save();
  },

  getDayProgress(dayNum, totalTopics) {
    let done = 0;
    for (let i = 0; i < totalTopics; i++) {
      if (this.isTopicDone(dayNum, i)) done++;
    }
    return totalTopics > 0 ? Math.round((done / totalTopics) * 100) : 0;
  },

  // Gamification helpers
  addXP(amount) {
    if (!state) return 0;
    state.gamification.xp += amount;
    this.save();
    return state.gamification.xp;
  },

  recordAnswer(correct) {
    if (!state) return;
    state.gamification.totalAnswered++;
    if (correct) state.gamification.totalCorrect++;
    this.save();
  },

  updateStreak() {
    if (!state) return 0;
    const today = new Date().toDateString();
    const last = state.gamification.lastStudyDate;
    if (last === today) return state.gamification.streak; // already counted
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (last === yesterday) {
      state.gamification.streak++;
    } else if (!last) {
      state.gamification.streak = 1;
    } else {
      // Streak broken
      state.gamification.streak = 1;
    }
    state.gamification.lastStudyDate = today;
    this.save();
    return state.gamification.streak;
  },

  unlockBadge(badgeId) {
    if (!state) return false;
    if (!state.gamification.badges.includes(badgeId)) {
      state.gamification.badges.push(badgeId);
      this.save();
      return true; // newly unlocked
    }
    return false;
  },

  hasBadge(badgeId) {
    if (!state) return false;
    return state.gamification.badges.includes(badgeId);
  },

  // Chat history
  addChatMessage(role, content) {
    if (!state) return;
    state.chatHistory.push({ role, content, time: Date.now() });
    // Keep last 50 messages
    if (state.chatHistory.length > 50) state.chatHistory = state.chatHistory.slice(-50);
    this.save();
  },

  reset() {
    if (currentUsername) {
      state = JSON.parse(JSON.stringify(defaultState));
      state.user.username = currentUsername;
      this.save();
    }
  },
};
