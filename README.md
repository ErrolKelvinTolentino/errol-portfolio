# errol-portfolio

Personal portfolio and web résumé for **Errol Kelvin A. Tolentino** — full-stack
development, applied AI projects, research, and the events behind them.

Buildless: `dist/` is authored source, not compiled output. No bundler, no framework,
no dependencies.

## Run it

```bash
npm run dev
```

Serves `dist/` at <http://127.0.0.1:4173>.

```bash
npm run check
```

Verifies both pages: language attribute, a single `<h1>`, unique IDs, every local link
and asset resolving, alt text on every image, every project and event having its media
on disk, ARIA targets existing, and JavaScript parsing. It also checks that any filled
repo/APK/live link is an absolute `https://` URL, and lists the link slots still empty.

## Layout

| Path | What it is |
| --- | --- |
| `dist/index.html` | The portfolio page — hero, work, about, experience, gallery, contact |
| `dist/resume.html` | Standalone accessible résumé, print-styled for Save as PDF |
| `dist/styles.css` | Single stylesheet, light and dark themes driven by custom properties |
| `dist/app.js` | Architecture notebook, command palette, theme toggle, timeline, filters, dialogs, gallery, lightbox |
| `dist/knowledge.js`, `dist/lab.js` | Shared retrieval records, retrieval checks, and portfolio explorer UI |
| `assistant.mjs`, `server.mjs` | Optional server-only Groq generation and local HTTP server |
| `dist/projects.js` | Project records, including every screenshot path |
| `dist/events.js` | Event records — feeds both the Experience timeline and the gallery |
| `dist/assets/` | Images — **see `dist/assets/README.md` for how to replace the placeholders** |
| `scripts/check.mjs` | The verification above |
| `plan.md` | Design direction and the factual boundaries the content must respect |

## Editing content

Almost everything is data:

- **A project** — edit `dist/projects.js`. The card markup lives in `index.html`; the
  case-study dialog is generated from the record.
- **An event** — add an object to `dist/events.js`. The timeline, gallery, lightbox, and
  command palette all pick it up with no HTML change. Set `sort` (higher is more recent)
  to place it on the timeline and `group` to file it under a gallery filter.
- **A photo or screenshot** — drop the file into `dist/assets/` and point the record at
  it. `dist/assets/README.md` maps every slot to its file and shape.
- **A repo, APK, live site, or demo video** — fill the `links` object on that project in
  `dist/projects.js`. Empty slots are hidden from visitors; `npm run check` prints everything
  still outstanding. `showPendingLinks` can be enabled temporarily during content editing.
  Gola includes separate `repo` and `webRepo` links for its mobile and React clients.

## Interaction

- **Command palette** — `⌘K` / `Ctrl+K`, or `/`, or the Search button. Fuzzy-matches
  every section, project, event, and action; `↑`/`↓` to move, `↵` to run, `esc` to close.
  Built on the combobox/listbox pattern with `aria-activedescendant`.
- **Experience timeline** — section 03 is a full-bleed dark band whose rail fills as you
  scroll. Each entry links into the gallery lightbox for that event.
- **Architecture notebook** — switch between Kaibigan, InaAgapay, and Gola and open their case studies. Workflow illustrations replace prominent placeholder media. Screenshot slots remain under expandable details until authentic captures are available.
- **Portfolio explorer** — ask about project evidence, inspect lexical retrieval scores, open cited sources, and run six regression examples. Local mode makes no model requests and stores no questions.
- **Scroll-driven touches** — reading-progress bar in the header, proof
  numbers counting up on first view, pointer spotlight on cards. All of it runs in one
  `requestAnimationFrame` batch off a single passive scroll listener.
- **Theme wipe** — the toggle uses the View Transitions API to grow the new theme out of
  the button as a circle. Browsers without it get an instant swap.

Everything above is off under `prefers-reduced-motion: reduce`, and the marquee, spotlight
and parallax are skipped entirely rather than just shortened.

## Theme

Light and dark both ship. The page follows the operating system by default; the toggle
in the header overrides that and remembers the choice in `localStorage`. Colours are
custom properties defined once in `:root` and redefined for dark — there are no
hard-coded colours further down the stylesheet.

## Deploying

`.openai/hosting.json` publishes `dist/` as a static directory. Any static host works;
there is nothing to build.

## Optional AI generation

Copy `.env.example` to `.env`, then fill `GROQ_API_KEY` and an active `GROQ_MODEL` that
supports JSON Object Mode. Use the official [model list](https://console.groq.com/docs/models).
Keep the file local; it is ignored by Git.

```bash
node --env-file=.env server.mjs
```

When configured, the explorer offers an explicit Groq checkbox. Only then is the question
and retrieved public portfolio context sent to Groq. The backend validates answer shape
and source IDs and falls back to local evidence on provider errors. It uses a 12-second
timeout and a 10-requests/minute per-IP limit. Questions are not logged or persisted by this app.

Static deployment includes the complete local explorer but cannot run the Node API.
Deploy `server.mjs` on a Node-capable host or port the endpoint to a serverless function
to enable hosted generation. The current limiter is per-process; public multi-instance
deployment needs a shared limiter, appropriate proxy handling, and provider spend limits.

```bash
npm test
```

Tests cover retrieval, unsupported questions, model-response validation, provider failure,
and HTTP validation/rate limits using mocked provider responses. A real Groq call has not
been verified without a configured key.

See [AI_INTEGRATION.md](AI_INTEGRATION.md) for four practical AI features and the recommended sequence.
