# Replacing the placeholders

The supplied portrait is saved as `portrait.png` and displayed in the hero and About
section. Project screenshots and event photos still use labeled placeholder SVGs.

## The two-minute version

1. Save your image over the placeholder, keeping the **same filename and extension**
   (e.g. export your photo as `portrait.svg`? No — see below).
2. If you save as `.jpg`, `.png`, or `.webp` instead, you also have to update the one
   reference to it. The tables say exactly where.
3. Run `npm run check` — it fails if a referenced file is missing.

Keeping the same name only works for SVG, so in practice you will save a real photo as
`.jpg` and update one line. Delete the leftover `.svg` afterwards.

## Your photos

| File | Shown where | Shape | Reference to update |
| --- | --- | --- | --- |
| `portrait.png` | Large hero portrait and About portrait | Original supplied photo, 960×952 | `dist/index.html`, `.hero-portrait` and `.about-portrait` images |
| `portrait.svg`, `portrait-alt.svg` | Unused legacy placeholders | Not displayed | Retained for reference |

## App screenshots — `shots/`

All screenshot paths live in **`dist/projects.js`**. Each project has a `cover`
(the image on its card) and a `shots` array (the images inside its case study).
Change the `src` values there and nothing else.

| Project | Cover | Case-study shots |
| --- | --- | --- |
| InaAgapay | `shots/inaagapay-cover.svg` | `inaagapay-1` (phone), `-2` (phone), `-3` (web) |
| Kaibigan | `shots/kaibigan-cover.svg` | `kaibigan-1`, `-2`, `-3` (all phone) |
| Gola | `shots/gola-cover.svg` | `gola-1` (phone), `-2` (phone), `-3` (web) |
| Webibo | `shots/webibo-cover.svg` | `webibo-1`, `-2`, `-3` (all web) |
| PeasyCheck | — | `peasycheck-1`, `-2` (web) |
| Woof n’ Go | — | `woof-1`, `-2` (phone) |
| Leah’s Salon | — | `salon-1`, `-2` (web) |

`kaibigan-1`, `inaagapay-1`, and `gola-1` also appear in the floating phone in the
hero, behind the Kaibigan / InaAgapay / Gola switcher — so those three are worth
replacing first.

**Sizes.** Phone shots are cropped to 9:19.5 (a normal phone screenshot, roughly
1170×2532). Web shots are cropped to 16:10 (roughly 1600×1000). Anything close works;
the frames crop to fill, from the centre.

**Adding a shot.** Add another object to a project's `shots` array in
`dist/projects.js`. Every entry needs `src`, `device` (`'phone'` or `'web'`), `alt`,
and `caption` — `npm run check` enforces that.

## Event photos — `events/`

Event records live in **`dist/events.js`**. Each event has a `photos` array, and the
gallery lightbox steps through every photo of every visible event.

| File | Event |
| --- | --- |
| `events/gem-in-ai.svg` | Gem in AI — Speaker |
| `events/ircite-2026.svg` | IRCITE 2026 — Research Presenter |
| `events/gdg-web-dev.svg` | GDG on Campus — Web Development Assistant Lead |
| `events/gdsc-operations.svg` | GDSC — Chief Operations Officer |
| `events/nu-literates-grievances.svg` | NU Literates — Student Grievances Officer |
| `events/nu-literates-exec.svg` | NU Literates — Executive Secretary Committee |

Photos are cropped to 3:2 landscape (1200×800 or larger).

**Adding more photos to an event.** Push another `{ src, alt, caption }` object onto
that event's `photos` array. The card shows the first photo and gains a “N photos”
badge; the lightbox walks through the rest.

**Adding a whole new event.** Copy an existing block in `dist/events.js` and set
`group` to `'speaking'` or `'leadership'` so it lands under the right filter. Nothing
in the HTML needs touching.

## Demo videos — `demos/`

Each project has a `links.demo` slot in **`dist/projects.js`**:

```js
demo: { src: '', poster: 'assets/demos/kaibigan-poster.svg' }
```

- Put an **`.mp4`, `.webm` or `.ogv`** in `assets/demos/` and set `src` to its path —
  the case study plays it inline, with the poster as the still frame.
- Set `src` to a **YouTube or Drive URL** instead and the poster becomes a click target
  that opens the video in a new tab. Nothing third-party loads until someone clicks.
- Leave `src` empty and the poster shows with a muted “add link” badge.

Posters are 16:9. Replace `demos/<project>-poster.svg` with a real still frame, or leave
it — it works as-is once a video is attached.

A screen recording of the app being used beats a polished trailer. 60–90 seconds, one
real task start to finish.

## Repo, APK, and live links

The same `links` object in `dist/projects.js` carries the rest:

| Key | What goes in it | Which projects have the slot |
| --- | --- | --- |
| `repo` | Public GitHub repository URL | all seven |
| `apk` | Google Drive share link to the installable `.apk` | InaAgapay, Kaibigan, Gola, Woof n’ Go |
| `live` | Deployed URL anyone can open | Gola, Webibo, Leah’s Salon |
| `demo` | See above | all seven |

Rules the checker enforces:

- `repo`, `apk`, and `live` must be absolute **`https://`** URLs. A typo fails
  `npm run check` rather than shipping a broken link.
- Any other scheme (`javascript:`, `data:`) is dropped at render time and never written
  into an `href`.

While a slot is empty the page shows a dashed “add link” chip — on the project card and
in the case study — so you can see what is still outstanding. `npm run check` prints the
same list. When you are ready to publish with slots still empty, set:

```js
export const showPendingLinks = false;
```

at the top of `dist/projects.js` and the chips disappear for visitors.

### Sharing an APK from Google Drive

Upload the `.apk`, then **Share → General access → Anyone with the link → Viewer**, and
copy that link. Anything narrower and visitors hit a permission wall. The case study
already tells people it is Android-only and that their device will warn about installing
from an unknown source, so you do not need to repeat that.

## Writing alt text

`alt` describes the image for screen readers and for anyone whose images fail to load.
Say what is in the frame, not that it is an image: “Errol presenting Webibo at IRCITE
2026”, not “photo of conference”. `caption` is the visible line underneath and can be
more conversational.
