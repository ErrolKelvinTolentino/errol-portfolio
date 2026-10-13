import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { answerQuestion } from './assistant.mjs';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm' };

function json(response, status, value, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
  response.end(JSON.stringify(value));
}
async function readJson(request) {
  const raw = await new Promise((done, fail) => {
    let size = 0;
    const chunks = [];
    request.on('data', chunk => { size += chunk.length; if (size <= 8192) chunks.push(chunk); });
    request.on('end', () => size > 8192 ? fail(Object.assign(new Error('Request too large'), { status: 413 })) : done(Buffer.concat(chunks).toString('utf8')));
    request.on('error', fail);
  });
  try { return JSON.parse(raw); } catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }); }
}

export function createPortfolioServer(config = {}) {
  const apiKey = config.apiKey ?? process.env.GROQ_API_KEY;
  const model = config.model ?? process.env.GROQ_MODEL;
  const attempts = new Map();
  const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.startsWith('/api/')) {
      if (pathname === '/api/assistant/status' && request.method === 'GET') return json(response, 200, { modelAvailable: Boolean(apiKey && model) });
      if (pathname !== '/api/assistant') return json(response, 404, { error: 'Not found' });
      if (request.method !== 'POST') return json(response, 405, { error: 'Use POST' }, { Allow: 'POST' });
      if (request.headers.origin && request.headers.origin !== `http://${request.headers.host}` && request.headers.origin !== `https://${request.headers.host}`) return json(response, 403, { error: 'Cross-origin request denied' });
      if (!request.headers['content-type']?.startsWith('application/json')) return json(response, 415, { error: 'Use application/json' });
      const now = Date.now();
      for (const [key, entry] of attempts) if (now - entry.started >= 60000) attempts.delete(key);
      const ip = request.socket.remoteAddress;
      const entry = attempts.get(ip) || { started: now, count: 0 };
      attempts.set(ip, entry);
      if (++entry.count > 10) return json(response, 429, { error: 'Please wait before asking again' }, { 'Retry-After': '60' });
      const body = await readJson(request);
      if (typeof body?.query !== 'string' || !body.query.trim() || body.query.length > 1500) return json(response, 400, { error: 'Enter a question between 1 and 1500 characters' });
      const answer = await answerQuestion(body.query.trim(), { apiKey, model, fetchImpl: config.fetchImpl, timeoutMs: config.timeoutMs });
      return json(response, 200, answer);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') { response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed'); return; }
    const target = resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!target.startsWith(root.endsWith(sep) ? root : root + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    if (request.url?.startsWith('/api/')) return json(response, error.status || 400, { error: error.status === 413 ? 'Request too large' : 'Invalid request' });
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  createPortfolioServer().listen(port, '127.0.0.1', () => console.log(`Portfolio ready at http://127.0.0.1:${port}`));
}
