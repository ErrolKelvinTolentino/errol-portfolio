# Errol Kelvin Tolentino — Interactive Résumé & Portfolio

## 1. Purpose and execution contract

Build an impressive, responsive web résumé that helps recruiters understand Errol's strengths, inspect his work, and contact him. The experience should have the care, confidence, and restraint of an Apple product page: excellent typography, deliberate spacing, subtle depth, purposeful animation, and immediate usability.

This document is written **before implementation** and is the source of truth for future execution, including by smaller AI models. Follow its phases in order. Preserve verified content; do not improvise accomplishments. Complete a phase's acceptance criteria before broadening the implementation. Update the progress record at the bottom as work finishes.

### The visitor's three questions

1. Who is Errol, and what does he build?
2. Can I see credible examples of his engineering and judgment?
3. How can I read his résumé or contact him?

### Definition of done

- A complete, polished website, not just a design or wireframe.
- All seven résumé projects, skills, education, research, speaking, and leadership represented accurately.
- Useful project interactions, working navigation, a readable/printable résumé, and working contact actions.
- Consistent layouts at 360, 390, 768, 1024, and 1440 CSS pixels; no unintended horizontal overflow.
- Keyboard operation, visible focus, accessible modal behavior, and reduced-motion support.
- No fabricated links, job history, metrics, screenshots, graduation dates, or claims.
- Source that is easy to understand, run, customize, and deploy without a complex dependency chain.
- A verified local preview; hosting attempted through the available Sites workflow, with any blocker reported honestly.

## 2. Content authority and factual boundaries

Source: the résumé supplied in this conversation, originally attached as `pasted-text.txt`.

- Name: **Errol Kelvin A. Tolentino**. Use **Errol Kelvin** as the compact wordmark and first-person voice for introductory prose.
- Positioning: **AI Engineering Intern / Software Engineering Intern**; a fourth-year BS Information Technology student specializing in Mobile and Web Development.
- Location: Philippines.
- Email: `errolkelvintolentino@gmail.com`.
- Phone: `0945 773 8468`; normalize the telephone link to `+639457738468`.
- GitHub: `https://github.com/ErrolKelvinTolentino`, constructed from the exact supplied account name. Project repository URLs are unknown; do not invent them.
- LinkedIn: profile URL unknown. Omit the link until supplied; the display name is insufficient to infer a URL.
- Expected graduation: unknown. Omit `[Month Year]` everywhere in the public site and résumé.
- Internship positioning does not prove current employment or immediate availability. Use "Open to internship opportunities" as the intent of this application-oriented résumé, without fabricated dates.
- No photo or authentic app screenshots were provided. Do not invent a portrait or pass a mockup off as a shipped screenshot.
- Since the CSS interface concepts were replaced with real image slots, every image on the site is a labelled placeholder file under `dist/assets/`. The placeholder art states what belongs there; the case-study dialog carries the note that screenshots are placeholders. Remove that note only once real captures are in place. `dist/assets/README.md` maps every slot to its file.
- Health and wellness project copy must describe assisted information/reflection features, not diagnosis, clinical validation, or treatment claims.
- Do not add years of experience, user counts, percentage improvements, client logos, testimonials, rankings, or deployment claims.

### Approved short introduction

"I'm Errol, a fourth-year IT student building thoughtful web, mobile, and AI-assisted applications. From maternal health to everyday wellness, I turn practical problems into approachable software."

### Project content map

| Project | Role | Focus | Verified technologies |
| --- | --- | --- | --- |
| InaAgapay | Full-Stack Developer | Maternal and child health information for barangay midwives and mothers; patient records, prenatal tracking, immunization scheduling, AI assistance and model fallbacks | Flutter, Supabase, Firebase, PostgreSQL, JavaScript, Groq API |
| Kaibigan | Solo Developer | Localized wellness companion; private journaling, mood tracking, breathing, grounding, routines; optional AI reflection via backend services | Flutter, Supabase, PostgreSQL, Google Gemini, Groq API, Edge Functions |
| Gola | Solo Developer | AI-assisted goal plans; tasks, progress, Pomodoro sessions, productivity analytics | Flutter, React.js, Firebase, Groq API |
| Webibo | Project Manager & UI/UX Designer | Gamified HTML/CSS/JavaScript learning; lessons, coding challenges, achievements and progression; research presented at IRCITE 2026 | HTML, CSS, JavaScript, MySQL |
| PeasyCheck | Project Manager & Full-Stack Developer | Desktop laboratory equipment status, defects, issue reporting and maintenance records | Java, MySQL |
| Woof n' Go | Developer (no stronger role claim) | Mobile pet-supply commerce; browsing, orders, purchase tracking, inventory, administration, sales records | Kotlin, Firebase |
| Leah's Salon | Solo Developer | Browser-based queues, services, appointments and sales administration | HTML, CSS, JavaScript, MySQL |

Use the first four as substantial project cards. Keep the other three in a compact but inspectable "More things I've built" area. Every card opens details with role, purpose, built features, engineering decisions grounded in the résumé, and technology labels. Do not show disabled "Live demo" or guessed repository links.

### Other required content

- **Education:** National University Baliwag; BS Information Technology, Mobile and Web Development; fourth-year student; DMMJ Blue full scholarship; consistent Dean's List awardee.
- **Speaking:** Gem in AI, GDG on Campus – National University Baliwag, March 2026; fundamental AI concepts, practical Google Gemini integration, responsible development.
- **Research:** IRCITE 2026; Webibo accepted and presented; system design, gamification and web-development learning.
- **Leadership:** GDG on Campus Web Development Assistant Lead (2025–2026); NU Literates Student Grievances Officer (2024–2025); NU Literates Office of the Executive Secretary Committee (2023–2024); GDSC Chief Operations Officer (2023–2024).
- **Skills:** preserve Python, Java, JavaScript, HTML, CSS, React.js, Flutter, Kotlin, Supabase, Firebase, PostgreSQL, MySQL, LLM API integration, prompt engineering, multi-model integration, AI-assisted development, speech-to-text, REST APIs, authentication, database design, CRUD workflows, Git and GitHub.
- **Certification:** Certiport IT Specialist – Cybersecurity.

## 3. Visual direction

### Thesis: A personal product studio

An exceptionally clear, quiet canvas paired with expressive typography and tangible app-interface previews. The person and their work are the product. Avoid cloning Apple's logo, page copy, proprietary assets, or exact page layouts.

### Design tokens

Initial palette, subject to the user's preference while planning:

| Token | Value | Usage |
| --- | --- | --- |
| `--canvas` | `#f7f8fa` | Main page background |
| `--surface` | `#ffffff` | Cards and dialogs |
| `--ink` | `#18191d` | Headings/body |
| `--muted` | `#666a73` | Supporting text |
| `--line` | `#e3e5e9` | Dividers/borders |
| `--accent` | `#3159df` | Primary actions, links, hero emphasis |
| `--accent-soft` | `#edf1ff` | Selected controls and small highlights |
| `--radius-card` | `28px` | Large surfaces |
| `--radius-control` | `12px` | Small controls |
| `--content-width` | `1160px` | Main desktop content |

- Font: system UI stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif), no blocking remote font fetch. Tight, tasteful headline tracking; normal body tracking.
- Hero headline: approximately 84–100px at large desktop, 64–76px tablet, 46–58px mobile, implemented with `clamp()`; 1.0–1.08 line height. Never squeeze letters together to force a fit.
- Section headings: 40–56px desktop, 32–40px mobile. Body: 16–18px, 1.6 line height. Regular controls: at least 14px. Secondary metadata: at least 12px.
- Content gutters: 24px on phones, 40px on tablets, 48–64px on desktop.
- Section spacing: 104–128px desktop, 64–80px mobile.
- Subtle shadows only on elevated app previews/dialogs; rely on whitespace and surface contrast elsewhere.
- Use thin-line icons sparingly. Inline SVG is permitted for functional icons and simple geometric brand marks, not elaborate illustrations.
- Project palette accents: lavender for InaAgapay, peach for Kaibigan, sky blue for Gola, neutral/indigo for Webibo. Keep readable ink text.
- No generic stock imagery, animated noise, particle backgrounds, fake terminal, typewriter intro, skill percentage bars, rotating buzzwords, mouse-following cursor, or autoplay media.

## 4. Page composition and responsive behavior

### A. Global navigation

- Top bar with a compact `ek.` brand, Errol Kelvin wordmark, Work / About / Experience links, and an outlined or dark "Let's talk" action.
- Sticky with subtle translucent backdrop and border after scrolling; no large layout jump.
- Active section styling follows the section in view; `aria-current` reflects state.
- Desktop full navigation; mobile retains brand/contact plus a real menu button for remaining links. Mobile menu must close on selection and Escape and reset when returning to desktop.
- Add a keyboard skip link to `main`.

### B. Hero

- Eyebrow: "BASED IN THE PHILIPPINES · OPEN TO INTERNSHIPS" or a compact equivalent.
- Memorable two-line headline: **"Thoughtful code. / Meaningful impact."** with one restrained blue emphasis.
- Concise introduction using the approved narrative.
- Primary action "Explore my work" scrolls to projects. Secondary "View résumé" opens the dedicated print-friendly résumé page.
- Small identity note: "AI engineering · Software development".
- A large, tangible app-preview composition with tabs for **Wellness / Goals / Care**. This is a genuine interface concept, not a static decorative screenshot.
- Default Wellness preview: friendly journal/mood surface, selectable mood buttons, an inline response that changes with the selected mood. No input is sent anywhere.
- Goals preview: a short goal with toggleable tasks and progress that updates.
- Care preview: readable workflow items with selectable detail, no diagnosis or invented patient records.
- All concepts labeled "Interactive concept" and "UI exploration · not a live product" once within the frame.
- Desktop split composition (text ~52%, preview ~48%), mobile vertical stack. Avoid tiny illegible scaled desktops on phones.
- Bottom of hero: subtle academic/technology strip grounded in the résumé, not a fabricated customer-logo wall.

### C. Selected work

- Eyebrow "SELECTED WORK", large heading "Built with purpose.", short explanatory line.
- Project category controls: All / Applied AI / Web & mobile. Filter in place and expose selected state with `aria-pressed`; avoid an artificial loading spinner.
- Two-column card grid at desktop/tablet; single column below 700px.
- Four substantial cards: InaAgapay, Kaibigan, Gola, Webibo. Each includes an intentional code-native interface vignette, project name, short use case, role, key technology labels, and a clear details affordance.
- Cards may elevate 4px on hover; no excessive tilt. The entire details button/card must have a meaningful accessible name.
- Filter results announce the number of projects. The other three projects remain reachable below as compact rows opening the same detail dialog.

### D. About and toolkit

- Asymmetric editorial layout: a strong statement about practical, human-focused engineering next to concise biographical copy.
- Education card with school, specialization, scholarship and Dean's List.
- Three or four clearly labeled skill groups. Show text labels, not logos alone or proficiency meters.
- Certification receives a quiet line rather than a visually inflated badge.

### E. Experience and contribution

- Clean editorial list/timeline; dates align consistently and wrap gracefully on small screens.
- Speaking and research are differentiated from employment; do not call them jobs.
- Include every verified leadership role, grouping the two NU Literates roles if useful for readability.
- Use a short phrase about each activity only when grounded in the source.

### F. Contact and footer

- Spacious final invitation: "Let's build something meaningful." with email as the primary contact.
- Functional email link, copy-email button with success/fallback feedback, verified-handle GitHub profile link, and phone link in appropriate secondary placement.
- Add LinkedIn only when its actual URL is supplied.
- No contact form/backend or promise of reply time.
- Footer: full name, Philippines, dynamic copyright year, back-to-top link.

### G. Project detail dialog

- Native `<dialog>` opened with `showModal()`, backdrop, visible close button, Escape support and restored focus. Avoid additional modal libraries.
- Max width approximately 760px; maximum height `90dvh`; scroll inside the dialog; mobile uses almost full width with safe gutters.
- Show project category, name, role, concise overview, "What I built" bullet list, "Engineering focus" paragraph, and stack chips.
- A visible source note clarifies interface vignettes are concepts where applicable.
- No guessed project links or invented challenges/results. Buttons must do something real.

### H. Dedicated résumé page

- `/resume.html`: readable semantic HTML, all source content reorganized professionally, no placeholders.
- Display "Print / Save PDF" button calling `window.print()` plus back-to-portfolio link.
- Print styles: white background, black text, sensible A4/Letter margins, hidden navigation/buttons, minimal awkward page breaks, no truncated content.
- Primary site action must say "View résumé", not falsely claim a pre-generated PDF download.

## 5. Interaction and animation specifications

| Interaction | Expected behavior | Accessibility / mobile |
| --- | --- | --- |
| Anchor navigation | Smooth scroll to offset sections | Native links; instant scroll for reduced motion |
| Initial entrance | Hero text and preview settle in with 12–20px translation and opacity over ~600ms | No blank screen while waiting; disabled for reduced motion |
| Section reveal | One-time 16px fade/translate over 500–650ms with small stagger | Content visible without JS; observer only enhances eligible elements |
| Preview tabs | Replace visible concept without layout shift | Buttons with tab semantics, arrow/Home/End keys and focus state |
| Mood selection | Selected state plus relevant reassuring, nonclinical text | Labeled buttons, `aria-pressed`, polite status text |
| Goal tasks | Checkbox changes completion and progress | Native checkboxes; progress value has text alternative |
| Project filters | Toggle visible cards without hiding the section heading | Selected state, status announcement, stable keyboard focus |
| Project detail | Open dialog, scroll content, close and restore trigger focus | Native dialog, focus visible, Escape/backdrop/close support |
| Copy email | Clipboard copy and brief "Copied" status | On denied/unavailable clipboard, show selectable email with clear fallback |
| Mobile navigation | Expand/collapse compact panel | `aria-expanded`, Escape close, links reachable by keyboard |

Use only CSS transitions/keyframes plus small native JavaScript. No heavy animation framework. Never override natural scrolling, make motion mandatory, or rely on hover to reveal essential information. Fine-pointer-only effects must not affect touch devices.

## 6. Technical architecture

The project currently contains only a README and Git metadata. Use a dependency-free static site to keep execution reproducible and understandable for less capable models.

```text
errol-portfolio/
  plan.md                 # This executable design and implementation brief
  README.md               # Run, customize, validate, publish instructions
  package.json            # Minimal dev/start/check scripts; no runtime packages
  server.mjs              # Small local static server, loopback-only
  scripts/check.mjs       # Focused static integrity checks
  dist/                   # Intentionally authored and tracked public source
    index.html            # Semantic complete portfolio content
    styles.css            # Tokens, components, breakpoints, animation
    app.js                # Preview, tabs, filters, dialogs, menu, contact
    projects.js           # Verified project data used by detail dialogs
    resume.html           # Full readable and print-ready résumé
    resume.css            # Screen/print résumé styling
    favicon.svg           # Simple custom ek monogram
  .openai/hosting.json     # Only if Site registration succeeds
```

- `dist/` is source for this buildless implementation; do not add it to `.gitignore` or overwrite it with a generator.
- Keep content readable in static HTML without JavaScript. Use JS for enhancement, not for an empty application shell.
- `projects.js` exports a small array of structured, factual records. All dialog content must be rendered safely with text nodes or trusted authored strings; no evaluation of user input.
- No authentication, database, API keys, analytics, cookies, tracking, third-party embeds, or network requests from concept interactions.
- Use local assets, a system font stack and no runtime CDN requirement.
- Metadata: specific document title, meaningful description, theme color, language, favicon; no invented canonical URL or social-preview artwork.
- Static server: explicit MIME types, safe path resolution inside `dist`, 404 for missing files, no directory listing, predictable loopback URL.
- Configure the Sites portable execution profile before setup/preview. Use the static-assets path. Register once if hosting is available; keep the Site private by default. Never expose hosting credentials.

## 7. Execution phases and acceptance gates

### Phase 0 — Plan first

1. Read the supplied résumé and repository instructions.
2. Write this file before writing or executing application code.
3. Resolve optional preferences if received; don't block on unprovided LinkedIn, photo or graduation date.

**Gate:** complete factual map, visual tokens, interactions, responsive rules, architecture, and acceptance criteria exist here.

### Phase 1 — Recognizable first preview

1. Configure the environment and static site directory.
2. Implement the global tokens, navigation, complete hero, custom favicon and representative project content.
3. Add the development server and serve the page.
4. Verify the exact local URL returns successfully, then open the visible preview.

**Gate:** the preview unmistakably belongs to Errol, communicates the design direction and contains no starter placeholders.

### Phase 2 — Complete content and interaction

1. Complete the four selected projects and three additional projects.
2. Add factual detail data and the accessible modal.
3. Add the about/toolkit, education, contributions and contact sections.
4. Implement preview tabs, mood selection, task progress, filters, responsive menu, current section and clipboard feedback.
5. Create the full résumé page and print styles.

**Gate:** every required content item is represented; every visible control performs its labeled action.

### Phase 3 — Responsive and motion polish

1. Apply the breakpoint rules and inspect actual browser rendering.
2. Add restrained entrance/reveal effects after basic readability works.
3. Test reduced motion, keyboard focus, dialog restoration and mobile navigation.
4. Eliminate clipped text, awkward card heights, off-screen controls and horizontal overflow.

**Gate:** the site remains understandable with motion disabled and works at narrow phone, tablet and desktop sizes.

### Phase 4 — Validate and deliver

1. Run syntax and static asset/link integrity checks.
2. Check tabs, mood, goal progress, filters, every project dialog, contact copy and résumé navigation.
3. Inspect desktop and mobile visually; examine print output for the résumé if the environment supports it.
4. Update README and this plan with actual results and remaining factual omissions.
5. Publish privately through Sites when available, or provide a working local preview and an explicit hosting blocker.
6. Report concise results with a link to this plan because the user explicitly requested it.

## 8. Verification checklist

- [ ] No fabricated claims or unresolved résumé placeholders.
- [ ] All seven projects open the correct detail content.
- [ ] Skill names, roles and dates match the source.
- [ ] 360 / 390 / 768 / 1024 / 1440 width layouts fit their viewports.
- [ ] Navigation, contact, GitHub and résumé links have valid destinations.
- [ ] Mobile menu works and closes correctly.
- [ ] Hero app switcher changes the phone screenshot and its alt text.
- [ ] Gallery filters and lightbox navigation stay in step with each other.
- [ ] Theme toggle persists and never leaves unreadable contrast.
- [ ] Filters select and announce the right projects.
- [ ] Dialog closes via button/Escape/backdrop and restores focus.
- [ ] Reduced motion stops entrance/reveal movement and smooth scrolling.
- [ ] Keyboard focus is visible; headings/landmarks form a sensible hierarchy.
- [ ] Body text and controls are readable at 200% zoom.
- [ ] Clipboard success and failure paths are truthful.
- [ ] Résumé prints with complete content and no UI chrome.
- [ ] No missing assets, console errors, unexpected network calls or broken local URLs.
- [ ] Local preview and any hosting result are reported accurately.

## 9. Handoff instructions for a future model

Read `plan.md`, then `README.md`, then the exact source file relevant to the requested change. Inspect current Git status before editing. Do not regenerate the entire site or switch frameworks. Preserve the system font, spacing scale, responsive behavior and factual constraints. Prefer a small coherent patch. Run `npm run check`, inspect the affected interaction in a browser, and update the progress record when scope changes. Do not add an AI chat feature, fabricated metrics, new project URLs or backend services without a user request.

When adding an authentic project screenshot later, replace only the corresponding concept vignette, preserve its aspect ratio, supply descriptive alt text, and remove the concept label only for that verified screenshot. When adding a real PDF later, preserve the accessible HTML résumé and label the PDF link accurately.

## 10. Progress record

- [x] Résumé and initial repository read.
- [x] Detailed plan written before implementation.
- [x] First recognizable preview.
- [x] Full implementation.
- [x] Responsive/accessibility/interaction verification.
- [x] README and final handoff.
- [ ] Hosting result recorded.

### Scope change — redesign pass

Requested by the user: stronger design and copy, placeholders for a portrait and app
screenshots, and a gallery of events participated in. What changed against the original plan:

- **Real image slots replace the CSS interface concepts.** Project cards and case studies now
  show screenshots inside phone and browser frames; the hero shows a portrait plus a floating
  phone that switches between Kaibigan, InaAgapay and Gola. All are placeholder files for now.
  The hero's mood/goal/care mini-demos were removed along with the concept vignettes.
- **New events gallery** (`#gallery`, section 04), rendered from `dist/events.js` with a
  filterable grid and a lightbox that steps through every photo of the visible events.
- **Proof strip** replaces the credential strip, carrying only counts that come straight from
  the résumé: seven projects, three with LLMs integrated, four leadership roles, one research
  paper presented. No invented metrics.
- **Light and dark themes**, driven by custom properties, following the OS by default with a
  header toggle that persists in `localStorage`.
- **Copy** moved from abstract to specific throughout — positioning, project one-liners, and
  section framing — while staying inside the factual boundaries in section 2.
- `scripts/check.mjs` now also verifies image alt text, every project and event media file on
  disk, and that gallery filters match real event groups.

### Scope change — links and interaction pass

- **Verifiable work.** Every project carries a `links` object (repo / apk / live / demo) with
  placeholder chips while empty, plus demo-video posters under `assets/demos/`. Filled links
  must be absolute https; other schemes are dropped at render time. `showPendingLinks` hides
  the outstanding chips before publishing.
- **Experience is now a timeline**, rendered from `events.js` in a full-bleed dark band, sorted
  by a new numeric `sort` field. This removed the duplication between Experience and Gallery —
  one record now feeds both, and each timeline entry deep-links into the gallery lightbox.
  The old two-column feature/leadership markup and its CSS are gone.
- **Command palette** (⌘K / Ctrl+K / “/”) over sections, projects, events and actions.
- **Scroll and motion**: reading-progress bar, hero parallax, count-up proof numbers, pointer
  spotlight on cards, technology marquee, and a View Transitions theme wipe. All batched into
  one rAF per scroll event and all disabled under reduced motion.
- Because the timeline is JS-rendered, `resume.html` remains the static, complete record of the
  same content — the noscript note points there.

### Scope change — functional portfolio and AI engineering pass (October 2026)

- Replaced prominent portrait/screenshot placeholders with an interactive architecture notebook, workflow illustrations, and editorial event covers. Original image slots remain available in clearly labeled, expandable case-study details and event lightboxes.
- Added the five repository URLs supplied by the user, including both Gola clients. Unfilled external links stay hidden.
- Added an inspectable portfolio explorer with local lexical retrieval, exact source excerpts, source navigation, a retrieval trace, and six runnable regression examples. It is explicitly labeled as local retrieval, not a model benchmark or an embeddings system.
- Added an optional server-only Groq endpoint with explicit visitor opt-in, bounded inputs, per-process rate limits, timeouts, response/source validation, and local fallback. Static hosting retains local mode. Real model generation requires backend deployment and configured credentials.
- Fixed Escape behavior for the mobile menu and focus restoration when a case study is opened from the notebook or explorer. All seven case studies, filters, command palette, and source navigation were verified in the browser.
- Verified no horizontal overflow at 360, 390, 768, 1024, and 1440 pixels. Checked mobile layout and dark theme visually. Integrity checks and five automated test groups pass; six public retrieval examples pass. Provider behavior was tested with mocks; no real model request was made.
- Added `AI_INTEGRATION.md` with a prioritized roadmap: hybrid RAG, provider reliability, requirement-to-evidence mapping, and a constrained planning demo.
- Hosting uses the existing Sites identity and access settings. Deployment results will be reported in the handoff.
