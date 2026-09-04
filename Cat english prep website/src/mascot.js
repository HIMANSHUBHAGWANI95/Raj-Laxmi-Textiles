// ============================================================
// mascot.js — Mascot state machine & widget rendering
// ============================================================

const MASCOT_IMAGES = {
  idle:       '/mascot/encourage.png',
  wave:       '/mascot/wave.png',
  teach:      '/mascot/teach.png',
  think:      '/mascot/think.png',
  celebrate:  '/mascot/celebrate.png',
  encourage:  '/mascot/encourage.png',
  sleep:      '/mascot/sleep.png',
  fire:       '/mascot/fire.png',
  concerned:  '/mascot/concerned.png',
};

const MASCOT_MESSAGES = {
  idle:      ["Let's learn grammar! 🐱", "I'm here if you need help!", "Ready when you are! 🐾"],
  wave:      ["Meow! Ready to master CAT English? 🐱", "Hi! I'll be your grammar buddy!", "Let's do this! 7 days to CAT success!"],
  teach:     ["Pay attention! This is important 📌", "Let me show you something cool!", "Here's a trick I use! 🎯"],
  think:     ["Hmm, think carefully... 🤔", "What do you think the answer is?", "Take your time! I believe in you 🐾"],
  celebrate: ["Purr-fect! You nailed it! ⭐", "You're a grammar star! 🌟", "YES! That's exactly right! 🎉"],
  encourage: ["Almost there! You've got this! 💪", "No worries — even I get confused sometimes!", "Try again! Every mistake is a lesson 🐱"],
  sleep:     ["See you tomorrow! Don't break that streak! 😴", "Rest well — come back tomorrow!", "Sweet dreams! Grammar awaits! 💤"],
  fire:      ["You're ON FIRE! 🔥", "Streak is alive! Keep going!", "Unstoppable! 🔥🔥"],
  concerned: ["Hmm, let me help you with that... 🐱", "Don't worry, I'll explain it better!", "That was a tricky one! Here's why..."],
};

export class Mascot {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.state = 'idle';
    this.messageIndex = 0;
    this.messageTimer = null;
    this.clickCount = 0;
  }

  setState(newState) {
    this.state = MASCOT_IMAGES[newState] ? newState : 'idle';
    this.render();
  }

  getMessage() {
    const msgs = MASCOT_MESSAGES[this.state] || MASCOT_MESSAGES.idle;
    return msgs[this.messageIndex % msgs.length];
  }

  nextMessage() {
    this.messageIndex++;
    this.render();
  }

  render() {
    if (!this.container) return;
    const img = this.container.querySelector('.sidebar-mascot-img');
    if (img) {
      img.src = MASCOT_IMAGES[this.state];
      img.alt = `CAT is ${this.state}`;
    }
    const bubble = this.container.querySelector('.speech-bubble');
    if (bubble) {
      bubble.textContent = this.getMessage();
      bubble.style.animation = 'none';
      requestAnimationFrame(() => { bubble.style.animation = ''; });
    }
  }

  // Create a full sidebar widget HTML
  static createSidebarHTML(state = 'idle', extra = '') {
    const imgSrc = MASCOT_IMAGES[state] || MASCOT_IMAGES.idle;
    const msgs = MASCOT_MESSAGES[state] || MASCOT_MESSAGES.idle;
    const msg = msgs[0];
    return `
      <div class="sidebar-mascot-wrap" id="mascot-widget" role="button" aria-label="CAT mascot — click to get a tip" tabindex="0">
        <img src="${imgSrc}" alt="CAT the grammar kitten" class="sidebar-mascot-img" id="mascot-img" />
        <div class="sidebar-mascot-name">CAT 🐱</div>
        <div class="speech-bubble" id="mascot-bubble">${msg}</div>
      </div>
      ${extra}
    `;
  }

  static getMascotImg(state, size = 'medium') {
    const sizes = { small: 60, medium: 90, large: 140, hero: 180 };
    const px = sizes[size] || 90;
    const src = MASCOT_IMAGES[state] || MASCOT_IMAGES.idle;
    return `<img src="${src}" alt="CAT mascot" style="width:${px}px;height:${px}px;object-fit:contain;" class="mascot-img-${size}" />`;
  }
}

// Global mascot message cycling
export function attachMascotClick(elementId, state = 'idle') {
  const el = document.getElementById(elementId);
  if (!el) return;
  let idx = 0;
  const msgs = MASCOT_MESSAGES[state] || MASCOT_MESSAGES.idle;
  el.addEventListener('click', () => {
    idx = (idx + 1) % msgs.length;
    const bubble = document.getElementById('mascot-bubble');
    if (bubble) {
      bubble.textContent = msgs[idx];
      bubble.style.animation = 'none';
      void bubble.offsetWidth;
      bubble.style.animation = 'bubbleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
    // Bounce the mascot image
    const img = document.getElementById('mascot-img');
    if (img) {
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = 'mascotBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { img.style.animation = 'mascotFloat 3s ease-in-out infinite'; }, 700);
    }
  });
}

export function setMascotState(state) {
  const img = document.getElementById('mascot-img');
  const bubble = document.getElementById('mascot-bubble');
  if (img) img.src = MASCOT_IMAGES[state] || MASCOT_IMAGES.idle;
  if (bubble) {
    const msgs = MASCOT_MESSAGES[state] || MASCOT_MESSAGES.idle;
    bubble.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    bubble.style.animation = 'none';
    void bubble.offsetWidth;
    bubble.style.animation = 'bubbleIn 0.3s ease';
  }
}
