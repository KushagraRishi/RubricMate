/** Shared shapes for the RubricMate demo. Used by both the browser and the API routes. */

/** A deterministic rule we can check in the browser, with no model call. */
export type Measurable =
  | { kind: 'min_words'; value: number }
  | { kind: 'max_words'; value: number }
  | { kind: 'min_citations'; value: number };

export interface Criterion {
  id: string;
  name: string;
  /** One short line describing what a good answer looks like. */
  description: string;
  /** Share of the grade, 0-100. The set should add up to about 100. */
  weight: number;
  /** Present when the rule can be measured exactly instead of judged. */
  measurable?: Measurable;
}

export type CriterionStatus = 'done' | 'in_progress' | 'missing';

export interface CriterionResult {
  id: string;
  status: CriterionStatus;
  /** 0-10. */
  score: number;
  /** One or two sentences, written to the student. */
  feedback: string;
  /** A short quote from the draft that backs up the score, when there is one. */
  evidence?: string;
}

export interface CheckResult {
  results: CriterionResult[];
  /** One next action, the single most useful thing to do. */
  suggestion: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Shape of every error the API routes return. */
export interface ApiError {
  error: string;
}
