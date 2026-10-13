import { localAnswer, evaluateRetrieval, retrieve } from './knowledge.js';
import { openProject } from './app.js';

const form = document.getElementById('lab-form');
const input = document.getElementById('lab-query');
const result = document.getElementById('lab-result');
const submit = document.getElementById('lab-submit');
const status = document.getElementById('lab-status');
const modelToggle = document.getElementById('lab-use-model');
let controller;

function node(tag, text, className) {
  const item = document.createElement(tag);
  item.textContent = text;
  if (className) item.className = className;
  return item;
}

function render(response, query, elapsed) {
  result.replaceChildren();
  result.append(node('p', response.mode === 'model' ? 'MODEL ANSWER · GROQ' : 'PORTFOLIO EVIDENCE · LOCAL RETRIEVAL', 'lab-result-label'));
  result.append(node('p', response.answer, 'lab-answer'));
  const grid = node('div', '', 'lab-sources');
  response.sources.forEach(source => {
    const card = node('article', '', 'lab-source');
    const title = node('button', `${source.title} ↗`, 'lab-source-title');
    title.type = 'button';
    title.addEventListener('click', () => {
      if (source.kind === 'project') openProject(source.id, title);
      else document.querySelector(source.href)?.scrollIntoView({ behavior: 'auto' });
    });
    const relevant = (source.features || []).map(text => ({ text, rank: (source.matches || []).filter(term => text.toLowerCase().includes(term)).length })).filter(feature => feature.rank > 0).sort((a, b) => b.rank - a.rank);
    card.append(title, node('p', relevant[0]?.text || source.summary || source.text));
    if (source.stack) card.append(node('small', source.stack.join(' · ')));
    grid.append(card);
  });
  result.append(grid);
  const trace = document.getElementById('lab-trace');
  trace.replaceChildren();
  retrieve(query).forEach(source => trace.append(node('li', `${source.title} — score ${source.score}; matched: ${source.matches.join(', ')}`)));
  if (!trace.childElementCount) trace.append(node('li', 'No matching source. No invented answer.'));
  document.getElementById('lab-timing').textContent = `${Math.round(elapsed)} ms · ${response.sources.length} source${response.sources.length === 1 ? '' : 's'}`;
}

async function ask(query) {
  controller?.abort();
  controller = new AbortController();
  const active = controller;
  const started = performance.now();
  submit.disabled = true;
  submit.textContent = 'Finding evidence…';
  result.setAttribute('aria-busy', 'true');
  status.textContent = 'Retrieving portfolio sources…';
  let response = localAnswer(query);
  try {
    if (modelToggle.checked) {
      const remote = await fetch('/api/assistant', { method: 'POST',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }), signal: active.signal });
      if (!remote.ok) throw new Error('Model unavailable');
      response = await remote.json();
    }
    if (active !== controller) return;
    render(response, query, performance.now() - started);
    status.textContent = response.mode === 'model' ? 'Answer generated from portfolio sources. Check the evidence below.' : response.fallback ? 'The model is unavailable. Showing local evidence instead.' : modelToggle.checked ? 'No model answer was needed. Showing local evidence.' : 'Local retrieval complete. No question was sent to an AI provider.';
  } catch (error) {
    if (error.name === 'AbortError' || active !== controller) return;
    render(localAnswer(query), query, performance.now() - started);
    status.textContent = 'The model is unavailable. Showing local evidence instead.';
  } finally {
    if (active === controller) {
      submit.disabled = false;
      submit.textContent = 'Find evidence ↗';
      result.setAttribute('aria-busy', 'false');
    }
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) { input.focus(); return; }
  ask(query);
});
document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => {
  input.value = button.dataset.question;
  ask(input.value);
}));
document.getElementById('lab-evaluate').addEventListener('click', () => {
  const checks = evaluateRetrieval();
  const output = document.getElementById('lab-evaluations');
  output.replaceChildren(node('p', `${checks.filter(check => check.passed).length}/${checks.length} retrieval checks passed. Top result or no-match behavior only.`));
  checks.forEach(check => output.append(node('p', `${check.passed ? 'PASS' : 'FAIL'} · ${check.query} → ${check.actual || 'no match'}`, 'lab-eval-row')));
  output.hidden = false;
});

// Static hosts support the entire local experience without an API.
fetch('/api/assistant/status', { signal: AbortSignal.timeout(2500) })
  .then(response => response.ok ? response.json() : null)
  .then(config => {
    if (!config?.modelAvailable) return;
    document.getElementById('lab-model-option').hidden = false;
    document.getElementById('lab-mode').textContent = 'Local retrieval + optional Groq';
  }).catch(() => {});

const initialQuery = 'Which projects integrate LLMs with Groq and Gemini?';
input.value = initialQuery;
const initialStart = performance.now();
const initialResponse = localAnswer(initialQuery);
render(initialResponse, initialQuery, performance.now() - initialStart);
