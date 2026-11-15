import { useRef, useState } from 'react';
import { TextEditor } from '@/components/home/text-editor';
import { AnalysisResults } from '@/components/home/analysis-results';
import { CHARACTER_LIMIT, type AnalysisResult, type Technique } from '@/data/techniques';

function isAnalysisResult(value: unknown, submitted: string): value is AnalysisResult {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<AnalysisResult>;
  if (data.text !== submitted || data.method !== 'pattern-based' || !Array.isArray(data.spans)) return false;
  let previousEnd = 0;
  return data.spans.every(span => {
    if (!span || !Number.isInteger(span.start) || !Number.isInteger(span.end) || span.start < previousEnd || span.end <= span.start || span.end > submitted.length || typeof span.techniqueId !== 'string' || typeof span.techniqueName !== 'string') return false;
    previousEnd = span.end;
    return true;
  });
}

export function AnalysisWorkspace({ techniques }: { techniques: Technique[] | null }) {
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
              // Show results immediately with pending classifications
              currentSpans = event.spans;
              setResult({ text: submitted, spans: currentSpans, method: 'pattern-based', language: 'en' });
            } else if (event.type === 'span_classified') {
              // Update individual span with classification
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

  if (result) {
    const hasPending = result.spans.some(s => s.techniqueId === 'pending');
    return (
      <>
        <AnalysisResults result={result} techniques={techniques} />
        {hasPending && (
          <div className="classification-progress">
            <p>Classifying techniques…</p>
          </div>
        )}
      </>
    );
  }
  if (running) return <section className="results-section" aria-live="polite"><p role="status" className="result-summary">Identifying propaganda spans…</p></section>;
  return <TextEditor text={text} running={running} error={error} onTextChange={value => { setText(value); setResult(null); setError(null); }} onDetect={detect} onClear={clear} />;
}
