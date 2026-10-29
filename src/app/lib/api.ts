import type { Criterion, CheckResult, ChatMessage } from './types';

/** Thrown with the message the server wrote, so the UI can show it as-is. */
export class ApiFailure extends Error {}

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiFailure('Could not reach the server. Check your connection.');
  }

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // Fall through to the status check below.
  }

  if (!response.ok) {
    throw new ApiFailure(data?.error ?? 'Something went wrong. Try again.');
  }
  return data as T;
}

export function extractRubric(rubric: string) {
  return post<{ criteria: Criterion[] }>('/api/extract', { rubric });
}

export function checkDraft(draft: string, criteria: Criterion[]) {
  return post<CheckResult>('/api/check', { draft, criteria });
}

export function askQuestion(
  question: string,
  draft: string,
  criteria: Criterion[],
  history: ChatMessage[],
) {
  return post<{ answer: string }>('/api/chat', { question, draft, criteria, history });
}
