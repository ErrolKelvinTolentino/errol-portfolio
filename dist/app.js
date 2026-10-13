import { projects, showPendingLinks } from './projects.js';
import { events } from './events.js';

const root = document.documentElement;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

/* ---------- Header ---------- */
const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

/* ---------- Theme ---------- */
const themeToggle = document.getElementById('theme-toggle');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);
function syncThemeLabel() {
  themeToggle.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
}
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

themeToggle.addEventListener('click', event => {
  const next = isDark() ? 'light' : 'dark';
  const apply = () => {
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable; the choice just will not persist */ }
    syncThemeLabel();
  };

  // Wipe the new theme in as a circle growing from the button. Browsers without
  // View Transitions (and anyone who asked for less motion) just get the swap.
  if (!document.startViewTransition || reduceMotion.matches) return apply();
  const box = themeToggle.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 460, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
    );
  }).catch(() => { /* a transition can be skipped; the theme still applied */ });
});
systemDark.addEventListener('change', syncThemeLabel);
syncThemeLabel();

/* ---------- Hero app switcher ---------- */
const appButtons = [...document.querySelectorAll('[data-app]')];
const notebook = {
  kaibigan: { domain: '01 / EVERYDAY WELLNESS', title: 'Private reflection. Thoughtful assistance.', description: 'Optional journal reflection with backend AI processing, Filipino / English localization, and provider fallback.', flow: ['Flutter client', 'Supabase Edge Functions', 'Gemini ↔ Groq fallback'], stack: 'Flutter · PostgreSQL · Supabase' },
  inaagapay: { domain: '02 / HEALTH INFORMATION', title: 'Care workflows. Connected records.', description: 'Patient records, prenatal tracking, and immunization scheduling across web and mobile, with AI-assisted information features.', flow: ['Web + mobile clients', 'Patient records & care workflows', 'Groq API + fallback models'], stack: 'Flutter · Supabase · Firebase · PostgreSQL' },
  gola: { domain: '03 / PRODUCTIVITY', title: 'A goal. A plan. A next step.', description: 'AI-assisted action plans meet task organization, progress visualization, and Pomodoro focus sessions.', flow: ['Flutter + React clients', 'Firebase application data', 'Groq-powered planning'], stack: 'Flutter · React.js · Firebase · Groq' }
};
let activeHero = 'kaibigan';
appButtons.forEach(button => button.addEventListener('click', () => {
  const note = notebook[button.dataset.app];
  if (!note) return;
  activeHero = button.dataset.app;
  appButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const flow = element('div', '', 'system-flow');
  flow.setAttribute('aria-label', `${projects[activeHero].name} architecture`);
  note.flow.forEach((step, index) => {
    if (index) flow.append(element('b', '↓'));
    flow.append(element('span', step));
  });
  document.getElementById('hero-note').replaceChildren(element('p', note.domain, 'notebook-domain'), element('h2', note.title), element('p', note.description, 'notebook-description'), flow, element('p', note.stack, 'notebook-stack'));
  document.getElementById('hero-case').textContent = `Read the ${projects[activeHero].name} case study ↗`;
}));
document.getElementById('hero-case').addEventListener('click', event => openProject(activeHero, event.currentTarget));

/* ---------- Mobile navigation ---------- */
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-nav');
function closeMenu() {
  mobileMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = mobileMenu.hidden;
  mobileMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuButton.focus(); } });
window.matchMedia('(min-width:641px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

/* ---------- Project filters ---------- */
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const cards = [...document.querySelectorAll('.project-card')];
  cards.forEach(card => { card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter); });
  const shown = cards.filter(card => !card.hidden).length;
  document.getElementById('work-count').textContent = `${String(shown).padStart(2, '0')} selected project${shown === 1 ? '' : 's'}`;
}));

/* ---------- Device frames ---------- */
function deviceFrame(shot, label) {
  const device = element('div', '', `device device-${shot.device === 'phone' ? 'phone' : 'web'}`);
  if (shot.device === 'phone') {
    const notch = element('span', '', 'device-notch');
    notch.setAttribute('aria-hidden', 'true');
    device.append(notch);
  } else {
    const bar = element('span', '', 'device-bar');
    bar.setAttribute('aria-hidden', 'true');
    bar.append(element('i'), element('i'), element('i'), element('em', label));
    device.append(bar);
  }
  const screen = element('div', '', 'device-screen');
  const image = element('img');
  image.src = shot.src;
  image.alt = shot.alt;
  image.loading = 'lazy';
  image.className = 'is-placeholder';
  screen.append(image);
  device.append(screen);
  return device;
}

/* ---------- Project links: repo, APK, live site, demo ---------- */
const linkKinds = {
  repo: { symbol: '</>', label: 'Code', long: 'View the code', note: 'GitHub' },
  webRepo: { symbol: '</>', label: 'Web code', long: 'View the web client code', note: 'GitHub · React' },
  apk: { symbol: '↓', label: 'APK', long: 'Download the APK', note: 'Android' },
  live: { symbol: '↗', label: 'Live', long: 'Open the live site', note: 'In your browser' },
  demo: { symbol: '▶', label: 'Demo', long: 'Watch the demo', note: 'Video walkthrough' }
};

// Only http(s) destinations are rendered — a malformed or unexpected scheme is
// treated as "not filled in yet" rather than being written into an href.
function safeUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, window.location.href);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch { return ''; }
}

function linkChip(kind, href, { size = 'card' } = {}) {
  const meta = linkKinds[kind];
  const className = size === 'card' ? 'project-link' : 'dialog-link';
  const symbol = element('span', meta.symbol);
  symbol.setAttribute('aria-hidden', 'true');

  if (!href) {
    if (!showPendingLinks) return null;
    const pending = element('span', '', `${className} is-pending`);
    pending.append(symbol, element('span', size === 'card' ? `${meta.label} — add link` : `${meta.long} — add the link`));
    return pending;
  }

  const anchor = element('a', '', className);
  anchor.href = href;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  const text = element('span', size === 'card' ? meta.label : meta.long);
  if (size === 'dialog') text.append(element('small', meta.note));
  anchor.append(symbol, text, element('span', ' (opens a new tab)', 'sr-only'));
  return anchor;
}

document.querySelectorAll('[data-links]').forEach(row => {
  const links = projects[row.dataset.links]?.links;
  if (!links) return;
  ['repo', 'webRepo', 'apk', 'live', 'demo'].forEach(kind => {
    if (!(kind in links)) return;
    const href = safeUrl(kind === 'demo' ? links.demo?.src : links[kind]);
    const chip = linkChip(kind, href);
    if (chip) row.append(chip);
  });
  if (!row.childElementCount) row.hidden = true;
});

function demoBlock(project) {
  const demo = project.links?.demo;
  if (!demo) return null;
  const href = safeUrl(demo.src);
  const isFile = /\.(mp4|webm|ogv)(\?.*)?$/i.test(demo.src || '');

  if (isFile) {
    const frame = element('div', '', 'demo-frame');
    const video = document.createElement('video');
    video.src = demo.src;
    video.poster = demo.poster;
    video.controls = true;
    video.preload = 'none';
    video.setAttribute('playsinline', '');
    frame.append(video);
    return frame;
  }

  const frame = element(href ? 'a' : 'div', '', 'demo-frame');
  if (href) {
    frame.href = href;
    frame.target = '_blank';
    frame.rel = 'noopener noreferrer';
  } else if (!showPendingLinks) {
    return null;
  }
  const poster = element('img');
  poster.src = demo.poster;
  poster.alt = href ? `${project.name} demo video` : `${project.name} demo video placeholder`;
  poster.loading = 'lazy';
  frame.append(poster, element('span', href ? 'Watch the demo ↗' : 'Demo video — add link', 'demo-badge'));
  if (href) frame.append(element('span', ' (opens a new tab)', 'sr-only'));
  return frame;
}

/* ---------- Case study dialog ---------- */
const dialog = document.getElementById('project-dialog');
const dialogContent = document.getElementById('dialog-content');
let previousTrigger;

export function openProject(slug, trigger) {
  const project = projects[slug];
  if (!project) return;
  previousTrigger = trigger;
  dialogContent.replaceChildren();

  const title = element('h2', project.name);
  title.id = 'dialog-title';

  const shots = element('div', '', 'dialog-shots');
  project.shots.forEach(shot => {
    const figure = element('figure');
    figure.append(deviceFrame(shot, project.name.toLowerCase()), element('figcaption', shot.caption));
    shots.append(figure);
  });

  const list = element('ul');
  project.features.forEach(feature => list.append(element('li', feature)));

  const chips = element('div', '', 'dialog-stack');
  project.stack.forEach(technology => chips.append(element('span', technology)));

  // "Try it" block: demo, then the repo / APK / live links as full-size buttons.
  const tryIt = [];
  const demo = demoBlock(project);
  const linkRow = element('div', '', 'dialog-links');
  ['repo', 'webRepo', 'apk', 'live'].forEach(kind => {
    if (!(kind in (project.links || {}))) return;
    const chip = linkChip(kind, safeUrl(project.links[kind]), { size: 'dialog' });
    if (chip) linkRow.append(chip);
  });
  if (demo || linkRow.childElementCount) {
    tryIt.push(element('h3', 'Try it yourself'));
    if (demo) tryIt.push(demo);
    if (linkRow.childElementCount) tryIt.push(linkRow);
    if (safeUrl(project.links?.apk)) {
      tryIt.push(element('p', 'The APK installs on Android only, and your device will ask you to allow installs from an unknown source.', 'sideload-note'));
    }
  }

  dialogContent.append(
    element('p', project.category, 'eyebrow'),
    title,
    element('p', project.role, 'dialog-role'),
    element('p', project.summary, 'dialog-summary'),
    ...tryIt,
    element('h3', 'What I built'),
    list,
    element('h3', 'Engineering focus'),
    element('p', project.focus),
    element('h3', 'The toolkit'),
    chips
  );
  const media = element('details', '', 'case-media');
  media.append(element('summary', 'Screenshot slots · authentic captures to follow'), shots);
  dialogContent.append(media);

  openDialog(dialog);
}
document.querySelectorAll('[data-project]').forEach(trigger => trigger.addEventListener('click', () => openProject(trigger.dataset.project, trigger)));

/* ---------- Experience timeline (same records as the gallery) ---------- */
// Some events carry the same words in `role` and `title` ("Student Grievances
// Officer" both times). Compare word sets so those collapse to one line, while
// genuinely different pairs ("Speaker" / "Gem in AI") still show both.
const words = value => new Set(value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean));
function sameWords(event) {
  const a = words(event.role);
  const b = words(event.title);
  return [...a].every(word => b.has(word)) || [...b].every(word => a.has(word));
}
function roleLine(event) {
  if (!sameWords(event)) return `${event.role} · ${event.title}`;
  return event.title.length >= event.role.length ? event.title : event.role;
}

const timeline = document.getElementById('timeline');
const byRecency = [...events].sort((a, b) => b.sort - a.sort);
byRecency.forEach(event => {
  const item = element('li', '', 'timeline-item');
  item.dataset.event = event.slug;

  const marker = element('div', '', 'timeline-marker');
  marker.setAttribute('aria-hidden', 'true');
  marker.append(element('span', '', 'timeline-dot'));

  const card = element('div', '', 'timeline-card');
  card.append(
    element('p', event.kind, 'timeline-kind'),
    element('h3', event.headline || event.title),
    element('p', roleLine(event), 'timeline-role'),
    element('p', event.blurb, 'timeline-blurb'),
    element('span', event.organization, 'timeline-org')
  );

  const photos = element('button', '', 'timeline-photos');
  photos.type = 'button';
  photos.setAttribute('aria-label', `View photos from ${event.title}`);
  photos.append(element('span', 'Event details'), element('span', '↗'));
  photos.querySelector('span:last-child').setAttribute('aria-hidden', 'true');
  photos.addEventListener('click', () => {
    previousTrigger = photos;
    renderGallery('all');
    document.querySelectorAll('[data-event-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.eventFilter === 'all')));
    openLightbox(visiblePhotos.findIndex(entry => entry.event.slug === event.slug));
  });
  card.append(photos);

  item.append(element('p', event.date, 'timeline-when'), marker, card);
  timeline.append(item);
});

/* ---------- Events gallery ---------- */
const galleryGrid = document.getElementById('gallery-grid');
const galleryCount = document.getElementById('gallery-count');
let visiblePhotos = [];

function renderGallery(filter = 'all') {
  const shown = events.filter(event => filter === 'all' || event.group === filter);
  visiblePhotos = shown.flatMap(event => event.photos.map((photo, index) => ({ event, photo, index })));
  galleryGrid.replaceChildren();

  if (!shown.length) {
    galleryGrid.append(element('p', 'No events in this category yet.', 'gallery-empty'));
  }

  shown.forEach(event => {
    const card = element('article', '', 'gallery-card');
    const button = element('button', '', 'gallery-open');
    button.type = 'button';
    button.setAttribute('aria-label', `View photos from ${event.title}`);

    const photo = element('div', '', 'gallery-photo');
    photo.classList.add('event-cover');
    photo.append(element('span', event.kind, 'gallery-kind'), element('strong', event.group === 'speaking' ? '↗' : '✳', 'event-cover-symbol'), element('span', event.date, 'event-cover-date'));

    const body = element('div', '', 'gallery-body');
    body.append(element('h3', event.title), element('span', event.date, 'gallery-date'));
    if (!sameWords(event)) body.append(element('p', event.role, 'gallery-role'));
    body.append(element('p', event.organization, 'gallery-org'), element('p', event.blurb, 'gallery-blurb'));

    button.append(photo, body);
    button.addEventListener('click', () => {
      previousTrigger = button;
      openLightbox(visiblePhotos.findIndex(entry => entry.event === event));
    });
    card.append(button);
    galleryGrid.append(card);
  });

  galleryCount.textContent = `${String(shown.length).padStart(2, '0')} event${shown.length === 1 ? '' : 's'}`;
}

document.getElementById('gallery-total').textContent = String(events.length).padStart(2, '0');
renderGallery();

document.querySelectorAll('[data-event-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-event-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderGallery(button.dataset.eventFilter);
}));

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxKind = document.getElementById('lightbox-kind');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxMeta = document.getElementById('lightbox-meta');
const lightboxOrg = document.getElementById('lightbox-org');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxPosition = document.getElementById('lightbox-position');
let lightboxIndex = 0;

function showPhoto(index) {
  if (!visiblePhotos.length) return;
  lightboxIndex = (index + visiblePhotos.length) % visiblePhotos.length;
  const { event, photo } = visiblePhotos[lightboxIndex];
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxKind.textContent = event.kind;
  lightboxTitle.textContent = event.title;
  lightboxMeta.textContent = `${event.role} · ${event.date}`;
  lightboxOrg.textContent = event.organization;
  lightboxCaption.textContent = photo.caption;
  lightboxCaption.textContent += ' · Photo placeholder; authentic event photo to follow.';
  lightboxPosition.textContent = `${lightboxIndex + 1} / ${visiblePhotos.length}`;
}

function openLightbox(index) {
  showPhoto(index < 0 ? 0 : index);
  openDialog(lightbox);
}

document.getElementById('lightbox-prev').addEventListener('click', () => showPhoto(lightboxIndex - 1));
document.getElementById('lightbox-next').addEventListener('click', () => showPhoto(lightboxIndex + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(lightboxIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(lightboxIndex + 1); }
});

/* ---------- Shared dialog behaviour ---------- */
function openDialog(target) {
  target.showModal();
  target.scrollTop = 0;
  document.body.classList.add('modal-open');
}

const outside = (target, event) => {
  const rect = target.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
};

function afterClose() {
  if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
  previousTrigger?.focus({ preventScroll: true });
}

[dialog, lightbox].forEach(target => {
  let startedOutside = false;
  target.querySelector('.dialog-close').addEventListener('click', () => target.close());
  target.addEventListener('pointerdown', event => { startedOutside = outside(target, event); });
  target.addEventListener('click', event => {
    if (startedOutside && outside(target, event)) target.close();
    startedOutside = false;
  });
  // Watching the `open` attribute rather than the `close` event: some embedded
  // browsers never dispatch `close`, which would leave the page scroll-locked.
  new MutationObserver(() => { if (!target.open) afterClose(); })
    .observe(target, { attributes: true, attributeFilter: ['open'] });
});

/* ---------- Copy email ---------- */
let toastTimer;
function toast(message) {
  const target = document.getElementById('toast');
  target.textContent = message;
  target.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { target.hidden = true; }, 4500);
}
document.getElementById('copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('errolkelvintolentino@gmail.com');
    toast('Email address copied. Let’s connect!');
  } catch {
    const emailLink = document.querySelector('.contact-email');
    const range = document.createRange();
    range.selectNodeContents(emailLink);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    toast('Copy unavailable. The email is selected for you to copy.');
  }
});

document.getElementById('year').textContent = String(new Date().getFullYear());

/* ---------- Scroll-driven enhancements ---------- */
if ('IntersectionObserver' in window) {
  const links = [...document.querySelectorAll('.desktop-nav a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

  if (!reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: .07 });
    document.querySelectorAll('[data-reveal]').forEach(target => {
      // Only enhance content below the initial viewport; visible content never flashes out.
      if (target.getBoundingClientRect().top > window.innerHeight) {
        target.classList.add('reveal-ready');
        revealObserver.observe(target);
      }
    });
    reduceMotion.addEventListener('change', event => {
      if (event.matches) document.querySelectorAll('.reveal-ready').forEach(target => target.classList.add('revealed'));
    });
  }
}

/* ---------- Command palette (⌘K / Ctrl+K / “/”) ---------- */
const palette = document.getElementById('palette');
const paletteInput = document.getElementById('palette-input');
const paletteList = document.getElementById('palette-list');
const paletteEmpty = document.getElementById('palette-empty');
let paletteReturn = null;
let paletteMatches = [];
let paletteIndex = 0;

function goTo(hash) {
  document.querySelector(hash)?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
}

function openEventPhotos(slug) {
  renderGallery('all');
  document.querySelectorAll('[data-event-filter]').forEach(button =>
    button.setAttribute('aria-pressed', String(button.dataset.eventFilter === 'all')));
  openLightbox(visiblePhotos.findIndex(entry => entry.event.slug === slug));
}

const commands = [
  ...[['Work', '#work', 'Four selected projects'], ['AI lab', '#ai-lab', 'Ask questions and inspect project evidence'], ['About', '#about', 'Background and toolkit'],
      ['Experience', '#experience', 'Speaking, research, leadership'], ['Gallery', '#gallery', 'Event photos'],
      ['Contact', '#contact', 'Get in touch'], ['Top', '#home', 'Back to the start']]
    .map(([name, hash, hint]) => ({ name, hint, kind: 'SECTION', symbol: '§', run: () => goTo(hash) })),

  ...Object.entries(projects).map(([slug, project]) => ({
    name: project.name, hint: project.tagline, kind: 'PROJECT', symbol: '▤',
    run: () => document.querySelector(`[data-project="${slug}"]`)?.click()
  })),

  ...events.map(event => ({
    name: event.title, hint: `${event.role} · ${event.date}`, kind: 'EVENT', symbol: '✦',
    run: () => openEventPhotos(event.slug)
  })),

  { name: 'Toggle theme', hint: 'Switch between light and dark', kind: 'ACTION', symbol: '◐', run: () => themeToggle.click() },
  { name: 'Copy email address', hint: 'errolkelvintolentino@gmail.com', kind: 'ACTION', symbol: '✉', run: () => document.getElementById('copy-email').click() },
  { name: 'Résumé', hint: 'Open the full résumé', kind: 'ACTION', symbol: '↗', run: () => window.open('resume.html', '_blank', 'noopener') },
  { name: 'GitHub', hint: 'github.com/ErrolKelvinTolentino', kind: 'ACTION', symbol: '↗', run: () => window.open('https://github.com/ErrolKelvinTolentino', '_blank', 'noopener') }
];

// Substring matches rank above subsequence, so "ka" finds Kaibigan and "inag" finds InaAgapay.
function score(query, text) {
  if (!query) return 1;
  const needle = query.toLowerCase();
  const hay = text.toLowerCase();
  const at = hay.indexOf(needle);
  if (at === 0) return 1000;
  if (at > 0) return 800 - Math.min(at, 200);
  let cursor = 0;
  let gaps = 0;
  for (const character of hay) {
    if (character === needle[cursor]) { if (++cursor === needle.length) break; }
    else if (cursor > 0) gaps++;
  }
  return cursor === needle.length ? 400 - Math.min(gaps, 300) : 0;
}

function highlightOption(index) {
  paletteIndex = paletteMatches.length ? (index + paletteMatches.length) % paletteMatches.length : 0;
  [...paletteList.children].forEach((option, position) => {
    const selected = position === paletteIndex;
    option.setAttribute('aria-selected', String(selected));
    if (selected) {
      paletteInput.setAttribute('aria-activedescendant', option.id);
      option.scrollIntoView({ block: 'nearest' });
    }
  });
  if (!paletteMatches.length) paletteInput.removeAttribute('aria-activedescendant');
}

function renderPalette() {
  const query = paletteInput.value.trim();
  paletteMatches = commands
    .map(command => ({ command, rank: Math.max(score(query, command.name), score(query, command.hint) - 250) }))
    .filter(entry => entry.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 8)
    .map(entry => entry.command);

  paletteList.replaceChildren();
  paletteMatches.forEach((command, position) => {
    const option = element('li', '', 'palette-option');
    option.id = `palette-option-${position}`;
    option.setAttribute('role', 'option');
    const symbol = element('span', command.symbol, 'palette-symbol');
    symbol.setAttribute('aria-hidden', 'true');
    const text = element('span', '', 'palette-text');
    text.append(element('strong', command.name), element('small', command.hint));
    option.append(symbol, text, element('span', command.kind, 'palette-kind'));
    option.addEventListener('click', () => runPalette(position));
    option.addEventListener('pointermove', () => highlightOption(position));
    paletteList.append(option);
  });
  paletteEmpty.hidden = paletteMatches.length > 0;
  highlightOption(0);
}

function runPalette(index) {
  const command = paletteMatches[index];
  if (!command) return;
  palette.close();
  // Let the palette finish closing before a command that opens another dialog runs.
  requestAnimationFrame(() => command.run());
}

function openPalette() {
  if (palette.open) return;
  paletteReturn = document.activeElement;
  paletteInput.value = '';
  renderPalette();
  palette.showModal();
  document.body.classList.add('modal-open');
  paletteInput.focus();
}

document.getElementById('palette-trigger').addEventListener('click', openPalette);
paletteInput.addEventListener('input', renderPalette);
palette.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') { event.preventDefault(); highlightOption(paletteIndex + 1); }
  else if (event.key === 'ArrowUp') { event.preventDefault(); highlightOption(paletteIndex - 1); }
  else if (event.key === 'Enter') { event.preventDefault(); runPalette(paletteIndex); }
});
new MutationObserver(() => {
  if (palette.open) return;
  if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
  paletteReturn?.focus({ preventScroll: true });
}).observe(palette, { attributes: true, attributeFilter: ['open'] });

document.addEventListener('keydown', event => {
  const typing = /^(INPUT|TEXTAREA)$/.test(event.target.tagName) || event.target.isContentEditable;
  if ((event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (palette.open) palette.close(); else openPalette();
  } else if (event.key === '/' && !typing && !document.querySelector('dialog[open]')) {
    event.preventDefault();
    openPalette();
  }
});

/* ---------- Scroll-driven effects, batched into a single frame ---------- */
const progressBar = document.getElementById('scroll-progress-bar');
const timelineFill = document.getElementById('timeline-fill');
const timelineBox = document.getElementById('timeline');
const timelineItems = [...document.querySelectorAll('.timeline-item')];
const parallax = reduceMotion.matches ? [] : [
  [document.querySelector('.portrait-frame'), -0.035],
  [document.querySelector('.hero-device'), 0.07],
  [document.querySelector('.credential-chip'), 0.05],
  [document.querySelector('.orbit-one'), -0.06],
  [document.querySelector('.orbit-two'), 0.045]
].filter(entry => entry[0]);

let frameQueued = false;
function onScrollFrame() {
  frameQueued = false;
  const scrolled = window.scrollY;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? Math.min(100, (scrolled / scrollable) * 100) : 0}%`;

  if (scrolled < window.innerHeight * 1.2) {
    for (const [node, rate] of parallax) node.style.translate = `0 ${(scrolled * rate).toFixed(1)}px`;
  }

  if (timelineItems.length) {
    const box = timelineBox.getBoundingClientRect();
    const line = window.innerHeight * 0.58;
    timelineFill.style.height = `${Math.max(0, Math.min(1, (line - box.top) / box.height)) * 100}%`;
    for (const item of timelineItems) {
      item.classList.toggle('is-lit', item.getBoundingClientRect().top + 34 < line);
    }
  }
}
function queueScrollFrame() {
  if (frameQueued) return;
  frameQueued = true;
  requestAnimationFrame(onScrollFrame);
}
window.addEventListener('scroll', queueScrollFrame, { passive: true });
window.addEventListener('resize', queueScrollFrame, { passive: true });
onScrollFrame();

/* ---------- Proof numbers count up the first time they are seen ---------- */
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const counters = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counters.unobserve(entry.target);
      const node = entry.target;
      const target = Number(node.textContent);
      const width = node.textContent.length;
      const started = performance.now();
      const tick = now => {
        const progress = Math.min(1, (now - started) / 900);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = String(Math.round(target * eased)).padStart(width, '0');
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.proof-grid dd').forEach(node => counters.observe(node));
}

/* ---------- Pointer spotlight on cards ---------- */
if (!reduceMotion.matches && window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('pointermove', event => {
    const card = event.target.closest?.('.project-card, .gallery-card');
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - box.left}px`);
    card.style.setProperty('--my', `${event.clientY - box.top}px`);
    card.classList.add('is-hot');
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    const card = event.target.closest?.('.project-card, .gallery-card');
    if (card && !card.contains(event.relatedTarget)) card.classList.remove('is-hot');
  }, { passive: true });
}

/* ---------- Technology marquee, built from the project stacks ---------- */
const marqueeTrack = document.getElementById('marquee-track');
const technologies = [...new Set(Object.values(projects).flatMap(project => project.stack))];
// Two identical passes, so translating the track by -50% loops seamlessly.
for (let pass = 0; pass < 2; pass++) {
  technologies.forEach(name => {
    marqueeTrack.append(element('span', name), element('span', '◆', 'is-dot'));
  });
}
