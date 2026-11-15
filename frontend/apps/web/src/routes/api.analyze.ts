import { apiError, readJsonBody, withApi } from '@/lib/api.server';
import { analyzeWithBackend } from '@/lib/analyze-backend.server';
import { CHARACTER_LIMIT } from '@/data/techniques';

export const loader = withApi(() => apiError(405, 'Use a POST request with JSON containing a text field.'));

export const action = withApi(async ({ request }) => {
  if (request.method !== 'POST') return apiError(405, 'Use a POST request.');
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return apiError(415, 'Send the text as application/json.');
  }
  const body = await readJsonBody<unknown>(request);
  if (!body || typeof body !== 'object' || !('text' in body) || typeof body.text !== 'string') {
    return apiError(422, 'Please provide a text field containing a string.');
  }
  if (!body.text.trim()) return apiError(422, 'Paste some text before analyzing.');
  if (body.text.length > CHARACTER_LIMIT) return apiError(422, 'Text must be 10,000 characters or fewer.');
  return analyzeWithBackend(body.text);
});
