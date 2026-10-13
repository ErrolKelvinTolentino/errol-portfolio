// Project records. `cover` and `shots` point at files in assets/shots/ — replace the
// placeholder SVGs with real screenshots and update the extension here. See assets/README.md.

// `links` slots are empty until you fill them in:
//   repo — the public GitHub repository
//   apk  — a Google Drive share link to the installable .apk (Android projects)
//   live — a deployed URL people can open (web projects)
//   demo — { src, poster }. Put an .mp4/.webm in assets/demos/ and the page plays it
//          inline; use any other URL (YouTube, Drive) and the poster opens it in a new tab.
// While a slot is empty the page shows a muted "add link" chip so you can see what is
// still outstanding. Set `showPendingLinks` to false to hide those chips from visitors.
export const showPendingLinks = false;
export const projects = {
  inaagapay: {
    name: 'InaAgapay',
    tagline: 'Health records that keep barangay midwives a step ahead.',
    category: 'APPLIED AI · HEALTH INFORMATION',
    role: 'Full-Stack Developer',
    device: 'web',
    cover: 'assets/shots/inaagapay-cover.svg',
    coverAlt: 'InaAgapay care workspace screenshot',
    summary: 'An AI-assisted maternal and child health information system for barangay midwives and the mothers they care for, built across web and mobile.',
    features: [
      'Digital patient records and maternal and child health data workflows.',
      'Prenatal care tracking and immunization scheduling in one timeline.',
      'AI-assisted chatbot support, pregnancy risk analysis, weight-trend interpretation, speech-to-text, and text generation.',
      'Multiple LLMs integrated through the Groq API, with fallback models so the assistant stays available.'
    ],
    focus: 'Designing health workflows first, then letting AI do the parts it is actually good at — summarising, transcribing, surfacing trends. Fallback models keep the assistance available when a provider is not. These are assistance and information features, not a claim of clinical validation.',
    stack: ['Flutter', 'Supabase', 'Firebase', 'PostgreSQL', 'JavaScript', 'Groq API'],
    links: {
      repo: 'https://github.com/ErrolKelvinTolentino/Inaagapay-Capstone2',
      apk: '',
      demo: { src: '', poster: 'assets/demos/inaagapay-poster.svg' }
    },
    shots: [
      { src: 'assets/shots/inaagapay-1.svg', device: 'phone', alt: 'InaAgapay mobile patient record screen', caption: 'Patient records on mobile' },
      { src: 'assets/shots/inaagapay-2.svg', device: 'phone', alt: 'InaAgapay prenatal tracking screen', caption: 'Prenatal tracking and schedules' },
      { src: 'assets/shots/inaagapay-3.svg', device: 'web', alt: 'InaAgapay web dashboard', caption: 'Midwife dashboard on the web' }
    ]
  },
  kaibigan: {
    name: 'Kaibigan',
    tagline: 'A mental wellness companion that speaks Filipino.',
    category: 'APPLIED AI · EVERYDAY WELLNESS',
    role: 'Solo Developer',
    device: 'phone',
    cover: 'assets/shots/kaibigan-cover.svg',
    coverAlt: 'Kaibigan journal screen screenshot',
    summary: 'A localized mobile wellness companion for Filipinos, built around private journaling, emotional reflection, and small daily acts of self-care.',
    features: [
      'Mood tracking, gratitude activities, guided breathing, grounding exercises, affirmations, routines, and reflections.',
      'Full Filipino and English localization, so the app meets people in the language they think in.',
      'Optional AI-assisted journal reflection using Google Gemini, with Groq as a fallback provider.',
      'Authentication, row-level database access controls, cloud storage, and CRUD workflows on Supabase and PostgreSQL.',
      'AI requests routed through backend edge functions, with safeguards around sensitive content and user data.'
    ],
    focus: 'Privacy was the design constraint, not an afterthought: keys and prompts stay server-side, reflection is opt-in, and the journal works completely offline of any AI. Localization and provider fallback keep it dependable day to day.',
    stack: ['Flutter', 'Supabase', 'PostgreSQL', 'Google Gemini', 'Groq API', 'Edge Functions'],
    links: {
      repo: 'https://github.com/ErrolKelvinTolentino/Kaibigan',
      apk: '',
      demo: { src: '', poster: 'assets/demos/kaibigan-poster.svg' }
    },
    shots: [
      { src: 'assets/shots/kaibigan-1.svg', device: 'phone', alt: 'Kaibigan mood check-in screen', caption: 'Daily mood check-in' },
      { src: 'assets/shots/kaibigan-2.svg', device: 'phone', alt: 'Kaibigan journal entry screen', caption: 'Private journaling' },
      { src: 'assets/shots/kaibigan-3.svg', device: 'phone', alt: 'Kaibigan guided breathing screen', caption: 'Guided breathing and grounding' }
    ]
  },
  gola: {
    name: 'Gola',
    tagline: 'Turns a vague goal into a plan you can start today.',
    category: 'APPLIED AI · PRODUCTIVITY',
    role: 'Solo Developer',
    device: 'web',
    cover: 'assets/shots/gola-cover.svg',
    coverAlt: 'Gola planning dashboard screenshot',
    summary: 'Companion web and mobile apps that break a user-defined goal into a personalized, AI-assisted action plan — then help you actually work through it.',
    features: [
      'Personalized action plans generated from goals written in the user’s own words.',
      'Task organization and progress visualization across the whole plan.',
      'Pomodoro focus sessions with productivity analytics.',
      'Groq-powered LLM workflows wired into Firebase-backed application data.'
    ],
    focus: 'Planning, execution, and review usually live in three different apps. Gola keeps them in one loop, shared by a Flutter mobile client and a React.js web client on the same Firebase data model.',
    stack: ['Flutter', 'React.js', 'Firebase', 'Groq API'],
    links: {
      repo: 'https://github.com/ErrolKelvinTolentino/Gola',
      webRepo: 'https://github.com/ErrolKelvinTolentino/Gola-React',
      apk: '',
      live: '',
      demo: { src: '', poster: 'assets/demos/gola-poster.svg' }
    },
    shots: [
      { src: 'assets/shots/gola-1.svg', device: 'phone', alt: 'Gola goal breakdown screen', caption: 'Goal broken into steps' },
      { src: 'assets/shots/gola-2.svg', device: 'phone', alt: 'Gola focus timer screen', caption: 'Pomodoro focus session' },
      { src: 'assets/shots/gola-3.svg', device: 'web', alt: 'Gola web progress dashboard', caption: 'Progress analytics on the web' }
    ]
  },
  webibo: {
    name: 'Webibo',
    tagline: 'Learning to code, turned into a game worth finishing.',
    category: 'WEB DEVELOPMENT · GAMIFIED LEARNING',
    role: 'Project Manager & UI/UX Designer',
    device: 'web',
    cover: 'assets/shots/webibo-cover.svg',
    coverAlt: 'Webibo lesson interface screenshot',
    summary: 'A web-based gamified learning platform that teaches basic HTML, CSS, and JavaScript through structured lessons and interactive coding challenges.',
    features: [
      'Led platform development and coordinated implementation across the team.',
      'Designed the platform’s interface and end-to-end learner experience.',
      'Built a progression system of achievements, experience points, and levels to keep beginners moving.',
      'Accepted and presented at IRCITE 2026 as part of the conference’s research presentation program.'
    ],
    focus: 'Beginners quit when feedback is slow and progress is invisible. Webibo answers both — every challenge runs in the browser, and every completed lesson visibly moves the learner forward. The research presentation covered system design, the gamification model, and implementation.',
    stack: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    links: {
      repo: 'https://github.com/HangryProphet/webibo',
      live: '',
      demo: { src: '', poster: 'assets/demos/webibo-poster.svg' }
    },
    shots: [
      { src: 'assets/shots/webibo-1.svg', device: 'web', alt: 'Webibo lesson screen', caption: 'Structured lesson view' },
      { src: 'assets/shots/webibo-2.svg', device: 'web', alt: 'Webibo coding challenge screen', caption: 'Interactive coding challenge' },
      { src: 'assets/shots/webibo-3.svg', device: 'web', alt: 'Webibo learner progression screen', caption: 'Achievements and progression' }
    ]
  },
  peasycheck: {
    name: 'PeasyCheck',
    tagline: 'Every lab machine accounted for.',
    category: 'DESKTOP · EQUIPMENT MANAGEMENT',
    role: 'Project Manager & Full-Stack Developer',
    device: 'web',
    summary: 'A desktop system for monitoring computer laboratory equipment and keeping maintenance information in one place instead of five notebooks.',
    features: [
      'Equipment status monitoring across the laboratory.',
      'Defect reports and reported-issue tracking.',
      'Maintenance records backed by MySQL.'
    ],
    focus: 'Centralizing equipment condition, issue reporting, and maintenance history into a single workflow the lab staff can actually keep current.',
    stack: ['Java', 'MySQL'],
    links: {
      repo: '',
      demo: { src: '', poster: 'assets/demos/peasycheck-poster.svg' }
    },
    shots: [
      { src: 'assets/shots/peasycheck-1.svg', device: 'web', alt: 'PeasyCheck equipment list screen', caption: 'Equipment status list' },
      { src: 'assets/shots/peasycheck-2.svg', device: 'web', alt: 'PeasyCheck maintenance record screen', caption: 'Maintenance records' }
    ]
  },
  woof: {
    name: 'Woof n’ Go',
    tagline: 'Pet supplies, from browse to delivered.',
    category: 'MOBILE · E-COMMERCE',
    role: 'Mobile Application Development',
    device: 'phone',
    summary: 'A mobile pet-supply e-commerce application covering both the customer shopping journey and the administrative side behind it.',
    features: [
      'Product browsing, ordering, and purchase tracking.',
      'Inventory management and order administration.',
      'Sales records connected to Firebase-backed application data.'
    ],
    focus: 'Treating the storefront and the back office as one system, so an order placed on the customer side immediately shows up where it is fulfilled.',
    stack: ['Kotlin', 'Firebase'],
    links: {
      repo: '',
      apk: '',
      demo: { src: '', poster: 'assets/demos/woof-poster.svg' }
    },
    shots: [
      { src: 'assets/shots/woof-1.svg', device: 'phone', alt: 'Woof n’ Go product browsing screen', caption: 'Storefront and product browsing' },
      { src: 'assets/shots/woof-2.svg', device: 'phone', alt: 'Woof n’ Go order administration screen', caption: 'Order administration' }
    ]
  },
  salon: {
    name: 'Leah’s Salon',
    tagline: 'No more paper queue.',
    category: 'WEB · BUSINESS OPERATIONS',
    role: 'Solo Developer',
    device: 'web',
    summary: 'A web-based queueing and administration system that runs the day-to-day floor of a working salon.',
    features: [
      'Customer queue management in real time.',
      'Service and appointment management.',
      'Sales records through a centralized administrative dashboard.'
    ],
    focus: 'Mapping an existing paper workflow onto the screen without making the staff learn a new job — the queue behaves the way the salon already thinks about it.',
    stack: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    links: {
      repo: '',
      live: '',
      demo: { src: '', poster: 'assets/demos/salon-poster.svg' }
    },
    shots: [
      { src: 'assets/shots/salon-1.svg', device: 'web', alt: 'Leah’s Salon queue screen', caption: 'Live customer queue' },
      { src: 'assets/shots/salon-2.svg', device: 'web', alt: 'Leah’s Salon administration dashboard', caption: 'Administrative dashboard' }
    ]
  }
};
