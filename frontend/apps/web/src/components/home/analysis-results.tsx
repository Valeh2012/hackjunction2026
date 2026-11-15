import { useEffect, useRef, useState } from 'react';
import { Eraser } from 'lucide-react';
import { type AnalysisResult, type Technique } from '@/data/techniques';

/** Each span carries its technique's name; `techniques` only adds the descriptions and may be missing. */
export function AnalysisResults({ result, techniques, onClear }: { result: AnalysisResult; techniques: Technique[] | null; onClear: () => void }) {
  const count = result.spans.length;
  const classifiedCount = result.spans.filter(s => s.techniqueId !== 'pending').length;
  const [animatedUpTo, setAnimatedUpTo] = useState(0);
  const spanRefs = useRef<Map<number, HTMLElement>>(new Map());
  const animatedRef = useRef(0);

  // Animate each span as it gets classified
  useEffect(() => {
    const newlyClassified = classifiedCount - animatedRef.current;
    if (newlyClassified <= 0) return;

    for (let i = 0; i < newlyClassified; i++) {
      const spanIndex = animatedRef.current + i;
      setTimeout(() => {
        setAnimatedUpTo(prev => Math.max(prev, spanIndex + 1));
        animatedRef.current = spanIndex + 1;
        // Scroll the newly animated span into view
        setTimeout(() => {
          const el = spanRefs.current.get(spanIndex);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);
      }, i * 400);
    }
    
    // Ensure all classified spans are animated after a delay (safety net)
    setTimeout(() => {
      setAnimatedUpTo(classifiedCount);
      animatedRef.current = classifiedCount;
    }, newlyClassified * 400 + 100);
  }, [classifiedCount]);

  // Reset animation state when text changes
  useEffect(() => {
    animatedRef.current = 0;
    setAnimatedUpTo(0);
  }, [result.text]);

  // Build highlighted text fragments
  const fragments: React.ReactNode[] = [];
  let cursor = 0;
  for (const [index, span] of result.spans.entries()) {
    fragments.push(result.text.slice(cursor, span.start));
    const label = span.techniqueId === 'pending' ? 'Classifying…' : span.techniqueName;
    const isAnimated = index < animatedUpTo;
    fragments.push(
      <span
        className={`annotated-span${isAnimated ? ' animate' : ''}`}
        key={`${span.start}-${span.end}`}
        ref={(el) => {
          if (el) spanRefs.current.set(index, el);
          else spanRefs.current.delete(index);
        }}
      >
        <mark title={`${String(index + 1).padStart(2, '0')} · ${label}`}>
          <span className="annotation-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="highlighted-text">{result.text.slice(span.start, span.end)}</span>
        </mark>
      </span>
    );
    cursor = span.end;
  }
  fragments.push(result.text.slice(cursor));

  return (
    <section className="results-section" aria-labelledby="results-title">
      <div className="results-header">
        <p role="status" className="result-summary">
          {count ? <><strong>{count} suspected {count === 1 ? 'span' : 'spans'}</strong> detected.</> : <><strong>No suspected patterns found.</strong></>}
        </p>
        <button className="clear-button-top" type="button" onClick={onClear}>
          <Eraser size={15} /> Clear
        </button>
      </div>

      <div className="text-reading" aria-label="Submitted text with suspected techniques highlighted">{fragments}</div>
    </section>
  );
}
