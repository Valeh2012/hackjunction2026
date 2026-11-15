import type { Route } from './+types/home';
import { useRef, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { seo } from '@/lib/seo';
import { loadTechniques } from '@/lib/analyze-backend.server';
import logger from '@/lib/logger.server';
import { Introduction } from '@/components/home/introduction';
import { TextEditor } from '@/components/home/text-editor';
import { AnalysisResults } from '@/components/home/analysis-results';
import { CHARACTER_LIMIT, type AnalysisResult, type Technique } from '@/data/techniques';

export function meta({ matches, location }: Route.MetaArgs) {
  return seo({ matches, location }, {
    title: 'Propaganda Technique Highlighter',
    description: 'Examine suspected rhetorical techniques in your text with labelled highlights. A transparent English-language pattern scan, not a judgment of truth.',
    image: 'https://images.hostinger.com/8202ab4b-dea1-4d1e-be90-27165bce01b8/cee2e3d1-a1bb-48bd-ae21-65bde41573fc.png',
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Propaganda Technique Highlighter', description: 'A transparent tool for examining suspected rhetorical techniques, not assessing truth.' }, { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Propaganda Technique Highlighter', applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', isAccessibleForFree: true }],
  });
}

/**
 * The technique list lives in the backend. If it cannot be read the page still
 * renders, without the definitions.
 */
export async function loader() {
  try {
    return { 
      techniques: await loadTechniques(),
      // Cache for 1 hour to avoid repeated backend calls
      cacheControl: 'public, max-age=3600'
    };
  } catch (error) {
    logger.error(error instanceof Error ? error.message : error);
    return { techniques: null };
  }
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { techniques } = loaderData;
  const [text, setText] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  function clear() {
    requestRef.current?.abort();
    requestRef.current = null;
    setText('');
    setRunning(false);
    setResult(null);
    setError(null);
  }

  async function detect() {
    if (!text.trim() || text.length > CHARACTER_LIMIT || running) return;
    const submitted = text;
    const controller = new AbortController();
    requestRef.current = controller;
    setRunning(true);
    setError(null);
    setResult(null);
    const timeout = setTimeout(() => controller.abort(), 60_000);
    try {
      const response = await fetch('/api/analyze/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
        body: JSON.stringify({ text: submitted }),
        signal: controller.signal,
      });
      if (requestRef.current !== controller) return;
      if (!response.ok) {
        if (response.status === 429) throw new Error('Too many requests. Please wait a few minutes and try again.');
        if (response.status >= 500) throw new Error('Analysis is temporarily unavailable. Your text is still here; please try again.');
        throw new Error('The text could not be analyzed. Please check your input and try again.');
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Streaming not supported');
      const decoder = new TextDecoder();
      let buffer = '';
      let currentSpans: AnalysisResult['spans'] = [];
      let spinnerStopped = false;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === 'spans_detected') {
              currentSpans = event.spans;
              setResult({ text: submitted, spans: currentSpans, method: 'pattern-based', language: 'en' });
              // Stop the overlay spinner as soon as the API responds with spans
              if (!spinnerStopped) {
                spinnerStopped = true;
                setRunning(false);
              }
            } else if (event.type === 'span_classified') {
              currentSpans[event.index] = event.span;
              setResult({ text: submitted, spans: [...currentSpans], method: 'pattern-based', language: 'en' });
            } else if (event.type === 'error') {
              throw new Error(event.error);
            }
          } catch (e) {
            if (e instanceof Error && e.message !== 'The user aborted a request.') throw e;
          }
        }
      }
    } catch (cause) {
      if (requestRef.current !== controller) return;
      setError(controller.signal.aborted ? 'Analysis timed out. Your text is still here; please try again.' : cause instanceof TypeError ? 'Could not connect to the server. Check your connection and try again.' : cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
    } finally {
      clearTimeout(timeout);
      if (requestRef.current === controller) {
        requestRef.current = null;
        setRunning(false);
      }
    }
  }

  // Build a map of techniqueId -> span numbers for the sidebars
  const spanNumbersByTechnique = new Map<string, number[]>();
  if (result) {
    for (const [index, span] of result.spans.entries()) {
      if (span.techniqueId === 'pending') continue;
      const existing = spanNumbersByTechnique.get(span.techniqueId) ?? [];
      existing.push(index + 1);
      spanNumbersByTechnique.set(span.techniqueId, existing);
    }
  }

  const hasPending = result?.spans.some(s => s.techniqueId === 'pending') ?? false;
  return (
    <main id="main-content" className="app-main">
      <Introduction />
      <div className="editor-with-techniques">
        {techniques && (
          <div className="techniques-sidebar left">
            <div className="technique-definitions">
              {techniques.slice(0, Math.ceil(techniques.length / 2)).map(technique => {
                const numbers = spanNumbersByTechnique.get(technique.id);
                return (
                  <div key={technique.id}>
                    <h3>
                      {technique.name}
                      {numbers && numbers.length > 0 && (
                        <span className="technique-span-numbers">
                          {numbers.map(n => <span key={n} className="span-number">{String(n).padStart(2, '0')}</span>)}
                        </span>
                      )}
                    </h3>
                    <p>{technique.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="editor-center">
          {result ? (
            <>
              <AnalysisResults result={result} techniques={techniques} onClear={clear} />
              {hasPending && (
                <div className="classification-progress">
                  <p>Classifying techniques…</p>
                </div>
              )}
            </>
          ) : (
            <TextEditor text={text} running={running} error={error} onTextChange={value => { setText(value); setResult(null); setError(null); }} onDetect={detect} onClear={clear} />
          )}
        </div>
        {techniques && (
          <div className="techniques-sidebar right">
            <div className="technique-definitions">
              {techniques.slice(Math.ceil(techniques.length / 2)).map(technique => {
                const numbers = spanNumbersByTechnique.get(technique.id);
                return (
                  <div key={technique.id}>
                    <h3>
                      {technique.name}
                      {numbers && numbers.length > 0 && (
                        <span className="technique-span-numbers">
                          {numbers.map(n => <span key={n} className="span-number">{String(n).padStart(2, '0')}</span>)}
                        </span>
                      )}
                    </h3>
                    <p>{technique.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
