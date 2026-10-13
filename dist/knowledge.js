import { projects } from './projects.js';
import { events } from './events.js';

// One authored source of truth feeds browser retrieval and the optional server.
export const documents = [
  { id: 'profile', title: 'Background & education', href: '#about', kind: 'profile',
    text: 'Errol Kelvin A. Tolentino is a fourth-year BS Information Technology student at National University Baliwag, specializing in Mobile and Web Development. Based in the Philippines. Open to AI and software engineering internships. DMMJ Blue full scholarship grantee and consistent Dean’s List awardee. Certiport IT Specialist – Cybersecurity.' },
  ...Object.entries(projects).map(([id, project]) => ({
    id, title: project.name, href: '#work', kind: 'project',
    text: `${project.summary} Role: ${project.role}. ${project.features.join(' ')} Engineering focus: ${project.focus} Stack: ${project.stack.join(', ')}.`,
    stack: project.stack, summary: project.summary, features: project.features
  })),
  ...events.map(event => ({ id: event.slug, title: event.title, href: '#experience', kind: 'event',
    text: `${event.role}. ${event.title}. ${event.date}. ${event.organization}. ${event.blurb}` }))
];

const stop = new Set('a an and are as at be been by can could describe do does engineering errol for from has have he his how i in into is it me my of on or portfolio project projects show skills tell that the their these this to use uses using was what which with work would you your'.split(' '));
const aliases = { ai: ['llm', 'gemini', 'groq'], llms: ['llm'], privacy: ['private', 'access', 'sensitive'], fallback: ['fallback', 'models', 'provider'], goals: ['goal', 'plans'], research: ['research', 'ircite'], mobile: ['flutter', 'kotlin'], backend: ['supabase', 'firebase', 'backend'], leadership: ['lead', 'officer', 'committee'], security: ['authentication', 'controls', 'cybersecurity'] };
export function tokens(value) {
  return [...new Set(value.toLowerCase().match(/[a-z0-9]+/g) || [])].filter(word => word.length > 1 && !stop.has(word));
}

export function retrieve(query, limit = 3) {
  const original = tokens(query);
  const terms = [...new Set(original.flatMap(word => [word, ...(aliases[word] || [])]))];
  if (!terms.length) return [];
  return documents.map(doc => {
    const body = new Set(tokens(doc.text));
    const title = new Set(tokens(doc.title));
    const stack = new Set(tokens((doc.stack || []).join(' ')));
    const matches = terms.filter(word => body.has(word) || title.has(word));
    const score = matches.reduce((sum, word) => sum + (title.has(word) ? (original.includes(word) ? 8 : 3) : stack.has(word) ? 3 : 1), 0);
    return { ...doc, score, matches };
  }).filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit);
}

export function localAnswer(query) {
  const sources = retrieve(query);
  return { mode: 'local', answer: sources.length
    ? 'Here is the closest evidence in my portfolio. Open a source to explore the full case study.'
    : 'I couldn’t find evidence for that in this portfolio. Try asking about an application, technology, education, or research. Unknown details stay unknown.',
    sources };
}

// Public examples are a small regression suite, not a model-quality benchmark.
export const evaluationCases = [
  { query: 'Gemini private journal reflection', expected: 'kaibigan' },
  { query: 'Groq fallback maternal health', expected: 'inaagapay' },
  { query: 'Pomodoro goal plans', expected: 'gola' },
  { query: 'Webibo gamification research', expected: 'webibo' },
  { query: 'Java laboratory maintenance', expected: 'peasycheck' },
  { query: 'salary expectations', expected: null }
];
export function evaluateRetrieval() {
  return evaluationCases.map(test => {
    const actual = retrieve(test.query, 1)[0]?.id || null;
    return { ...test, actual, passed: actual === test.expected };
  });
}
