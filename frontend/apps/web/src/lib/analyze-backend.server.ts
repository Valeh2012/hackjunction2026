import { apiError } from '@/lib/api.server';
import logger from '@/lib/logger.server';
import { type AnalysisResult, type AnalysisSpan, type Technique } from '@/data/techniques';

// Backend API URL is required in production. Fail fast if not configured.
const BACKEND_API_URL = 'https://api.propagandadetector.tech';

// Shorter than the 30s the browser waits, so the visitor gets this server's error rather than a client timeout.
const BACKEND_TIMEOUT_MS = 25_000;
// The technique list is read while the page renders, so it gets far less time than an analysis.
const TECHNIQUES_TIMEOUT_MS = 5_000;

/**
 * The backend counts Unicode code points; the reader slices with UTF-16 indices.
 * Entry `i` is the UTF-16 index of code point `i`, with one extra entry for the end of the text.
 */
function utf16Offsets(text: string): number[] {
  const offsets: number[] = [];
  let index = 0;
  for (const character of text) {
    offsets.push(index);
    index += character.length;
  }
  offsets.push(index);
  return offsets;
}

/** FastAPI reports rejected input as `{ detail: [{ msg }] }`. */
function validationMessage(body: unknown): string {
  const detail: unknown = body && typeof body === 'object' && 'detail' in body ? body.detail : undefined;
  const first: unknown = Array.isArray(detail) ? detail[0] : undefined;
  if (first && typeof first === 'object' && 'msg' in first && typeof first.msg === 'string') {
    return `The text could not be analyzed: ${first.msg}.`;
  }
  return 'The text could not be analyzed. Please check your input and try again.';
}

function toSpans(text: string, body: unknown): AnalysisSpan[] {
  if (!body || typeof body !== 'object' || !('text' in body) || !('spans' in body) || !Array.isArray(body.spans)) {
    throw new Error('Analysis backend returned an unexpected response');
  }
  // The offsets are only meaningful against the text the backend actually analyzed.
  if (body.text !== text) throw new Error('Analysis backend analyzed a different text than the one submitted');

  const offsets = utf16Offsets(text);
  const mapped = body.spans.map((span: unknown): AnalysisSpan => {
    if (!span || typeof span !== 'object' || !('start' in span) || !('end' in span) || !('technique_id' in span) || !('technique' in span)) {
      throw new Error('Analysis backend returned a malformed span');
    }
    const { start, end, technique_id: techniqueId, technique: techniqueName } = span;
    if (typeof start !== 'number' || typeof end !== 'number' || !Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end >= offsets.length) {
      throw new Error('Analysis backend returned a span outside the submitted text');
    }
    if (typeof techniqueId !== 'string' || !techniqueId || typeof techniqueName !== 'string' || !techniqueName) {
      throw new Error('Analysis backend returned a span without a technique');
    }
    return { start: offsets[start], end: offsets[end], techniqueId, techniqueName };
  });
  mapped.sort((a, b) => a.start - b.start || a.end - b.end);

  // The reader renders one flat run of highlights, so a span that overlaps an earlier one cannot be shown.
  const spans: AnalysisSpan[] = [];
  let previousEnd = 0;
  for (const span of mapped) {
    if (span.start < previousEnd) continue;
    spans.push(span);
    previousEnd = span.end;
  }
  if (spans.length < mapped.length) {
    logger.warn(`Analysis backend returned ${mapped.length - spans.length} overlapping span(s); only the first of each overlap is shown`);
  }
  return spans;
}

/**
 * Sends the text to the backend's `POST /api/analyze` as JSON and returns its
 * spans in the shape the reader expects.
 */
export async function analyzeWithBackend(text: string): Promise<AnalysisResult> {
  const url = new URL('/api/analyze', BACKEND_API_URL);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
    });
  } catch (cause) {
    throw new Error(`Analysis backend is unreachable at ${url.origin}`, { cause });
  }

  const body: unknown = await response.json().catch(() => null);
  if (response.status === 422) throw apiError(422, validationMessage(body));
  if (!response.ok) throw new Error(`Analysis backend responded with status ${response.status}`);

  return { text, spans: toSpans(text, body), method: 'pattern-based', language: 'en' };
}

/**
 * Sends the text to the backend's `POST /api/analyze/stream` and returns
 * the streaming response as SSE.
 */
export async function analyzeWithBackendStream(text: string): Promise<Response> {
  const url = new URL('/api/analyze/stream', BACKEND_API_URL);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'text/event-stream', 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
    });
  } catch (cause) {
    throw new Error(`Analysis backend is unreachable at ${url.origin}`, { cause });
  }

  if (response.status === 422) {
    const body: unknown = await response.json().catch(() => null);
    throw apiError(422, validationMessage(body));
  }
  if (!response.ok) throw new Error(`Analysis backend responded with status ${response.status}`);

  // Forward the streaming response
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

function isTechnique(value: unknown): value is Technique {
  return !!value && typeof value === 'object'
    && 'id' in value && typeof value.id === 'string'
    && 'name' in value && typeof value.name === 'string'
    && 'description' in value && typeof value.description === 'string';
}

/** Reads the technique classes from the backend's `GET /api/techniques`; this app keeps no list of its own. */
export async function loadTechniques(): Promise<Technique[]> {
  const url = new URL('/api/techniques', BACKEND_API_URL);

  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(TECHNIQUES_TIMEOUT_MS) });
  } catch (cause) {
    throw new Error(`Analysis backend is unreachable at ${url.origin}`, { cause });
  }
  if (!response.ok) throw new Error(`Analysis backend responded with status ${response.status} for the technique list`);

  const body: unknown = await response.json().catch(() => null);
  if (!Array.isArray(body) || !body.every(isTechnique)) throw new Error('Analysis backend returned an unexpected technique list');
  return body.map(({ id, name, description }) => ({ id, name, description }));
}
