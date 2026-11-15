/** A technique class as the backend's `GET /api/techniques` reports it. The list itself is not kept in this app. */
export type Technique = { id: string; name: string; description: string };
/** `techniqueId` and `techniqueName` are the backend's `technique_id` and `technique` for the span. */
export type AnalysisSpan = { start: number; end: number; techniqueId: string; techniqueName: string };
export type AnalysisResult = { text: string; spans: AnalysisSpan[]; method: 'pattern-based'; language: 'en' };
export const CHARACTER_LIMIT = 10_000;
