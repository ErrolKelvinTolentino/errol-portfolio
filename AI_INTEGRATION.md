# AI engineering portfolio roadmap

Build one feature deeply enough that visitors can inspect its sources, failure behavior, and evaluations. The portfolio explorer is the starting point.

## What now works

- Browser-local lexical retrieval over the shared project, profile, and event records, with technology aliases, ranked evidence, and working case-study links.
- An inspectable retrieval trace and six runnable regression examples, including an unsupported question. These are examples, not a model benchmark.
- Optional Groq generation through a server-only endpoint: bounded question size, a per-IP request limit, 12-second provider timeout, JSON validation, allowlisted source IDs, and automatic local fallback.
- No browser API keys, stored questions, or automatic model calls. Visitors explicitly opt in when the server is configured.

The published static site uses local retrieval. The Node server supports the optional model route; a static host cannot execute it. No real provider call was verified without an API key. Valid source IDs do not prove that every generated claim is supported, so the UI keeps the source evidence visible.

## 1. Upgrade the explorer to hybrid RAG — highest priority

**Visitor experience:** “How did you handle privacy and model failures?” returns a short answer citing the exact relevant paragraphs, with links to code and case studies.

**Implementation:** author a Markdown case study for each repository; split by heading; attach document ID, heading, Git commit, and source URL to every chunk. Index embeddings in Supabase Postgres with pgvector and combine vector retrieval with keyword search. Keep one embedding model/version consistent for indexing and queries. Supabase documents both [semantic search](https://supabase.com/docs/guides/ai/semantic-search) and [Edge Function embeddings](https://supabase.com/docs/guides/functions/examples/semantic-search).

**Proof to show:** retrieved chunks, prompt version, model, request latency, measured token usage, source links, and a clear “not documented” response. Evaluate on paraphrases, misleading premises, unknown facts, and prompt-injection questions. Compare retrieval against this lexical baseline before claiming improvement.

**Skills demonstrated:** data ingestion, retrieval, grounding, backend APIs, evaluation, and deployment.

## 2. Add a provider reliability playground

**Visitor experience:** run the same non-sensitive question through a primary provider, simulate its timeout, and watch the fallback path. A visible trace distinguishes simulated failure from an actual provider outage.

**Implementation:** server-side provider adapters; bounded retries; timeout budgets; typed response validation; a circuit breaker; caching for public demo inputs. Never put private journal or health data in the demo. Show request timing and usage from actual responses; do not invent cost or reliability numbers. Groq’s [Chat API](https://console.groq.com/docs/api-reference) and [JSON output guidance](https://console.groq.com/docs/structured-outputs) are the starting references.

**Proof to show:** timeout tests, provider errors, invalid JSON, rate-limit behavior, and actual latency/cost measurements. This is a natural extension of the fallback work described in Kaibigan and InaAgapay.

**Skills demonstrated:** resilient AI services, observability, cost control, and structured outputs.

## 3. Add a job-description evidence mapper

**Visitor experience:** paste a job description and see a requirement-to-project table. “React” links to Gola; unsupported requirements say “not documented.” Let visitors inspect the quoted evidence and open the repositories.

**Implementation:** extract requirements into a validated schema, retrieve evidence for each, and return requirement / source / excerpt / gap. Keep the input ephemeral and disclose any model transmission. This is a portfolio browsing aid; avoid suitability percentages or claims that missing evidence means a person lacks a skill.

**Proof to show:** correct mappings, uncovered requirements, source validation, conflicting requirements, and adversarial input tests.

**Skills demonstrated:** structured extraction, multi-step workflows, retrieval, and uncertainty handling.

## 4. Add a constrained Gola planning demo

**Visitor experience:** enter a small software project idea and receive an editable plan with milestones, dependencies, and acceptance criteria. Explain assumptions before generating the plan.

**Implementation:** validated plan schema, strict limits on task count and response size, editable output, and browser-local progress. Show the request/validation trace. Start with one generation call; add tool use only when it serves a concrete need.

**Proof to show:** impossible deadlines, vague goals, malformed output, repeatability, and useful acceptance criteria. Label demo output clearly; it is not a shipped Gola screenshot.

**Skills demonstrated:** prompt design, structured generation, validation, and AI product UX.

## Recommended sequence

1. Add authentic screenshots and concise case studies with links to specific implementation files.
2. Enable and deploy the current model endpoint on a server-capable host; add shared abuse limits and spend limits before opening it publicly.
3. Improve retrieval with a small, versioned evaluation dataset. Add embeddings when the comparison shows they help.
4. Build the reliability playground and publish measured results.

Keep the portfolio focused: two inspectable demos with good failure handling will communicate more engineering depth than several disconnected chat widgets.
