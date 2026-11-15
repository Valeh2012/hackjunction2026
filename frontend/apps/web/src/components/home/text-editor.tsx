import { ArrowRight, LoaderCircle, TriangleAlert } from 'lucide-react';
import { CHARACTER_LIMIT } from '@/data/techniques';

interface TextEditorProps {
  text: string;
  running: boolean;
  error: string | null;
  onTextChange: (text: string) => void;
  onDetect: () => void;
  onClear: () => void;
}

export function TextEditor({ text, running, error, onTextChange, onDetect, onClear }: TextEditorProps) {
  const exceeded = text.length > CHARACTER_LIMIT;
  const count = new Intl.NumberFormat('en-US').format(text.length);
  return (
    <section className="editor-section" aria-labelledby="editor-title">
      <form onSubmit={event => { event.preventDefault(); onDetect(); }}>
        <label id="editor-title" htmlFor="source-text" className="sr-only">Your text</label>
        <div className={`textarea-frame${exceeded ? ' invalid' : ''}`}>
          <textarea id="source-text" name="text" placeholder="Paste an article or paragraph here…" value={text} readOnly={running} onChange={event => onTextChange(event.target.value)} aria-invalid={exceeded} aria-describedby={`character-count text-privacy${exceeded ? ' limit-warning' : ''}`} spellCheck={false} />
          {running && (
            <div className="textarea-overlay">
              <LoaderCircle size={32} className="spinner-large" />
            </div>
          )}
        </div>
        <div className="editor-meta"><span id="character-count" className={exceeded ? 'counter exceeded' : 'counter'}>{count}<span> / 10,000 characters</span></span></div>
        {exceeded && <p id="limit-warning" role="alert" className="error-message"><TriangleAlert size={16} /> The limit is 10,000 characters. Remove {new Intl.NumberFormat('en-US').format(text.length - CHARACTER_LIMIT)} characters to continue.</p>}
        {error && <p role="alert" className="error-message"><TriangleAlert size={16} />{error}</p>}
        <div className="editor-actions"><button type="submit" className="detect-button" disabled={!text.trim() || exceeded || running}>{running ? <><LoaderCircle size={17} className="spinner" /></> : <>Detect <ArrowRight size={17} /></>}</button><button className="clear-link" type="button" onClick={onClear}>Clear</button></div>
        <span className="sr-only" role="status">{running ? 'Analyzing…' : ''}</span>
        <p id="text-privacy" className="privacy-note">Text is sent for analysis and not stored.</p>
      </form>
    </section>
  );
}
