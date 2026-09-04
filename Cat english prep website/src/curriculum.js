// ============================================================
// curriculum.js — 7-Day CAT English Grammar Bootcamp (Complete)
// Professor-level content: every topic has lesson + mini-quiz
// ============================================================

export const curriculum = [

  // ═══════════════════════════════════════════════════════════
  //  DAY 1 — GRAMMAR FOUNDATIONS, SENTENCE STRUCTURE & PARTS OF SPEECH
  // ═══════════════════════════════════════════════════════════
  {
    day: 1,
    title: 'Grammar Foundations & Parts of Speech',
    emoji: '📖',
    tagline: 'The Architecture of English — Understanding What Every Word Does',
    xpReward: 200,
    topics: [
      {
        name: 'What is Grammar & Sentence Structure',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'Grammar is the system of structural rules that governs how words combine into phrases, clauses, and sentences. Sentence structure is the logical arrangement of these elements to communicate a complete, unambiguous thought.' },
          { type: 'text', heading: 'Why It Exists', body: 'Without grammar, language collapses into noise. Consider: "Man bites dog" vs "Dog bites man." The words are identical — grammar alone determines meaning. Grammar is the operating system of communication.' },
          { type: 'text', heading: 'How to Identify It', body: 'A grammatically complete sentence must have at least one independent clause — a subject and a predicate. Ask: "Who or what is this sentence about?" (Subject) and "What does it do or what is its state?" (Predicate).' },
          { type: 'rule', icon: '⚡', body: '<strong>S-V-O Recognition Shortcut:</strong> Find the main conjugated verb first → the noun PERFORMING it is the subject → the noun RECEIVING it is the direct object. This S-V-O spine is the skeleton of every English sentence.' },
          { type: 'visual', label: '🏗️ Sentence Anatomy', diagram: `Sentence: The exhausted hikers waded through the icy river carefully.

  ┌──────────────────────┐    ┌──────────────────────────────────┐
  │  SUBJECT (Topic)     │    │  PREDICATE (Comment/Action)      │
  │  The exhausted hikers│ ── │  waded through the icy river     │
  │  (who?)              │    │  carefully (verb + modifiers)    │
  └──────────────────────┘    └──────────────────────────────────┘

  VERB:    waded  (past tense, intransitive)
  MOD:     through the icy river (location modifier)
  MOD:     carefully (manner modifier)` },
          { type: 'levels', label: 'Examples by Difficulty', beginner: '"Birds fly." — Minimal complete sentence. Subject: Birds | Verb: fly.', intermediate: '"The eager student completed her assignment before the deadline." — Subject: The eager student | Verb: completed | Object: her assignment | Time modifier: before the deadline.', advanced: '"Despite severe budget constraints, the municipal administration managed to complete the infrastructure project on schedule." — Concessive phrase + Subject + Verb + Object + Modifier.', cat: '"That the board failed to anticipate currency fluctuations, which later rendered the entire acquisition strategy obsolete, shocked analysts." — Noun clause as subject + Parenthetical relative clause.', editorial: '"The government\'s reluctance to implement structural reforms, despite repeated warnings from international agencies, has significantly constrained economic recovery." (ToI Editorial)' },
          { type: 'error_correct', wrong: 'Although the findings were significant. The researchers published them immediately.', right: 'Although the findings were significant, the researchers published them immediately.', note: '"Although" creates a dependent clause — it cannot stand alone as a sentence. This error is called a sentence fragment.' },
          { type: 'memory', title: 'The Stage Play Rule', body: 'Every sentence is a mini-play. The Subject is the ACTOR. The Verb is the ACTION. The Object is the PROP. A play needs at least an actor + an action to make sense.' }
        ],
        miniQuiz: [
          { q: 'Which sentence contains a dangling modifier?', options: ['After finishing the report, Priya submitted it.', 'Having studied all night, the exam seemed easy.', 'The manager reviewed the proposal carefully.', 'Despite delays, the project was completed on time.'], answer: 1, explanation: '"Having studied all night" must logically modify the person who studied — but the main clause says "the exam seemed easy." The exam did not study. Correct: "Having studied all night, she found the exam easy."' },
          { q: 'What is the complete subject of: "Behind the old bookshelf lay a dusty manuscript."', options: ['Behind the old bookshelf', 'bookshelf', 'a dusty manuscript', 'lay'], answer: 2, explanation: 'This is an inverted sentence. "Behind the old bookshelf" is an adverbial prepositional phrase. The verb is "lay." Ask: what lay? → "a dusty manuscript" — this is the true subject.' }
        ]
      },
      {
        name: 'Subject & Predicate in Depth',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'The Subject is what the sentence is about (the topic). The Predicate tells us everything about the subject — what it does, what it is, or what state it is in. Together, they form the two mandatory halves of every sentence.' },
          { type: 'text', heading: 'Why This Distinction Matters for CAT', body: 'CAT error-spotting questions frequently exploit confusion between subject and predicate. A modifier-heavy subject can fool you into choosing the wrong verb form, leading to agreement errors.' },
          { type: 'table', label: 'Subject Types', headers: ['Type', 'Example', 'Note'], rows: [['Simple Subject', '"The diligent professor [teaches]."', 'The head noun of the subject phrase'], ['Compound Subject', '"Ravi and Priya [are] partners."', 'Two or more subjects joined by and'], ['Noun Clause as Subject', '"That he lied [is] obvious."', 'Entire clause acts as subject — singular'], ['Infinitive Phrase as Subject', '"To err [is] human."', 'Infinitive phrase — singular verb'], ['Inverted Subject', '"Rare [are] such opportunities."', 'Subject follows verb — check carefully']] },
          { type: 'visual', label: '🌳 Predicate Tree', diagram: `SIMPLE PREDICATE: just the verb
  She [smiled].

COMPLETE PREDICATE: verb + objects + complements + modifiers
  She [smiled warmly at the nervous students sitting in the front row].

COMPOUND PREDICATE: two or more verbs sharing one subject
  The CEO [resigned] and [issued] a public statement.` },
          { type: 'levels', label: 'Tiered Examples', beginner: '"Dogs bark." — Subject: Dogs | Predicate: bark.', intermediate: '"The report, along with its appendices, was submitted yesterday." — True subject: "The report" (singular) → "was" (not "were").', advanced: '"The committee\'s decision to reject the proposal has angered shareholders." — Subject: "The committee\'s decision" | Head noun: decision (singular) → "has angered."', cat: '"Neither the directors nor the chairman was present." — With "neither...nor," verb agrees with the noun CLOSEST to the verb: chairman (singular) → was.', editorial: '"A series of policy missteps has eroded public confidence in the administration." — "series" is singular → "has eroded."' },
          { type: 'error_correct', wrong: 'The group of students were all awarded scholarships.', right: 'The group of students was awarded scholarships.', note: '"Group" is the head noun (singular collective), not "students." The prepositional phrase "of students" is a modifier. Use: "The group was..."' }
        ],
        miniQuiz: [
          { q: 'Choose the correct verb: "Each of the contestants _____ required to submit a portfolio."', options: ['are', 'were', 'is', 'have been'], answer: 2, explanation: '"Each" is always singular, regardless of the prepositional phrase that follows it ("of the contestants"). Correct: "Each... is required."' },
          { q: 'In "What the government lacks is political will," the subject is:', options: ['government', 'What the government lacks', 'political will', 'is'], answer: 1, explanation: '"What the government lacks" is a noun clause functioning as the subject of the verb "is." This is a classic inverted cleft sentence. The singular noun clause takes a singular verb.' }
        ]
      },
      {
        name: 'Objects, Complements & Modifiers',
        content: [
          { type: 'text', heading: 'Simple Definition', body: '<strong>Objects</strong> receive the action of the verb. <strong>Complements</strong> complete the meaning by renaming or describing the subject or object. <strong>Modifiers</strong> add descriptive detail — they answer when, where, how, why, which, and to what extent.' },
          { type: 'table', label: '📊 The Full Picture', headers: ['Element', 'Type', 'Function', 'Quick Example'], rows: [['Object', 'Direct Object', 'Receives action directly', 'She read [the novel].'], ['Object', 'Indirect Object', 'Receives the direct object', 'She gave [me] the novel.'], ['Complement', 'Subject Complement', 'Renames/describes subject after linking verb', 'He is [a professor]. She looks [tired].'], ['Complement', 'Object Complement', 'Renames/describes direct object', 'They elected him [president].'], ['Modifier', 'Adjective / Adverb', 'Describes or qualifies another element', 'The [exhausted] professor spoke [slowly].'], ['Modifier', 'Prepositional Phrase', 'Acts as adjective or adverb', 'The chair [near the window] is taken.']] },
          { type: 'visual', label: '🎯 Linking vs. Action Verbs', diagram: `ACTION VERB → takes an OBJECT:
  "She painted the wall." (wall = DO; she ≠ wall)

LINKING VERB → takes a COMPLEMENT:
  "The wall looks beautiful." (beautiful = SC; describes wall)
  "She painted it red." (red = OC; describes "it" = wall)

COMMON LINKING VERBS:
  be, seem, appear, become, feel, look, smell, sound, taste, remain, grow, turn, prove, stay` },
          { type: 'error_correct', wrong: 'The cake smells deliciously. / She felt badly about it.', right: 'The cake smells delicious. / She felt bad about it.', note: '"Smells" and "felt" are linking verbs here. They require adjectives (subject complements), not adverbs. "Delicious" modifies the noun "cake"; "bad" modifies "she."' },
          { type: 'levels', label: 'Tiered Examples', beginner: '"He painted the house." — house: Direct Object.', intermediate: '"She offered him a chance." — him: Indirect Object | chance: Direct Object.', advanced: '"The committee declared the project a success." — project: DO | success: Object Complement.', cat: '"The CEO found the quarterly results deeply troubling." — results: DO | deeply troubling: Object Complement (adverb + adjective).', editorial: '"Analysts consider the policy a landmark shift in regulatory thinking." — policy: DO | landmark shift: OC.' }
        ],
        miniQuiz: [
          { q: 'Identify the object complement: "The board appointed Dr. Mehta interim director."', options: ['Dr. Mehta', 'interim director', 'board', 'appointed'], answer: 1, explanation: '"Interim director" renames or identifies the direct object "Dr. Mehta" after the verb "appointed." This is a classic Object Complement.' },
          { q: 'Which sentence uses a linking verb correctly?', options: ['The situation grew worrisomely.', 'She remained calmly despite the chaos.', 'The music sounded beautifully.', 'The proposal appeared sound to the committee.'], answer: 3, explanation: '"Appeared" is a linking verb; it takes an adjective complement, not an adverb. "Sound" (adjective) correctly describes the subject "The proposal."' }
        ]
      },
      {
        name: 'The 8 Parts of Speech & Editorial Analysis',
        content: [
          { type: 'text', heading: 'Why This Matters', body: 'Every word in English belongs to one of 8 parts of speech. The FUNCTION a word performs in a sentence determines its part of speech — not just the word itself. "Fast" can be an adjective ("a fast car") or an adverb ("she drives fast").' },
          { type: 'table', label: '📊 The 8 Parts of Speech', headers: ['Part of Speech', 'Core Function', 'CAT Example'], rows: [['Noun', 'Names person, place, thing, idea', '[Integrity] defines leadership.'], ['Pronoun', 'Replaces noun to avoid repetition', '[She] completed [it] on time.'], ['Verb', 'Action, state, or auxiliary', 'They [have been working] all night.'], ['Adjective', 'Modifies noun/pronoun', 'The [unprecedented] decision shocked [all].'], ['Adverb', 'Modifies verb/adj/adverb', 'The data is [remarkably] [consistent].'], ['Preposition', 'Shows relationship', 'The blame lies [with] the administration.'], ['Conjunction', 'Connects elements', 'The plan failed, [yet] the team persevered.'], ['Interjection', 'Expresses emotion (rare in formal writing)', '[Alas,] the opportunity was lost.']] },
          { type: 'visual', label: '📰 Full Word-by-Word Editorial Analysis', diagram: `Sentence (The Hindu Editorial):
"The government's belated acknowledgment of systemic failures has done little to restore investor confidence."

Word-by-Word:
• The              → Definite Article (Determiner)
• government's     → Possessive Noun (modifies "acknowledgment")
• belated          → Adjective (modifies "acknowledgment")
• acknowledgment   → Noun (HEAD of Subject noun phrase)
• of               → Preposition
• systemic         → Adjective (modifies "failures")
• failures         → Noun (object of preposition "of")
• has              → Auxiliary Verb (forms Present Perfect)
• done             → Main Verb, Past Participle
• little           → Pronoun / Noun (Direct Object)
• to               → Infinitive marker (part of infinitive phrase)
• restore          → Verb (base form, infinitive)
• investor         → Noun acting as Adjective (modifies "confidence")
• confidence       → Noun (Object of infinitive "restore")` },
          { type: 'cat_tip', body: 'CAT frequently tests "but" used as an adverb meaning "only" — e.g., "She could but hope." Here "but" ≠ conjunction; it means "only." Similarly, "well" can be adjective ("I am well") or adverb ("She writes well").' }
        ],
        miniQuiz: [
          { q: 'What part of speech is the word "fast" in: "She runs fast but maintains a fast pace"?', options: ['Adverb, then Adjective', 'Adjective, then Adverb', 'Noun, then Verb', 'Adverb, then Adverb'], answer: 0, explanation: 'In "She runs fast," fast modifies the verb "runs" → Adverb. In "a fast pace," fast modifies the noun "pace" → Adjective. Same word, different functions.' },
          { q: 'Identify the part of speech of "but" in: "She could but wonder at his audacity."', options: ['Conjunction', 'Preposition', 'Adverb', 'Noun'], answer: 2, explanation: 'Here "but" means "only" — it modifies the verb "wonder" → Adverb. This is a classic CAT trap. If "but" connects clauses, it is a conjunction; if it means "only," it is an adverb.' }
        ]
      }
    ],
    quiz: [
      { q: 'Which of the following is grammatically correct?', options: ['Walking to school, the rain started pouring.', 'The team of researchers have published their findings.', 'Between you and me, this plan seems unsound.', 'Neither the students nor the teacher were prepared.'], answer: 2, explanation: '"Between" takes the objective case → "me" (not "I"). A has a dangling modifier. B: "team" is singular → "has published." D: verb agrees with "teacher" (closest noun) → "was."' },
      { q: '"The news _____ disturbing." Choose the correct form.', options: ['are', 'were', 'is', 'have been'], answer: 2, explanation: '"News" is an uncountable noun that always takes a singular verb, even though it ends in -s. Correct: "The news is disturbing."' }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  //  DAY 2 — VERBS, TENSES, AND SUBJECT-VERB AGREEMENT
  // ═══════════════════════════════════════════════════════════
  {
    day: 2,
    title: 'Verbs, All 12 Tenses & Subject-Verb Agreement',
    emoji: '⏱️',
    tagline: 'Master Time in Language — The Engine of Every Sentence',
    xpReward: 220,
    topics: [
      {
        name: 'Verbs: Types, Forms & Functions',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'A verb is the engine of a sentence — it expresses an action, an occurrence, or a state of being. Without a verb, a string of words is not a sentence.' },
          { type: 'table', label: '📊 Verb Types', headers: ['Type', 'Function', 'Example'], rows: [['Transitive', 'Takes a direct object', 'She wrote [a letter].'], ['Intransitive', 'No direct object needed', 'He slept soundly.'], ['Linking', 'Connects subject to complement', 'The plan seems flawed.'], ['Auxiliary/Helping', 'Adds tense/mood/voice', 'She has been working hard.'], ['Modal', 'Expresses possibility, necessity etc.', 'You should submit it now.']] },
          { type: 'visual', label: '🔧 The Verb Phrase Anatomy', diagram: `FULL VERB PHRASE: "should have been submitted"

  should     → Modal Auxiliary (expresses obligation/advice)
  have       → Perfect Auxiliary (creates Perfect aspect)
  been       → Progressive/Passive Auxiliary
  submitted  → Main Verb (Past Participle)

  This is a Modal Perfect Passive construction.` },
          { type: 'rule', icon: '📌', body: '<strong>Finites vs Non-Finites:</strong> A finite verb changes with subject/tense ("he runs" / "they ran"). A non-finite verb (infinitive, gerund, participle) does NOT change — it cannot serve as the main verb alone.' },
          { type: 'levels', label: 'Examples', beginner: '"The dog barked." — barked: transitive? No, intransitive (no object).', intermediate: '"She has been teaching English for a decade." — "has been teaching" = Present Perfect Progressive.', advanced: '"The policy should have been implemented six months ago." — Modal Perfect Passive.', cat: '"The discovery, having revolutionised our understanding, deserves greater recognition." — "having revolutionised" = Perfect Participle (non-finite, modifies discovery).', editorial: '"The Reserve Bank has maintained its accommodative stance, citing subdued inflationary pressures." — Present Perfect Active + Present Participle modifier.' }
        ],
        miniQuiz: [
          { q: 'In "Swimming is great exercise," "swimming" is a:', options: ['Present Participle', 'Gerund (Verbal Noun)', 'Adjective', 'Finite Verb'], answer: 1, explanation: '"Swimming" is the subject of the verb "is." It functions as a noun → Gerund. A present participle modifies a noun: "the swimming athlete." A gerund IS the noun.' },
          { q: 'Which underlined word is a finite verb? "Running daily helps [maintain] fitness."', options: ['Running', 'helps', 'maintain', 'fitness'], answer: 1, explanation: '"Helps" is the finite verb — it is conjugated with the subject "Running daily" (singular gerund phrase) and changes with tense. "Running" and "maintain" are non-finite forms.' }
        ]
      },
      {
        name: 'All 12 Tenses — Structure & Use',
        content: [
          { type: 'text', heading: 'Why 12 Tenses?', body: 'English has 3 time frames (Past, Present, Future) × 4 aspects (Simple, Progressive, Perfect, Perfect Progressive) = 12 tenses. Mastering their structure is essential for correcting tense errors in CAT.' },
          { type: 'table', label: '📊 The 12 Tenses — Complete Reference', headers: ['Tense', 'Structure', 'Signal Words', 'Example'], rows: [['Simple Present', 'V / V+s', 'always, usually, every day', 'She writes reports daily.'], ['Present Continuous', 'is/am/are + V-ing', 'now, currently, at this moment', 'She is writing a report.'], ['Present Perfect', 'has/have + V3', 'just, already, yet, since, for, ever', 'She has written three reports.'], ['Present Perf. Prog.', 'has/have been + V-ing', 'for, since (emphasis on duration)', 'She has been writing since dawn.'], ['Simple Past', 'V2 (past form)', 'yesterday, in 2020, ago, then', 'She wrote the report yesterday.'], ['Past Continuous', 'was/were + V-ing', 'while, when (ongoing past action)', 'She was writing when he called.'], ['Past Perfect', 'had + V3', 'before, after, by the time (sequence)', 'She had written it before he arrived.'], ['Past Perf. Prog.', 'had been + V-ing', 'for, since (ongoing before a past point)', 'She had been writing for an hour when he arrived.'], ['Simple Future', 'will + V1', 'tomorrow, next week, soon', 'She will write the report tomorrow.'], ['Future Continuous', 'will be + V-ing', 'at this time tomorrow', 'She will be writing at noon.'], ['Future Perfect', 'will have + V3', 'by tomorrow, by the time', 'She will have written it by Friday.'], ['Future Perf. Prog.', 'will have been + V-ing', 'for + duration by a future point', 'She will have been writing for six hours by evening.']] },
          { type: 'visual', label: '⏱️ Tense Choice Logic', diagram: `WHICH TENSE DO I USE?

  Is the action COMPLETE or ONGOING?
  ├── Complete → Perfect or Simple
  └── Ongoing  → Progressive (Continuous)

  WHEN did/does/will it happen?
  ├── Present → Present tenses
  ├── Past    → Past tenses
  └── Future  → Future tenses

  SEQUENCE of two past events? → Past Perfect for the EARLIER one.
  "She had left by the time he arrived."
   (left = earlier) (arrived = later)` },
          { type: 'error_correct', wrong: 'By next month, I complete the course.', right: 'By next month, I will have completed the course.', note: '"By next month" signals a Future Perfect context — an action completed before a future reference point. "Will have completed" is the correct structure.' },
          { type: 'memory', title: 'The Traffic Light of Tense', body: 'Simple = the bare fact. Progressive = in motion right now. Perfect = already done. Perfect Progressive = ongoing, but counting the duration. Apply this to any time frame.' }
        ],
        miniQuiz: [
          { q: 'Choose the correct tense: "By the time the CEO arrived, the board _____ voting."', options: ['completed', 'has completed', 'had completed', 'was completing'], answer: 2, explanation: 'Two past events in sequence. "The CEO arrived" = later event. "Voting completed" = earlier event. Use Past Perfect for the earlier past action → "had completed."' },
          { q: 'Which sentence uses the Present Perfect correctly?', options: ['I have visited Paris last year.', 'She has been born in Mumbai.', 'The committee has not yet issued its report.', 'He has gone to the store an hour ago.'], answer: 2, explanation: 'Present Perfect cannot be used with specific past time markers like "last year," "an hour ago," or with passive "born." Option C is correct — "yet" is a Present Perfect signal word.' }
        ]
      },
      {
        name: 'Subject-Verb Agreement — All Rules',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'Subject-Verb Agreement is the grammatical rule requiring that a verb match its subject in number (singular/plural). This seems simple but becomes complex when subjects are long, inverted, or compound.' },
          { type: 'table', label: '📊 The 12 Critical SVA Rules', headers: ['Rule', 'Example', 'Verdict'], rows: [['Collective nouns (group, team, jury)', '"The committee has decided."', 'Singular in American English'], ['Subjects joined by AND', '"Ravi and Priya are ready."', 'Plural'], ['Subjects joined by OR / NOR', '"Either she or they are wrong."', 'Agree with nearest subject'], ['Subjects with ALONG WITH / AS WELL AS', '"The CEO, along with advisers, was present."', 'Ignore the phrase; use subject'], ['Indefinite pronouns (each, every, anyone)', '"Each student is responsible."', 'Always singular'], ['Plural-looking singulars', '"Mathematics is challenging."', 'Singular (same as: news, economics)'], ['Inverted sentences', '"There are several issues." "There is one issue."', 'Agree with post-verb noun'], ['Relative clause agreement', '"She is one of those leaders who inspire."', 'Inspire — agrees with "leaders"'], ['Fractions / percentages', '"Half of the report was revised."', 'Depends on what follows "of"'], ['Titles and proper nouns', '"The United Nations is meeting."', 'Singular (one entity)'], ['None / Neither', '"None of the options is correct." (formal)', 'Singular (formally)'], ['Who/Which/That as relative pronouns', '"The students who study hard succeed."', 'Agree with antecedent']] },
          { type: 'error_correct', wrong: 'She is one of the managers who has achieved the target.', right: 'She is one of the managers who have achieved the target.', note: 'The relative pronoun "who" refers to "managers" (plural), not "one" (singular). The verb must agree with the antecedent "managers" → "have."' }
        ],
        miniQuiz: [
          { q: '"The number of participants _____ increasing." Choose correctly.', options: ['are', 'were', 'is', 'have been'], answer: 2, explanation: '"The number of..." takes a singular verb (it refers to one number). "A number of..." takes a plural verb (it means "many"). "The number... is increasing."' },
          { q: 'Identify the SVA error: "The data gathered from multiple sources support the hypothesis."', options: ['No error — data is plural', 'Support → supports (data is singular)', 'Sources → source', 'No error — support is correct'], answer: 1, explanation: '"Data" in formal/academic English is increasingly treated as singular (datum = singular, data = plural, but modern usage: singular). In most CAT contexts, "data is" and "data supports" are accepted as correct.' }
        ]
      }
    ],
    quiz: [
      { q: 'Choose the correct option: "A team of experts _____ been assigned to investigate the matter."', options: ['have', 'has', 'are', 'were'], answer: 1, explanation: '"A team" is singular → "has been assigned." The plural "of experts" is a modifier and does not affect the verb.' },
      { q: 'Which tense error appears here: "I am knowing the answer since childhood."', options: ['Should be past perfect', 'Know is a stative verb — cannot be progressive', 'Since requires future perfect', 'No error'], answer: 1, explanation: '"Know" is a stative verb (expressing a mental state, not an action). Stative verbs (know, believe, love, want, own) cannot be used in progressive tenses. Correct: "I have known the answer since childhood."' }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  //  DAY 3 — NOUNS, PRONOUNS & DETERMINERS
  // ═══════════════════════════════════════════════════════════
  {
    day: 3,
    title: 'Nouns, Pronouns & Determiners',
    emoji: '🏷️',
    tagline: 'Naming the World — Precision with People, Things & Ideas',
    xpReward: 210,
    topics: [
      {
        name: 'Nouns — Every Type & Their Rules',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'A noun names a person, place, thing, idea, quality, or action. Nouns serve as subjects, objects, complements, and object of prepositions. Understanding noun types is key to avoiding count/uncount errors.' },
          { type: 'table', label: 'Noun Types', headers: ['Type', 'Definition', 'Correct Use'], rows: [['Countable', 'Can be counted; has plural', '"Give me two suggestions."'], ['Uncountable', 'Cannot be counted; no plural', '"I need advice." (NOT advices)'], ['Collective', 'Group as one unit', '"The jury has reached a verdict."'], ['Abstract', 'Idea, quality, feeling', '"Justice demands impartiality."'], ['Compound', 'Two or more words as one noun', '"The decision-making process was flawed."']] },
          { type: 'rule', icon: '⚠️', body: '<strong>Uncountable Nouns CAT List:</strong> advice, information, feedback, furniture, equipment, luggage, machinery, news, research, evidence, knowledge, progress, traffic, weather, work, homework, scenery, staff, staff, money, data (formal singular).' },
          { type: 'error_correct', wrong: 'She gave me many informations about the project. Can you give me some advices?', right: 'She gave me a lot of information about the project. Can you give me some advice?', note: '"Information" and "advice" are uncountable — they have no plural form. Use "a lot of / some / much" with uncountable nouns, not "many."' }
        ],
        miniQuiz: [
          { q: '"The government has made little _____ on the reform agenda." Which word fits?', options: ['progresses', 'progressions', 'progress', 'progressive'], answer: 2, explanation: '"Progress" is uncountable — it has no plural and takes "little/much" (not "many/few"). "The government has made little progress."' },
          { q: 'Which is correct?', options: ['The furnitures were damaged in the fire.', 'The furniture was damaged in the fire.', 'The furniture were damaged in the fire.', 'Much furnitures were damaged.'], answer: 1, explanation: '"Furniture" is uncountable — no plural form, singular verb. "The furniture was damaged" is correct.' }
        ]
      },
      {
        name: 'Pronouns — Case, Reference & Agreement',
        content: [
          { type: 'text', heading: 'Why Pronoun Case Is Critical for CAT', body: 'English pronouns change form depending on their grammatical role (case). Using the wrong case (e.g., "I" instead of "me" in an object position) is one of the most tested errors in CAT verbal ability.' },
          { type: 'table', label: '📊 Pronoun Case Table', headers: ['Person', 'Subjective (Subject)', 'Objective (Object)', 'Possessive Adj.', 'Possessive Pronoun', 'Reflexive'], rows: [['1st Sing.', 'I', 'me', 'my', 'mine', 'myself'], ['2nd', 'you', 'you', 'your', 'yours', 'yourself'], ['3rd Sing M', 'he', 'him', 'his', 'his', 'himself'], ['3rd Sing F', 'she', 'her', 'her', 'hers', 'herself'], ['3rd Neut', 'it', 'it', 'its', 'its', 'itself'], ['1st Pl.', 'we', 'us', 'our', 'ours', 'ourselves'], ['3rd Pl.', 'they', 'them', 'their', 'theirs', 'themselves']] },
          { type: 'rule', icon: '⚡', body: '<strong>The "Between" Trap:</strong> "Between" is a preposition, so its object must be in the objective case. Always: "between you and me" (NEVER "between you and I"). Test: remove the other person → "between... I" sounds wrong → use "me."' },
          { type: 'levels', label: 'Pronoun Reference Examples', beginner: '"The manager praised him." — him: objective case (object of praised).', intermediate: '"Neither Ravi nor his colleagues could protect themselves." — themselves: plural reflexive (agrees with plural "colleagues").', advanced: 'Ambiguous: "When the CEO met the chairman, he seemed nervous." — Who is nervous? This is a pronoun reference error — rewrite to clarify.', cat: '"It is I who am responsible." (Formal) vs "It\'s me who is responsible." (Informal) — CAT prefers formal; after "to be," subject pronoun "I" is technically correct.', editorial: '"The board, in its quarterly statement, acknowledged the shortfall." — "its" (singular): board is one collective entity.' },
          { type: 'error_correct', wrong: 'The success of the project was due to Priya and I\'s hard work. / Between you and I, the plan has flaws.', right: 'The success was due to Priya and my hard work. / Between you and me, the plan has flaws.', note: 'After prepositions (due to, between), use objective case. "I\'s" is never a valid form — use "my." ' }
        ],
        miniQuiz: [
          { q: 'Choose the correct pronoun: "The committee presented _____ findings to the board."', options: ['their', 'its', 'it\'s', 'there'], answer: 1, explanation: '"Committee" is a singular collective noun in formal writing → "its" (singular possessive). "Their" would be used in British English informally. CAT follows formal rules.' },
          { q: 'Which sentence is correct?', options: ['Everyone must submit their forms by Monday.', 'Everyone must submit his or her form by Monday.', 'Everyone must submit they\'re forms by Monday.', 'Everyone must submit our forms by Monday.'], answer: 1, explanation: '"Everyone" is grammatically singular. The formally correct pronoun is "his or her" (singular). "Their" is acceptable in informal modern usage, but in CAT formal context, "his or her" is preferred.' }
        ]
      },
      {
        name: 'Articles & Determiners — A, An, The, Quantifiers',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'Determiners are words that come before nouns to specify which one, how many, or what kind. The most important determiners are articles (a, an, the), but also include quantifiers (much, many, few, little), demonstratives (this, that), and possessives.' },
          { type: 'table', label: 'Article Decision Chart', headers: ['Situation', 'Article', 'Example'], rows: [['First mention, countable singular, unspecified', 'a / an', 'I saw a bird.'], ['Second mention OR specific reference', 'the', 'The bird was a sparrow.'], ['Unique referents / superlatives', 'the', 'The sun. The best option.'], ['General plural / uncountable', '(none)', 'Birds can fly. Courage is rare.'], ['Before consonant sound', 'a', 'a university (sounds like "yoo")'], ['Before vowel sound', 'an', 'an hour (silent h), an MBA']] },
          { type: 'rule', icon: '📌', body: '<strong>A vs An — Sound, Not Spelling:</strong> The rule is based on the SOUND of the next word. "A uniform" (sounds like "yoo"), "an umbrella" (sounds like "uh"). "An hour" (silent h = vowel sound), "a historical" (aspirated h = consonant sound).' },
          { type: 'table', label: 'Quantifier Quick Guide', headers: ['', 'Countable Plural', 'Uncountable'], rows: [['Large quantity', 'many / a large number of', 'much / a great deal of'], ['Small quantity', 'few / a few', 'little / a little'], ['Negative', 'few (= not many)', 'little (= not much)'], ['Positive', 'a few (= some)', 'a little (= some)'], ['General', 'several / some', 'some / any']] },
          { type: 'error_correct', wrong: 'She has less friends than him. / I need less informations.', right: 'She has fewer friends than him. / I need less information.', note: '"Fewer" for countable nouns, "less" for uncountable. Friends are countable → fewer. Information is uncountable → less.' }
        ],
        miniQuiz: [
          { q: 'Choose correctly: "She is _____ European diplomat with _____ one-of-a-kind perspective."', options: ['an, an', 'a, a', 'an, a', 'a, an'], answer: 1, explanation: '"European" begins with a consonant sound /j/ (yoo-ro-pee-an) → "a European." "One" begins with a /w/ sound → "a one-of-a-kind." Both take "a."' },
          { q: '"There are _____ students in the hall than expected." Choose correctly.', options: ['less', 'fewer', 'little', 'much'], answer: 1, explanation: '"Students" are countable → use "fewer" (not "less"). "Less" applies to uncountable quantities like time, money, water.' }
        ]
      }
    ],
    quiz: [
      { q: 'Find the error: "The committee have submitted their report and the data are being reviewed."', options: ['No error', 'committee have → committee has; data are → data is', 'Only: committee have → committee has', 'Only: data are → data is'], answer: 1, explanation: '"Committee" (singular collective) → "has." "Data" in formal academic usage is now accepted as singular → "is." Both errors exist.' },
      { q: 'Choose: "He is one of the few professors who _____ students by name."', options: ['knows', 'know', 'known', 'is knowing'], answer: 1, explanation: 'The relative pronoun "who" refers to "few professors" (plural antecedent), not "one." Therefore → "who know" (plural verb).' }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  //  DAY 4 — ADJECTIVES, ADVERBS & DEGREES OF COMPARISON
  // ═══════════════════════════════════════════════════════════
  {
    day: 4,
    title: 'Adjectives, Adverbs & Comparison',
    emoji: '🎯',
    tagline: 'The Art of Description — Adding Precision to Your Language',
    xpReward: 210,
    topics: [
      {
        name: 'Adjectives — Degrees, Position & Modification',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'Adjectives modify nouns and pronouns. They answer: Which one? What kind? How many/much? English adjectives have three degrees: Positive (describing the quality), Comparative (comparing two), and Superlative (comparing three or more).' },
          { type: 'table', label: 'Degrees of Comparison', headers: ['Adjective', 'Positive', 'Comparative', 'Superlative'], rows: [['Short (1 syllable)', 'fast', 'faster', 'fastest'], ['Long (2+ syllables)', 'complex', 'more complex', 'most complex'], ['Irregular', 'good / bad / far', 'better / worse / farther', 'best / worst / farthest'], ['Double comparison error', '—', 'more faster ❌', 'most brightest ❌']] },
          { type: 'rule', icon: '⚠️', body: '<strong>Absolute Adjectives:</strong> Some adjectives cannot be compared because they express absolute states: unique, perfect, dead, infinite, unanimous, round, square, empty, complete. Writing "more unique" or "very perfect" is illogical. Something is either unique or it is not.' },
          { type: 'levels', label: 'Adjective Examples', beginner: '"She is a brilliant researcher." — brilliant: adjective modifying researcher.', intermediate: '"The more complex the problem, the greater the need for collaboration." — Double comparative structure.', advanced: '"The unprecedented scale of the disaster overwhelmed emergency responders." — unprecedented: absolute; cannot say "more unprecedented."', cat: '"Compared to its predecessor, the new policy is significantly more comprehensive." — more comprehensive: two-syllable → "more + adjective."', editorial: '"The government\'s increasingly inadequate response has drawn sharp criticism from all quarters."' },
          { type: 'error_correct', wrong: 'This is the most unique opportunity. / She is more intelligent than any student in her class.', right: 'This is a unique opportunity. / She is more intelligent than any other student in her class.', note: '"Unique" is absolute. In the second sentence, if she IS a student in the class, she cannot be more intelligent than "any student" — that would include herself. Add "other."' }
        ],
        miniQuiz: [
          { q: '"Of the two proposals, the second is _____." Choose correctly.', options: ['best', 'the best', 'better', 'the better'], answer: 3, explanation: 'When comparing EXACTLY TWO items, use the comparative (not superlative) with the definite article: "the better." Superlatives are for three or more.' },
          { q: 'Find the adjective error: "This is a more preferable solution."', options: ['No error', 'More preferable → preferable (double comparison)', 'Solution → solutions', 'Is → are'], answer: 1, explanation: '"Preferable" already contains the comparative meaning ("more worthy of preference"). Adding "more" creates a double comparison error: "more more-worthy." Correct: "This is a preferable solution."' }
        ]
      },
      {
        name: 'Adverbs — Placement, Types & Common Errors',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'Adverbs modify verbs, adjectives, other adverbs, and sometimes entire clauses. They answer: How? When? Where? How much/often? To what extent? Most (but not all) adverbs end in -ly.' },
          { type: 'table', label: 'Types of Adverbs', headers: ['Type', 'Function', 'Examples'], rows: [['Manner', 'How the action is done', 'quickly, carefully, loudly'], ['Time', 'When the action happens', 'yesterday, soon, already, yet'], ['Place', 'Where the action happens', 'here, there, everywhere, abroad'], ['Frequency', 'How often', 'always, usually, often, rarely, never'], ['Degree', 'To what extent', 'very, quite, rather, extremely, barely'], ['Sentence Adverbs', 'Modify the whole sentence', 'Unfortunately, Frankly, Clearly, Obviously']] },
          { type: 'rule', icon: '⚡', body: '<strong>Adverb Placement Rules:</strong> 1) Frequency adverbs go BEFORE the main verb but AFTER "be": "She always arrives early." / "She is always early." 2) "Only" must go IMMEDIATELY before the word it modifies: "I only eat rice" (I do nothing else) vs "I eat only rice" (I eat nothing else).' },
          { type: 'error_correct', wrong: 'The CEO hardly never misses a board meeting. / She speaks English very good.', right: 'The CEO hardly ever misses a board meeting. / She speaks English very well.', note: '"Hardly" is negative. "Hardly never" = double negative (two negatives cancel out). "Good" is an adjective; "well" is the adverb that modifies the verb "speaks."' }
        ],
        miniQuiz: [
          { q: 'Where does the adverb "almost" go? "The project _____ has _____ been _____ completed."', options: ['Position 1 (before "the")', 'Position 2 (before "has")', 'Position 3 (after "has")', 'Position 4 (after "been")'], answer: 2, explanation: '"Almost" (a degree adverb) modifies "completed" or the extent of completion. For perfect tenses, degree adverbs typically go between the auxiliary and the past participle: "has almost been completed."' },
          { q: 'Which sentence uses "only" correctly?', options: ['She only told him the truth about the project.', 'Only she told him the truth about the project.', 'She told him only the truth about the project.', 'B and C are both correct, serving different meanings.'], answer: 3, explanation: 'Both B and C are correct with different meanings. B: "Only she" = no one else told him. C: "only the truth" = she told nothing but the truth. Placement of "only" changes meaning significantly.' }
        ]
      },
      {
        name: 'Phrases & Clauses — The Building Blocks',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'A phrase is a group of words without a subject-verb pair. A clause has both a subject and a verb. An independent clause can stand alone; a dependent clause cannot.' },
          { type: 'table', label: 'Phrase Types', headers: ['Phrase Type', 'Structure', 'Function', 'Example'], rows: [['Noun Phrase', 'Det + Adj + Noun', 'Subject / Object / Complement', '"The diligent young professor" arrived.'], ['Verb Phrase', 'Auxiliary + Main Verb', 'Predicate', 'She "has been working" since dawn.'], ['Adjective Phrase', 'Adj + complement', 'Modifies noun', 'A decision "worthy of consideration."'], ['Adverb Phrase', 'Adv + complement', 'Modifies verb/adjective', 'She spoke "very carefully."'], ['Prepositional Phrase', 'Prep + Noun', 'Adj or Adverb function', '"Despite the challenges," she succeeded.'], ['Participial Phrase', 'Participle + ..', 'Modifies a noun', '"Exhausted by the journey," he slept.']] },
          { type: 'visual', label: '🔍 Clause Anatomy', diagram: `INDEPENDENT CLAUSE: "The market collapsed."
  → Can stand alone. Full sentence.

DEPENDENT CLAUSE: "Because the market collapsed"
  → Cannot stand alone. Needs main clause.

COMBINED: "Because the market collapsed, investors panicked."
  [Dependent clause] + , + [Independent clause]

TYPES OF DEPENDENT CLAUSES:
  Noun Clause: "What she said was true." (acts as noun - subject)
  Adj. Clause: "The policy that failed was poorly designed." (modifies noun)
  Adv. Clause: "Although he tried, he failed." (modifies verb)` },
          { type: 'error_correct', wrong: 'Running to the office. He forgot his laptop.', right: 'Running to the office, he forgot his laptop.', note: 'The participial phrase "Running to the office" must be attached to the main clause it modifies. Separating them creates a sentence fragment + a dangling modifier risk.' }
        ],
        miniQuiz: [
          { q: 'Identify the type of underlined clause: "The committee accepted [whatever proposal was submitted]."', options: ['Adjective Clause', 'Adverb Clause', 'Noun Clause', 'Independent Clause'], answer: 2, explanation: '"Whatever proposal was submitted" functions as the direct object of "accepted" — it is a noun clause (acting as a noun/object).' },
          { q: 'Which sentence contains a misplaced participial phrase?', options: ['Having finished the report, she submitted it.', 'The manager, having reviewed the files, signed off.', 'Having reviewed the files, the decision was made.', 'Exhausted from work, she finally rested.'], answer: 2, explanation: '"Having reviewed the files" is a participial phrase that must modify the subject of the main clause. The subject is "the decision" — decisions cannot review files. This is a dangling modifier.' }
        ]
      }
    ],
    quiz: [
      { q: 'Choose correctly: "She is the _____ of all the analysts in the firm."', options: ['more competent', 'most competent', 'competenter', 'competentest'], answer: 1, explanation: 'Comparing three or more (all analysts) → superlative. "Competent" is a multi-syllable adjective → "most competent" (not "competentest").' },
      { q: 'Find the error: "The new regulation is more stricter than the previous one."', options: ['No error', 'more stricter → stricter (double comparison)', 'previous → preceding', 'regulation → regulations'], answer: 1, explanation: '"Stricter" already IS the comparative form of "strict." Adding "more" creates a double comparison error. Correct: "The new regulation is stricter than the previous one."' }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  //  DAY 5 — CONJUNCTIONS, PREPOSITIONS & SENTENCE TYPES
  // ═══════════════════════════════════════════════════════════
  {
    day: 5,
    title: 'Conjunctions, Prepositions & Sentence Architecture',
    emoji: '🔗',
    tagline: 'Connecting Ideas — How English Builds Complex Thought',
    xpReward: 215,
    topics: [
      {
        name: 'Conjunctions — Coordinating, Subordinating & Correlative',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'Conjunctions join words, phrases, or clauses. The type of conjunction determines the grammatical relationship — equal partnership (coordinating), dependency (subordinating), or paired contrast (correlative).' },
          { type: 'table', label: '📊 Three Types of Conjunctions', headers: ['Type', 'Members', 'Function', 'Example'], rows: [['Coordinating (FANBOYS)', 'For, And, Nor, But, Or, Yet, So', 'Joins equal elements', '"The plan failed, but the team persisted."'], ['Subordinating', 'although, because, since, when, if, unless, whereas, while, after, before, until, even though', 'Creates dependent clause', '"Although the data supported it, the board rejected the proposal."'], ['Correlative', 'both...and, either...or, neither...nor, not only...but also, whether...or', 'Pairs two equal elements', '"Neither the management nor the union was satisfied."']] },
          { type: 'rule', icon: '⚡', body: '<strong>Correlative Conjunction SVA Rule:</strong> With "either...or" and "neither...nor," the verb agrees with the NEAREST subject. "Either the managers or the CEO is wrong." / "Either the CEO or the managers are wrong."' },
          { type: 'error_correct', wrong: 'Not only she won the award but also received a promotion. / She is both intelligent as well as hardworking.', right: 'Not only did she win the award, but she also received a promotion. / She is both intelligent and hardworking.', note: '"Not only...but also" requires parallel structure. When "not only" begins a sentence, subject-verb inversion is required. "Both...as well as" is redundant — use "both...and."' }
        ],
        miniQuiz: [
          { q: '"_____ the evidence was conclusive, the jury remained divided." Choose correctly.', options: ['Because', 'Although', 'Since', 'Therefore'], answer: 1, explanation: '"Although" signals concession — the two halves are in contrast (conclusive evidence + divided jury). "Because" and "since" show cause, not contrast. "Therefore" is a conjunctive adverb, not a conjunction.' },
          { q: 'Find the error: "Both the chairman as well as the directors agreed to the proposal."', options: ['No error', '"Both...as well as" is redundant; use "both...and"', '"agreed" should be "agree"', '"proposal" should be "proposals"'], answer: 1, explanation: '"Both...and" is the correct correlative pair. "As well as" cannot follow "both." Correct: "Both the chairman and the directors agreed."' }
        ]
      },
      {
        name: 'Prepositions — Common Errors & Idiomatic Use',
        content: [
          { type: 'text', heading: 'Why Prepositions Are Hard', body: 'Prepositions in English are mostly idiomatic — they cannot always be translated logically and must be learned contextually. Preposition errors are among the most common errors in CAT sentence correction.' },
          { type: 'table', label: '📊 Essential Preposition Idioms for CAT', headers: ['Expression', 'Correct Preposition', 'Example'], rows: [['Conform / Comply', 'with', 'Comply with the regulations.'], ['Differ / Differ from / Different from', 'from', 'Her view differs from mine.'], ['Angry', 'at (thing) / with (person)', 'Angry at the situation / with him.'], ['Suffer', 'from', 'She suffers from anxiety.'], ['Prejudiced / Biased', 'against', 'He is biased against reform.'], ['Sympathize / Agree', 'with', 'I sympathize with their cause.'], ['Invest', 'in', 'They invested in infrastructure.'], ['Oblivious', 'of / to', 'She is oblivious to the criticism.'], ['Responsible', 'for', 'He is responsible for the error.'], ['Indicative', 'of', 'This is indicative of a systemic issue.']] },
          { type: 'error_correct', wrong: 'The new policy is different than the previous one. / She is capable to handle the situation.', right: 'The new policy is different from the previous one. / She is capable of handling the situation.', note: '"Different from" (not "different than" or "different to" in formal British/Indian English). "Capable of + gerund" (not "capable to + infinitive").' }
        ],
        miniQuiz: [
          { q: 'Choose the correct preposition: "The findings are indicative _____ a fundamental design flaw."', options: ['about', 'of', 'for', 'with'], answer: 1, explanation: '"Indicative of" is the fixed prepositional idiom. The findings indicate (point to) a flaw. "Indicative of" is invariant — always use "of."' },
          { q: 'Find the preposition error: "She has great insight of the regulatory landscape."', options: ['No error', '"Insight of" → "insight into"', '"Great" → "greater"', '"landscape" → "landscapes"'], answer: 1, explanation: '"Insight into" is the correct idiomatic preposition. You have insight INTO something (not "of"). Correct: "She has great insight into the regulatory landscape."' }
        ]
      },
      {
        name: 'Sentence Types & Parallelism',
        content: [
          { type: 'text', heading: 'Sentence Types', body: 'English sentences are classified by structure (Simple, Compound, Complex, Compound-Complex) and by purpose (Declarative, Interrogative, Imperative, Exclamatory). CAT tests whether elements that are grammatically connected are also structurally parallel.' },
          { type: 'table', label: 'Structure Types', headers: ['Type', 'Definition', 'Example'], rows: [['Simple', 'One independent clause', '"She failed."'], ['Compound', 'Two independent clauses joined by FANBOYS / semicolon', '"She failed, but she tried again."'], ['Complex', 'One independent + one or more dependent clauses', '"Although she failed, she learned greatly."'], ['Compound-Complex', 'Two independent + at least one dependent clause', '"Although she failed, she tried again, and she succeeded."']] },
          { type: 'rule', icon: '⚡', body: '<strong>The Parallelism Rule:</strong> When two or more grammatical elements are joined by a conjunction, they must be in the SAME grammatical form. This applies to: lists, comparisons, correlative conjunctions, and coordinate structures.' },
          { type: 'visual', label: '⚖️ Parallelism Visual Guide', diagram: `PARALLEL (Correct):
  She likes reading, writing, and debating.
  (gerund + gerund + gerund) ✓

NON-PARALLEL (Error):
  She likes to read, writing, and to debate.
  (infinitive + gerund + infinitive) ✗

PARALLEL COMPARISON:
  The cost of prevention is lower than the cost of cure. ✓
  The cost of prevention is lower than cure. ✗ (comparing cost vs. cure)

CORRELATIVE PARALLEL:
  He is not only brilliant but also dedicated. ✓
  He is not only brilliant but also a hard worker. ✗ (adj vs. noun phrase)` },
          { type: 'error_correct', wrong: 'The new director is known for her intelligence, her dedication, and she works hard.', right: 'The new director is known for her intelligence, her dedication, and her hard work.', note: 'The list must be parallel. "Intelligence" and "dedication" are nouns. "She works hard" is a clause. Convert to noun: "her hard work."' }
        ],
        miniQuiz: [
          { q: 'Identify the parallelism error: "The project required planning carefully, to execute with precision, and management of resources efficiently."', options: ['No error', '"planning carefully" should be "to plan carefully"', '"to execute" should be "executing"; "management" should be "managing"', '"management" should be "to manage"'], answer: 2, explanation: 'The three elements should be parallel. If we begin with a gerund "planning," all must be gerunds: "planning carefully, executing with precision, and managing resources efficiently."' },
          { q: 'Which compound sentence is punctuated correctly?', options: ['She studied hard, but, she failed.', 'She studied hard but she failed.', 'She studied hard, but she failed.', 'She studied hard; but she failed.'], answer: 2, explanation: 'Comma + coordinating conjunction (FANBOYS) connects two independent clauses. The comma goes BEFORE "but," not after it. A semicolon alone (without FANBOYS) is also correct, but "semicolon + but" is generally avoided.' }
        ]
      }
    ],
    quiz: [
      { q: '"The report was not only incomplete but also _____ errors." Choose correctly.', options: ['contained many', 'containing many', 'many', 'had many'], answer: 0, explanation: '"Not only X but also Y" requires parallel grammatical forms. "Was... incomplete" suggests a past state. "Contained" (past tense) maintains parallelism: "was not only incomplete but also contained errors."' },
      { q: 'Which is the best rewrite of: "The CEO decided to resign, and his resignation shocked the board, and it led to a stock collapse."', options: ['The CEO decided to resign, shocked the board, and collapsed the stock.', 'The CEO\'s resignation, which shocked the board, led to a stock collapse.', 'The CEO resigned and shocked the board which led to a stock collapse.', 'No change needed.'], answer: 1, explanation: 'The original uses three coordinated clauses awkwardly. Restructuring into a Complex sentence (with a relative clause) creates tighter, more elegant prose — exactly what CAT tests.' }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  //  DAY 6 — COMMON GRAMMATICAL ERRORS & CAT TRAPS
  // ═══════════════════════════════════════════════════════════
  {
    day: 6,
    title: 'Common Errors, CAT Traps & Error Spotting',
    emoji: '🪤',
    tagline: 'The 20 Error Patterns That Appear in 80% of CAT Questions',
    xpReward: 230,
    topics: [
      {
        name: 'Modifiers — Dangling, Misplaced & Squinting',
        content: [
          { type: 'text', heading: 'Why Modifiers Are a Top CAT Test Area', body: 'Misplaced and dangling modifiers are among the most frequently tested error types in CAT Verbal Ability. A modifier must be placed ADJACENT to (or as close as possible to) the element it modifies, and the element it modifies must actually appear in the sentence.' },
          { type: 'table', label: 'Three Modifier Error Types', headers: ['Error Type', 'Definition', 'Example (Wrong)', 'Correction'], rows: [['Dangling Modifier', 'The word being modified is absent from the sentence', '"Exhausted after the climb, the summit looked beautiful." (summit didn\'t climb)', '"Exhausted after the climb, we found the summit beautiful."'], ['Misplaced Modifier', 'The modifier is present but in the wrong position', '"She nearly drove 500 miles." (nearly 500? or she almost drove?)', '"She drove nearly 500 miles."'], ['Squinting Modifier', 'The modifier could modify either the word before or after it', '"Students who study often succeed." (often study? or often succeed?)', '"Students who often study succeed." OR "Students who study succeed often."']] },
          { type: 'levels', label: 'Examples by Level', beginner: 'Wrong: "Walking down the road, a truck passed by." Right: "Walking down the road, I saw a truck pass by."', intermediate: 'Wrong: "She only eats salad for lunch." (ambiguous) Right: "She eats only salad for lunch." (nothing else).', advanced: 'Wrong: "The director, having failed to reach a consensus, the meeting was adjourned." Right: "Having failed to reach a consensus, the director adjourned the meeting."', cat: 'Wrong: "To understand the policy, a careful reading of the report is necessary." Right: "To understand the policy, one must read the report carefully."', editorial: 'Wrong: "Determined to curb inflation, interest rates were raised by the central bank." Right: "Determined to curb inflation, the central bank raised interest rates."' }
        ],
        miniQuiz: [
          { q: 'Identify the modifier error: "While driving to the office, the city looked beautiful."', options: ['No error — "while driving" modifies "city"', 'Dangling modifier — who is driving?', 'Misplaced modifier — "beautiful" is wrong', 'Squinting modifier — "while" is ambiguous'], answer: 1, explanation: '"While driving" is a dangling modifier. A city cannot drive. The subject of the main clause must be the one driving. Correct: "While driving to the office, I found the city beautiful."' },
          { q: 'Fix: "The professor graded the papers that she had collected hurriedly."', options: ['No error — hurriedly modifies graded', '"hurriedly" should come after "professor"', '"hurriedly" should be moved before "graded": "The professor hurriedly graded..."', 'Hurriedly is unnecessary'], answer: 2, explanation: 'As written, "hurriedly" could modify either "collected" or "graded" — this is a squinting modifier. Moving it: "The professor hurriedly graded the papers she had collected" clarifies it modifies "graded."' }
        ]
      },
      {
        name: 'The 12 Most Tested CAT Error Patterns',
        content: [
          { type: 'text', heading: 'Master These Patterns to Solve 80% of Questions', body: 'CAT Sentence Correction recycles the same categories of errors. Here are the 12 patterns you must recognise on sight.' },
          { type: 'table', label: '🪤 The 12 CAT Error Patterns', headers: ['#', 'Pattern', 'Wrong', 'Right'], rows: [['1', 'Double Comparison', 'more faster', 'faster'], ['2', 'Double Negative', 'can\'t hardly / barely never', 'can hardly / barely ever'], ['3', 'Adjective vs Adverb', 'She sings beautiful.', 'She sings beautifully.'], ['4', 'False Parallelism', 'to eat, sleep, and running', 'to eat, sleep, and run'], ['5', 'Wrong Pronoun Case', 'between you and I', 'between you and me'], ['6', 'Dangling Modifier', 'Running fast, the finish line was reached.', 'Running fast, she reached the finish line.'], ['7', 'SVA with Collective Nouns', 'The team are working hard.', 'The team is working hard. (AmE)'], ['8', 'SVA with Correlatives', 'Neither he nor they was wrong.', 'Neither he nor they were wrong.'], ['9', 'Wrong Comparative Range', 'She is smarter than any student.', 'She is smarter than any other student.'], ['10', 'Tense Sequence Error', 'If she studies, she would pass.', 'If she studies, she will pass.'], ['11', 'Wrong Preposition Idiom', 'Different than / capable to', 'Different from / capable of'], ['12', 'Uncountable Noun Plural', 'Give me informations / advices.', 'Give me information / advice.']] },
          { type: 'cat_tip', body: 'In CAT sentence correction, when you spot an error, eliminate all options that do NOT fix that error, then check remaining options for new errors. This two-pass elimination technique is faster than reading all options fully.' }
        ],
        miniQuiz: [
          { q: 'Spot the error: "The team of analysts have presented their findings to the board."', options: ['No error', 'have → has; their → its', 'have → is; their is fine', 'analysts → analyst'], answer: 1, explanation: '"The team" is the subject (singular collective noun in formal usage) → "has." Since the verb is singular, the pronoun should also be singular → "its." "The team of analysts has presented its findings."' },
          { q: 'Find the CAT pattern: "If the government would have acted sooner, the crisis would have been averted."', options: ['No error', '"would have acted" → "had acted" (Third Conditional)', '"been averted" → "be averted"', '"sooner" → "soon"'], answer: 1, explanation: 'Third Conditional structure: "If + Past Perfect, would have + V3." The "if" clause must use Past Perfect ("had acted"), NOT "would have." This is one of the most tested CAT errors.' }
        ]
      },
      {
        name: 'Conditional Sentences — All Four Types',
        content: [
          { type: 'text', heading: 'Why Conditionals Are Heavily Tested', body: 'Conditional sentences express hypothetical situations and their consequences. The tense in the "if" clause and the consequence clause must follow strict patterns. Any deviation is an error.' },
          { type: 'table', label: 'The Four Conditionals', headers: ['Type', 'Meaning', '"If" Clause', 'Main Clause', 'Example'], rows: [['Zero', 'Universal truth / habit', 'Simple Present', 'Simple Present', 'If water reaches 100°C, it boils.'], ['First', 'Real / likely future', 'Simple Present', 'will + V1', 'If she studies, she will pass.'], ['Second', 'Unreal present / unlikely', 'Simple Past', 'would + V1', 'If I were president, I would reform education.'], ['Third', 'Unreal past (regret)', 'Past Perfect', 'would have + V3', 'If she had studied, she would have passed.']] },
          { type: 'rule', icon: '⚠️', body: '<strong>Critical: "Were" not "Was" in Second Conditional:</strong> In formal English, the second conditional ALWAYS uses "were" for ALL persons — even singular. "If I were you..." / "If she were the president..." The use of "was" is informal.' },
          { type: 'error_correct', wrong: 'If he would study more, he would do better. / If she was honest, she would admit it.', right: 'If he studied more, he would do better. / If she were honest, she would admit it.', note: 'Second Conditional: "If" clause = Simple Past. Never use "would" in the "if" clause. Also use "were" (not "was") for all subjects in formal contexts.' }
        ],
        miniQuiz: [
          { q: 'Choose the correct conditional: "If the company _____ the market trends, it _____ the product launch."', options: ['studied / will delay', 'had studied / would have delayed', 'studied / would delay', 'had studied / would delay'], answer: 1, explanation: 'The context implies past unreality (they did not study, so they did not delay). This is Third Conditional: "If + Past Perfect (had studied), would have + V3 (would have delayed)."' },
          { q: 'Which conditional is: "If I were in your position, I would immediately appeal the decision."', options: ['Zero Conditional', 'First Conditional', 'Second Conditional', 'Third Conditional'], answer: 2, explanation: 'Second Conditional: "If + Simple Past (were), would + V1 (would appeal)." The speaker is not in that position — it is an unreal present situation. Note: "were" (not "was") — formal subjunctive.' }
        ]
      }
    ],
    quiz: [
      { q: 'Find the error category: "She not only completed the project on time and also delivered outstanding results."', options: ['Dangling modifier', 'False parallelism in correlative conjunction', 'SVA error', 'Wrong conditional'], answer: 1, explanation: '"Not only...and also" is wrong. The correct correlative pair is "not only...but also." Correct: "She not only completed the project on time but also delivered outstanding results."' },
      { q: 'Choose the correct option: "Had she invested earlier, she _____ by now."', options: ['will have profited greatly', 'would profit greatly', 'would have profited greatly', 'had profited greatly'], answer: 2, explanation: '"Had she invested" is an inverted Third Conditional (= "If she had invested"). The consequence must be "would have + V3" → "would have profited greatly."' }
    ]
  },

  // ═══════════════════════════════════════════════════════════
  //  DAY 7 — ACTIVE/PASSIVE, REPORTED SPEECH & MOCK PRACTICE
  // ═══════════════════════════════════════════════════════════
  {
    day: 7,
    title: 'Voice, Reported Speech & Full Mock Practice',
    emoji: '🏆',
    tagline: 'The Final Stretch — Complete Your Grammar Mastery',
    xpReward: 250,
    topics: [
      {
        name: 'Active & Passive Voice — Complete Guide',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'In the active voice, the subject performs the action. In the passive voice, the subject receives the action. The passive voice is formed with "be + past participle" and is used when the actor is unknown, unimportant, or should be de-emphasised.' },
          { type: 'table', label: 'Active → Passive Transformation by Tense', headers: ['Tense', 'Active', 'Passive'], rows: [['Simple Present', 'She writes the report.', 'The report is written by her.'], ['Present Continuous', 'She is writing the report.', 'The report is being written by her.'], ['Present Perfect', 'She has written the report.', 'The report has been written by her.'], ['Simple Past', 'She wrote the report.', 'The report was written by her.'], ['Past Perfect', 'She had written it.', 'It had been written by her.'], ['Simple Future', 'She will write it.', 'It will be written by her.'], ['Modal', 'She should submit it.', 'It should be submitted by her.']] },
          { type: 'rule', icon: '⚡', body: '<strong>Only Transitive Verbs Can Be Passivised:</strong> A verb must have a direct object to be converted to passive. "She slept" cannot be made passive because "slept" is intransitive (no object). Intransitive verbs have no passive form.' },
          { type: 'error_correct', wrong: 'The matter is being looked at. (unclear who) vs The matter was being discussed by us when he interrupted.', right: 'We are looking into the matter. / We were discussing the matter when he interrupted.', note: 'Excessive passive voice creates ambiguity and wordiness. CAT often tests the ability to identify when passive voice is unnecessarily used. Prefer active voice for clarity.' }
        ],
        miniQuiz: [
          { q: 'Convert to passive: "The board will have reviewed the proposal by Friday."', options: ['The proposal will be reviewed by the board by Friday.', 'The proposal will have been reviewed by the board by Friday.', 'The proposal has been reviewed by the board by Friday.', 'The proposal was reviewed by the board by Friday.'], answer: 1, explanation: 'Future Perfect Active: "will have reviewed." Passive form: Subject (proposal) + will have been + past participle (reviewed) + by agent (the board) + time. → "will have been reviewed."' },
          { q: 'Which sentence cannot be converted to passive voice?', options: ['She painted the mural.', 'He appears happy.', 'The committee discussed the agenda.', 'The government announced new policies.'], answer: 1, explanation: '"Appears" is a linking verb (intransitive) — it takes a complement, not an object. Without a direct object, passive transformation is impossible. A, C, D all have direct objects and can be passivised.' }
        ]
      },
      {
        name: 'Reported Speech — Tense Backshift & Transformations',
        content: [
          { type: 'text', heading: 'Simple Definition', body: 'Reported (indirect) speech reports what someone said without using their exact words. The reporting verb (said, told, asked) determines the structure, and the tense of the reported clause typically shifts one step back in time (backshift).' },
          { type: 'table', label: 'Tense Backshift Rules', headers: ['Direct Speech Tense', 'Reported Speech Tense'], rows: [['Simple Present', 'Simple Past'], ['Present Continuous', 'Past Continuous'], ['Present Perfect', 'Past Perfect'], ['Simple Past', 'Past Perfect'], ['Will', 'Would'], ['Can', 'Could'], ['May', 'Might'], ['Must', 'Had to']] },
          { type: 'visual', label: '🔄 Complete Transformation Example', diagram: `DIRECT: "I will submit the report by Monday," she said.
REPORTED: She said (that) she would submit the report by Monday.

DIRECT: "Have you reviewed the proposal?" he asked her.
REPORTED: He asked her if/whether she had reviewed the proposal.

DIRECT: "Please send the documents immediately," he said to us.
REPORTED: He asked us to send the documents immediately.

KEY CHANGES IN REPORTED SPEECH:
• I/we → she/they (pronoun shift)
• Tomorrow → the next day / the following day
• Yesterday → the previous day / the day before
• Here → there
• This → that / these → those
• Now → then` },
          { type: 'error_correct', wrong: '"Come here," the manager told to us. / He said that the meeting will start at 9.', right: '"Come here," the manager told us. / He said that the meeting would start at 9.', note: '"Tell" takes an indirect object WITHOUT "to": "told us" (not "told to us"). The tense "will" shifts to "would" in reported speech.' }
        ],
        miniQuiz: [
          { q: 'Convert: Direct: "We have completed the project," they announced. Which is correct reported speech?', options: ['They announced that they had completed the project.', 'They announced that they have completed the project.', 'They announced that they completed the project.', 'They announced that we have completed the project.'], answer: 0, explanation: 'Present Perfect ("have completed") shifts to Past Perfect ("had completed") in reported speech. Pronouns also shift: "we" → "they" (since we are reporting about them).' },
          { q: 'Which reporting verb error appears in: "The CEO said the analysts to prepare a revised forecast."?', options: ['No error', '"said" should be "told" — told takes a person as object', '"said" should be "spoke"', '"prepare" should be "prepared"'], answer: 1, explanation: '"Said" cannot take a person as its indirect object. "Tell + person" is correct: "The CEO told the analysts to prepare..." OR: "The CEO said that the analysts should prepare..." Both are acceptable alternatives.' }
        ]
      },
      {
        name: 'Vocabulary in Context & Reading Comprehension Strategies',
        content: [
          { type: 'text', heading: 'The Final Edge for CAT Verbal Ability', body: 'CAT Verbal Ability sections test not just grammar but vocabulary in context, para-jumbles, critical reasoning, and reading comprehension. The following strategies will give you a decisive advantage.' },
          { type: 'rule', icon: '🎯', body: '<strong>Strategy 1 — Context Vocabulary:</strong> Never memorise isolated word lists. Instead, build vocabulary through editorials. For each word you encounter, record: meaning, part of speech, usage in sentence, antonym, and one newspaper sentence using it.' },
          { type: 'rule', icon: '🎯', body: '<strong>Strategy 2 — Para-Jumbles (TITA):</strong> 1) Find the OPENING sentence (introduces topic, no pronoun reference). 2) Find the CLOSING sentence (conclusion, no continuation signals). 3) Link sentences using pronouns → their antecedents. 4) Look for transition signals (however, therefore, consequently, furthermore).' },
          { type: 'rule', icon: '🎯', body: '<strong>Strategy 3 — RC Speed Reading:</strong> Read the first and last paragraph fully. Skim the middle paragraphs for topic sentences (usually the first sentence of each paragraph). Read all answer options BEFORE returning to the passage. Predict the answer type first.' },
          { type: 'table', label: '📰 High-Value Editorial Vocabulary (30 Words)', headers: ['Word', 'Meaning', 'Usage in CAT Context'], rows: [['Contentious', 'causing disagreement', 'The bill\'s contentious provisions sparked debate.'], ['Exacerbate', 'make worse', 'Poor drainage exacerbates flooding risks.'], ['Ameliorate', 'make better', 'Structural reforms would ameliorate inequality.'], ['Lacunae', 'gaps, deficiencies (pl.)', 'Lacunae in the policy framework were identified.'], ['Inimical', 'hostile, harmful', 'Such policies are inimical to growth.'], ['Perfunctory', 'hasty, lacking care', 'The investigation was perfunctory at best.'], ['Predicated', 'based, dependent', 'Growth is predicated on stable governance.'], ['Proclivity', 'strong inclination', 'A proclivity for risk-averse decisions.'], ['Recalcitrant', 'uncooperatively stubborn', 'Recalcitrant board members blocked the vote.'], ['Sacrosanct', 'too important to change', 'The constitutional framework is sacrosanct.']] },
          { type: 'cat_tip', body: 'The CAT Reading Comprehension passages are drawn from publications like The Economist, The Guardian, Scientific American, and Harvard Business Review. Reading one article from each per day for a month creates a significant vocabulary and analytical advantage.' }
        ],
        miniQuiz: [
          { q: 'Choose the word that best completes: "The committee\'s _____ response to the crisis drew sharp criticism from civil society."', options: ['exemplary', 'perfunctory', 'prescient', 'tenacious'], answer: 1, explanation: '"Perfunctory" means carried out with a minimum of effort, mechanical, hastily done. This fits the context of a response that drew criticism for being inadequate.' },
          { q: 'In "The policy is predicated on the assumption that fiscal discipline will hold," "predicated" means:', options: ['opposed to', 'based on / dependent on', 'critical of', 'directed at'], answer: 1, explanation: '"Predicated on" means "based on" or "dependent on for its validity." The policy\'s logic depends on the fiscal discipline assumption.' }
        ]
      }
    ],
    quiz: [
      { q: 'Which sentence is in the correct passive form?', options: ['The report was written by the committee and submitted.', 'The report written by the committee and submitted.', 'The report was written and the committee submitted it.', 'By the committee the report was written and submitted.'], answer: 0, explanation: '"Was written... and submitted" — compound passive predicate with two past participles sharing the auxiliary "was." Both actions are passive and parallel. Option A is correct.' },
      { q: 'Convert to reported speech: "I cannot attend the meeting tomorrow," the director said.', options: ['The director said that he can\'t attend the meeting tomorrow.', 'The director said that he could not attend the meeting the next day.', 'The director said that he will not attend the meeting the following day.', 'The director told that he could not attend the meeting tomorrow.'], answer: 1, explanation: '"Cannot" → "could not" (backshift). "Tomorrow" → "the next day" (time reference shift). "Said" + "that" (no direct object person) is correct. "Told" requires a person object: "told us." Option B is correct.' }
    ]
  }

];

// ─────────────────────────────────────────────────────────────
export function getDay(dayNum) {
  return curriculum.find(d => d.day === dayNum) || null;
}

export const TOTAL_DAYS = curriculum.length;
