import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { evaluateRetrieval, localAnswer, retrieve } from '../dist/knowledge.js';
import { answerQuestion, validateModelAnswer } from '../assistant.mjs';
import { createPortfolioServer } from '../server.mjs';

test('retrieval regression cases: known work and unsupported details', () => {
  for (const check of evaluateRetrieval()) assert.equal(check.actual, check.expected, check.query);
  assert.deepEqual(localAnswer('salary expectations').sources, []);
  assert.equal(retrieve('Kaibigan')[0].id, 'kaibigan');
});

test('model response must cite only retrieved sources', () => {
  const sources = retrieve('Kaibigan Gemini');
  assert.throws(() => validateModelAnswer({ answer: 'Invented source', sourceIds: ['fake'] }, sources));
  assert.throws(() => validateModelAnswer({ answer: 'No sources', sourceIds: [] }, sources));
  assert.throws(() => validateModelAnswer({ answer: '', sourceIds: ['kaibigan'] }, sources));
  const result = validateModelAnswer({ answer: 'Kaibigan uses Gemini.', sourceIds: ['kaibigan'] }, sources);
  assert.equal(result.mode, 'model');
  assert.deepEqual(result.sources.map(source => source.id), ['kaibigan']);
});

test('optional provider uses backend credentials and validated JSON', async () => {
  const response = await answerQuestion('Kaibigan Gemini', { apiKey: 'test-key', model: 'test-model', fetchImpl: async (url, options) => {
    assert.equal(url, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer test-key');
    const request = JSON.parse(options.body);
    assert.equal(request.model, 'test-model');
    assert.equal(request.response_format.type, 'json_object');
    assert.equal(JSON.parse(request.messages[1].content).sources[0].id, 'kaibigan');
    return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({ answer: 'Kaibigan integrates Gemini for reflection.', sourceIds: ['kaibigan'] }) } }] }) };
  } });
  assert.equal(response.mode, 'model');
});

test('provider error and malformed citations fall back to local evidence', async () => {
  for (const fetchImpl of [async () => { throw new Error('offline'); }, async () => ({ ok: false }), async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: '{"answer":"x","sourceIds":["fake"]}' } }] }) })]) {
    const result = await answerQuestion('Kaibigan', { apiKey: 'test', model: 'test', fetchImpl });
    assert.equal(result.mode, 'local');
    assert.equal(result.fallback, true);
    assert.equal(result.sources[0].id, 'kaibigan');
  }
  let called = false;
  await answerQuestion('salary expectations', { apiKey: 'test', model: 'test', fetchImpl: async () => { called = true; } });
  assert.equal(called, false, 'unsupported queries never call the provider');
});

test('HTTP routes enforce methods, sizes, origin, validation, and rate limits', async t => {
  const server = createPortfolioServer({ apiKey: '', model: '' });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => { server.closeAllConnections(); server.close(); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const send = (body, headers = {}) => fetch(`${base}/api/assistant`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  assert.equal((await fetch(base)).status, 200);
  assert.equal((await fetch(`${base}/resume.html`)).status, 200);
  assert.equal((await fetch(`${base}/knowledge.js`)).status, 200);
  assert.equal((await fetch(`${base}/assistant.mjs`)).status, 404, 'server files are not public');
  assert.deepEqual(await (await fetch(`${base}/api/assistant/status`)).json(), { modelAvailable: false });
  assert.equal((await fetch(`${base}/api/assistant`)).status, 405);
  assert.equal((await send({ query: 'Kaibigan' }, { Origin: 'https://example.com' })).status, 403);
  assert.equal((await send({ query: '' })).status, 400);
  assert.equal((await send({ query: 'x'.repeat(1501) })).status, 400);
  assert.equal((await send({ query: 'x'.repeat(9000) })).status, 413);
  const result = await (await send({ query: 'Kaibigan privacy' })).json();
  assert.equal(result.sources[0].id, 'kaibigan');
  assert.equal(result.mode, 'local');
  for (let i = 0; i < 6; i++) assert.equal((await send({ query: 'Gola' })).status, 200);
  assert.equal((await send({ query: 'Gola' })).status, 429);
});
