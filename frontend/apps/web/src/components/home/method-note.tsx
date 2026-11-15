import { ChevronDown } from 'lucide-react';
import { type Technique } from '@/data/techniques';

export function MethodNote({ techniques }: { techniques: Technique[] | null }) {
  if (!techniques) {
    return <section className="method-section"><div className="method-body"><p role="status">The list of techniques could not be loaded. Reload the page to try again.</p></div></section>;
  }
  const midpoint = Math.ceil(techniques.length / 2);
  const leftHalf = techniques.slice(0, midpoint);
  const rightHalf = techniques.slice(midpoint);
  return (
    <section className="method-section">
      <div className="method-body">
        <details>
          <summary>What the scan looks for <span>{techniques.length} techniques <ChevronDown size={14} /></span></summary>
          <div className="technique-definitions-two-col">
            <div className="technique-definitions">{leftHalf.map(technique => <div key={technique.id}><h3>{technique.name}</h3><p>{technique.description}</p></div>)}</div>
            <div className="technique-definitions">{rightHalf.map(technique => <div key={technique.id}><h3>{technique.name}</h3><p>{technique.description}</p></div>)}</div>
          </div>
        </details>
      </div>
    </section>
  );
}
