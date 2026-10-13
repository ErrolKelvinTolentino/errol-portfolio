import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects, showPendingLinks } from '../dist/projects.js';
import { events } from '../dist/events.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicRoot = resolve(root, 'dist');
const pages = ['index.html', 'resume.html'];

for (const page of pages) {
  const html = await readFile(resolve(publicRoot, page), 'utf8');
  assert.match(html, /<html lang="en">/, `${page}: language`);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${page}: one primary heading`);
  assert.doesNotMatch(html, /\[Month Year\]|Lorem ipsum|TODO|remaining-sections/, `${page}: no unfinished content`);

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${page}: unique IDs`);

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(target)) continue;
    if (target.startsWith('#')) assert.ok(ids.includes(target.slice(1)), `${page}: missing ${target}`);
    else await access(resolve(dirname(resolve(publicRoot, page)), target.split('#')[0]));
  }

  for (const match of html.matchAll(/aria-controls="([^"]+)"/g)) {
    assert.ok(ids.includes(match[1]), `${page}: missing controlled element ${match[1]}`);
  }
  for (const match of html.matchAll(/<img\b([^>]*)>/g)) {
    assert.match(match[1], /\salt="/, `${page}: every image needs alt text — ${match[0].slice(0, 80)}`);
  }

  if (page === 'index.html') {
    const triggers = [...html.matchAll(/data-project="([^"]+)"/g)].map(match => match[1]);
    assert.equal(triggers.length, Object.keys(projects).length, 'Every project has a trigger');
    assert.deepEqual(triggers.sort(), Object.keys(projects).sort(), 'Every project trigger has detail content');

    for (const match of html.matchAll(/data-app="([^"]+)"/g)) {
      const shot = projects[match[1]]?.shots?.[0];
      assert.ok(shot, `Hero switcher references unknown project ${match[1]}`);
      assert.equal(shot.device, 'phone', `Hero switcher needs a phone-shaped first shot for ${match[1]}`);
    }

    const filters = [...html.matchAll(/data-event-filter="([^"]+)"/g)].map(match => match[1]);
    for (const filter of filters.filter(value => value !== 'all')) {
      assert.ok(events.some(event => event.group === filter), `Gallery filter "${filter}" matches no event`);
    }
  }
}

// Media referenced from the data modules has to exist on disk too.
for (const [slug, project] of Object.entries(projects)) {
  assert.ok(project.shots?.length, `${slug}: needs at least one screenshot slot`);
  for (const shot of project.shots) {
    assert.ok(shot.alt && shot.caption, `${slug}: every screenshot needs alt text and a caption`);
    assert.ok(['phone', 'web'].includes(shot.device), `${slug}: unknown device "${shot.device}"`);
    await access(resolve(publicRoot, shot.src));
  }
  if (project.cover) await access(resolve(publicRoot, project.cover));
}

// Link slots: a filled slot must be a real http(s) destination or a local file that exists.
const pending = [];
for (const [slug, project] of Object.entries(projects)) {
  const links = project.links || {};
  for (const [kind, value] of Object.entries(links)) {
    if (kind === 'demo') {
      assert.ok(value.poster, `${slug}: the demo slot needs a poster image`);
      await access(resolve(publicRoot, value.poster));
      if (!value.src) { pending.push(`${slug}.demo`); continue; }
      if (/^https?:/.test(value.src)) continue;
      assert.match(value.src, /\.(mp4|webm|ogv)$/i, `${slug}: a local demo must be .mp4, .webm or .ogv`);
      await access(resolve(publicRoot, value.src));
      continue;
    }
    if (!value) { pending.push(`${slug}.${kind}`); continue; }
    assert.match(value, /^https:\/\//, `${slug}.${kind}: links must be absolute https URLs`);
  }
}
if (pending.length) {
  console.log(`Pending links (${pending.length}): ${pending.join(', ')}`);
  console.log(showPendingLinks
    ? '  These render as muted "add link" chips. Set showPendingLinks to false in dist/projects.js to hide them from visitors.'
    : '  showPendingLinks is false, so these are hidden from visitors.');
}

const slugs = events.map(event => event.slug);
assert.equal(slugs.length, new Set(slugs).size, 'Event slugs are unique');
for (const event of events) {
  assert.ok(event.photos?.length, `${event.slug}: needs at least one photo slot`);
  assert.ok(event.title && event.role && event.date && event.organization, `${event.slug}: incomplete event record`);
  assert.equal(typeof event.sort, 'number', `${event.slug}: needs a numeric \`sort\` so the timeline can place it`);
  assert.ok(['speaking', 'leadership'].includes(event.group), `${event.slug}: group must be "speaking" or "leadership"`);
  for (const photo of event.photos) {
    assert.ok(photo.alt && photo.caption, `${event.slug}: every photo needs alt text and a caption`);
    await access(resolve(publicRoot, photo.src));
  }
}

for (const name of [...await readdir(publicRoot)].filter(name => name.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', resolve(publicRoot, name)], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
}
assert.equal(spawnSync(process.execPath, ['--check', resolve(root, 'server.mjs')]).status, 0);

console.log('Passed: HTML entrypoints, local links/assets, unique IDs, image alt text, project and event coverage, media files, ARIA targets, and JavaScript syntax.');
