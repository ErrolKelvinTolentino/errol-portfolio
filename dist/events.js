// Events. One record feeds two views: the Experience timeline (section 03) and the
// gallery grid + lightbox (section 04). Add an entry here and it appears in both.
// `sort` places it on the timeline — higher is more recent, so use the start year
// plus a fraction (2026.3 for March 2026). `group` picks its gallery filter.
// `photos` accepts any number of images — replace the placeholder SVGs in assets/events/
// with real photos and update the extension here. See assets/README.md.
export const events = [
  {
    slug: 'gem-in-ai',
    sort: 2026.3,
    title: 'Gem in AI',
    group: 'speaking',
    kind: 'SPEAKING',
    role: 'Speaker',
    organization: 'Google Developer Groups on Campus — National University Baliwag',
    date: 'March 2026',
    headline: 'Making AI make sense.',
    blurb: 'Took a room of student developers from “what even is a model” to shipping a Google Gemini integration — and made the case that responsible use is part of the engineering, not a footnote to it.',
    photos: [
      { src: 'assets/events/gem-in-ai.svg', alt: 'Errol speaking at the Gem in AI session', caption: 'Presenting practical Gemini integrations to student developers.' }
    ]
  },
  {
    slug: 'ircite-2026',
    sort: 2026.0,
    title: 'IRCITE 2026',
    group: 'speaking',
    kind: 'RESEARCH',
    role: 'Research Presenter',
    organization: 'International Research Conference on Information Technology Education',
    date: '2026',
    headline: 'From project to presentation.',
    blurb: 'Wrote up Webibo’s system design, gamification model, and implementation, then defended it in front of an international audience of IT educators.',
    photos: [
      { src: 'assets/events/ircite-2026.svg', alt: 'Errol presenting Webibo at IRCITE 2026', caption: 'Research paper accepted and presented at IRCITE 2026.' }
    ]
  },
  {
    slug: 'gdg-web-dev',
    sort: 2025.5,
    title: 'Web Development Assistant Lead',
    group: 'leadership',
    kind: 'LEADERSHIP',
    role: 'Assistant Lead',
    organization: 'Google Developer Groups on Campus — National University Baliwag',
    date: '2025 — 2026',
    headline: 'Teaching the thing I was still learning.',
    blurb: 'Ran the web development track for the campus chapter — planning sessions, supporting members through their first builds, and keeping the community learning together.',
    photos: [
      { src: 'assets/events/gdg-web-dev.svg', alt: 'GDG on Campus web development session', caption: 'Leading web development sessions with the campus chapter.' }
    ]
  },
  {
    slug: 'gdsc-operations',
    sort: 2023.5,
    title: 'Chief Operations Officer',
    group: 'leadership',
    kind: 'LEADERSHIP',
    role: 'Chief Operations Officer',
    organization: 'Google Developer Student Clubs — National University Baliwag',
    date: '2023 — 2024',
    headline: 'Making the events actually happen.',
    blurb: 'Operations, coordination, and the unglamorous logistics that decide whether a technical community shows up a second time.',
    photos: [
      { src: 'assets/events/gdsc-operations.svg', alt: 'Google Developer Student Clubs event', caption: 'Running operations for campus developer events.' }
    ]
  },
  {
    slug: 'nu-literates-grievances',
    sort: 2024.5,
    title: 'Student Grievances Officer',
    group: 'leadership',
    kind: 'COMMUNITY',
    role: 'Student Grievances Officer',
    organization: 'NU Literates',
    date: '2024 — 2025',
    headline: 'Carrying the concerns upward.',
    blurb: 'Represented students bringing concerns to the organization, and carried them to the people who could actually resolve them.',
    photos: [
      { src: 'assets/events/nu-literates-grievances.svg', alt: 'NU Literates organization activity', caption: 'Representing students within NU Literates.' }
    ]
  },
  {
    slug: 'nu-literates-exec',
    sort: 2023.4,
    title: 'Office of the Executive Secretary',
    group: 'leadership',
    kind: 'COMMUNITY',
    role: 'Committee Member',
    organization: 'NU Literates',
    date: '2023 — 2024',
    headline: 'Where the paperwork lived.',
    blurb: 'Supported the executive secretary’s office with documentation and coordination across the organization’s activities.',
    photos: [
      { src: 'assets/events/nu-literates-exec.svg', alt: 'NU Literates committee activity', caption: 'Committee work across organization activities.' }
    ]
  }
];
