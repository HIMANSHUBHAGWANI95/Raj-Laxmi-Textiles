// ============================================================
// aiChat.js — Gemini AI chat integration
// ============================================================
import { store } from './store.js';

// ⬇ Replace this with your actual Gemini API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const CAT_SYSTEM_PROMPT = `You are CAT, an adorable and knowledgeable kitten grammar coach helping students prepare for the CAT (Common Admission Test) English section. 

Your personality:
- Friendly, warm, and encouraging — never judgmental
- Use cat puns occasionally (purr-fect, paw-some, meow, fur real, etc.)
- Explain grammar concepts with simple, memorable examples
- Keep responses concise (2-5 sentences max unless a detailed explanation is needed)
- Use emojis sparingly but effectively
- Always end with an encouraging note when explaining errors

Your expertise:
- CAT exam English: sentence correction, para jumbles, reading comprehension
- Grammar: subject-verb agreement, tenses, parallelism, modifiers, articles
- Vocabulary: commonly confused words, idioms, phrasal verbs
- Exam strategy: time management, elimination techniques

Current context: The student is studying for the CAT exam using a 7-day grammar bootcamp.

Always respond AS CAT the kitten. Start responses with "🐱" or a cat-related opener.`;

// Pre-written fallback responses when no API key is configured
const FALLBACK_RESPONSES = {
  default: [
    "🐱 Great question! Make sure to check subject-verb agreement first — the verb must match the TRUE subject, not the nearest noun. 'One of the boys WAS late.' ✓",
    "🐱 Paw-some question! For tenses, remember: when two past events occur, the EARLIER one uses Past Perfect (had + V3). Like: 'She had left before I arrived.' 💪",
    "🐱 Meow! Let me help. For modifiers, always ask: who is doing the action? The subject of the main clause must be the logical doer. 'Walking in the rain, SHE got wet.' ✓",
    "🐱 Fur real though — parallelism is about matching forms. Lists should all be nouns, all verbs, or all -ing words. 'Reading, writing, and arithmetic' ✓",
    "🐱 Great thinking! Remember FEWER for countable things, LESS for uncountable. Fewer mistakes, less time. You're doing paw-sitively great! ⭐",
  ],
  gerund: "🐱 Gerunds are -ing words that act as NOUNS! Think of it like me chasing a butterfly — 'Chasing butterflies is my hobby.' 'Chasing' is the gerund — it looks like an action but works as the subject! 😸",
  conditional: "🐱 Conditionals have 3 types! Type 1 (real): If it rains, I WILL stay home. Type 2 (hypothetical): If I WERE rich, I WOULD travel. Type 3 (impossible past): If she HAD studied, she WOULD HAVE passed. 🎯",
  articles: "🐱 Articles are all about sound, not letters! 'An hour' ✓ (silent H, vowel sound). 'A university' ✓ (sounds like 'yoo' — consonant sound). Say it aloud! Purr-fect trick! 🐾",
  svA: "🐱 Subject-verb agreement tip: find the REAL subject (ignore 'of + noun' phrases). 'One of the boys WAS late.' Subject = 'one' (singular) → 'was'. You've got this! 💪",
};

function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('gerund') || lower.includes('ing')) return FALLBACK_RESPONSES.gerund;
  if (lower.includes('conditional') || lower.includes('if')) return FALLBACK_RESPONSES.conditional;
  if (lower.includes('article') || lower.includes(' a ') || lower.includes(' an ')) return FALLBACK_RESPONSES.articles;
  if (lower.includes('subject') || lower.includes('verb') || lower.includes('agreement')) return FALLBACK_RESPONSES.svA;
  const arr = FALLBACK_RESPONSES.default;
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function sendMessage(userMessage) {
  // Save user message
  store.addChatMessage('user', userMessage);

  if (!GEMINI_API_KEY) {
    // Use intelligent fallbacks
    const response = getFallbackResponse(userMessage);
    store.addChatMessage('cat', response);
    return response;
  }

  try {
    const history = store.get().chatHistory.slice(-10); // last 10 messages for context
    const contents = [
      {
        role: 'user',
        parts: [{ text: CAT_SYSTEM_PROMPT + '\n\nNow respond to the student:' }],
      },
      ...history.map(msg => ({
        role: msg.role === 'cat' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackResponse(userMessage);
    store.addChatMessage('cat', text);
    return text;
  } catch (err) {
    console.error('Gemini API error:', err);
    const fallback = getFallbackResponse(userMessage);
    store.addChatMessage('cat', fallback);
    return fallback;
  }
}

export function getChatHistory() {
  return store.get().chatHistory;
}
