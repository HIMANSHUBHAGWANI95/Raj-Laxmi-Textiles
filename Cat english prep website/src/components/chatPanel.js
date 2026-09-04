// ============================================================
// components/chatPanel.js — AI Chat slide-in panel
// ============================================================
import { sendMessage, getChatHistory } from '../aiChat.js';
import { store } from '../store.js';
import { awardXP } from '../gamification.js';

let isOpen = false;

export function openChatPanel() {
  if (isOpen) return;
  isOpen = true;
  awardXP('openChat');

  const overlay = document.createElement('div');
  overlay.className = 'chat-panel-overlay';
  overlay.id = 'chat-overlay';
  overlay.addEventListener('click', closeChatPanel);

  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.id = 'chat-panel';
  panel.innerHTML = `
    <div class="chat-panel-header">
      <img src="/mascot/teach.png" alt="CAT" class="chat-panel-mascot" />
      <div>
        <div class="chat-panel-title">Ask CAT Anything 🐱</div>
        <div class="chat-panel-subtitle">Your personal grammar buddy</div>
      </div>
      <button class="chat-panel-close" id="chat-close-btn" aria-label="Close chat">✕</button>
    </div>
    <div class="chat-messages" id="chat-messages">
      ${renderHistory()}
    </div>
    <div class="chat-quick-actions">
      <button class="quick-action" data-q="Explain subject-verb agreement">SVA rules</button>
      <button class="quick-action" data-q="When do I use Past Perfect?">Past Perfect</button>
      <button class="quick-action" data-q="What is a dangling modifier?">Dangling modifier</button>
      <button class="quick-action" data-q="Give me a CAT exam tip">CAT tip 🎯</button>
    </div>
    <div class="chat-input-area">
      <textarea class="chat-input" id="chat-input" placeholder="Ask CAT about any grammar rule..." rows="1" aria-label="Chat message"></textarea>
      <button class="chat-send-btn" id="chat-send-btn" aria-label="Send message">➤</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  // If first time, add a welcome message
  const history = getChatHistory();
  if (history.length === 0) {
    const name = store.get().user.name || 'there';
    appendMessage('cat', `🐱 Meow, ${name}! I'm CAT, your grammar coach. What grammar concept would you like me to explain? Ask me anything about the CAT exam! 😸`);
  }

  // Scroll to bottom
  scrollToBottom();

  // Event listeners
  document.getElementById('chat-close-btn').addEventListener('click', closeChatPanel);

  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  const handleSend = async () => {
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    input.style.height = 'auto';
    appendMessage('user', msg);
    showTyping();
    const reply = await sendMessage(msg);
    hideTyping();
    appendMessage('cat', reply);
  };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // Quick actions
  panel.querySelectorAll('.quick-action').forEach(btn => {
    btn.addEventListener('click', async () => {
      const q = btn.dataset.q;
      input.value = '';
      appendMessage('user', q);
      showTyping();
      const reply = await sendMessage(q);
      hideTyping();
      appendMessage('cat', reply);
    });
  });
}

function closeChatPanel() {
  isOpen = false;
  document.getElementById('chat-overlay')?.remove();
  document.getElementById('chat-panel')?.remove();
}

function renderHistory() {
  const history = getChatHistory().slice(-20);
  if (history.length === 0) return '';
  return history.map(msg => `
    <div class="chat-msg ${msg.role === 'cat' ? 'cat' : 'user'}">
      ${msg.role === 'cat' ? '<img src="/mascot/teach.png" class="chat-msg-avatar" alt="CAT" />' : ''}
      <div class="chat-msg-bubble">${escapeHtml(msg.content)}</div>
    </div>
  `).join('');
}

function appendMessage(role, content) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = `chat-msg ${role === 'cat' ? 'cat' : 'user'}`;
  div.innerHTML = `
    ${role === 'cat' ? '<img src="/mascot/teach.png" class="chat-msg-avatar" alt="CAT" />' : ''}
    <div class="chat-msg-bubble">${escapeHtml(content)}</div>
  `;
  msgs.appendChild(div);
  scrollToBottom();
}

function showTyping() {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-msg cat';
  div.id = 'typing-indicator';
  div.innerHTML = `
    <img src="/mascot/think.png" class="chat-msg-avatar" alt="CAT thinking" />
    <div class="chat-msg-bubble">
      <div class="chat-msg-typing">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  msgs.appendChild(div);
  scrollToBottom();
}

function hideTyping() {
  document.getElementById('typing-indicator')?.remove();
}

function scrollToBottom() {
  const msgs = document.getElementById('chat-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}
