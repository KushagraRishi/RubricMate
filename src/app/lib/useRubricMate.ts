import { useCallback, useMemo, useState } from 'react';
import type { Criterion, CriterionResult, CriterionStatus } from './types';
import { extractRubric, checkDraft, ApiFailure } from './api';
import { countCitations, countWords } from './text';

/**
 * The three states the original design was drawn for. They are no longer tabs
 * you click between -- the demo moves through them as the work actually gets
 * done.
 */
export type Step = 'upload' | 'checklist' | 'progress';

/** A criterion plus everything we currently know about how the draft is doing. */
export interface Row {
  criterion: Criterion;
  status: CriterionStatus;
  /** 0-100, for the bar. */
  percent: number;
  /** Set once the model has looked at the draft. */
  result?: CriterionResult;
  /** Set for measurable criteria: "579 of 1,000 words". Updates as you type. */
  live?: string;
}

export function useRubricMate() {
  const [step, setStep] = useState<Step>('upload');
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [draft, setDraft] = useState('');
  const [results, setResults] = useState<CriterionResult[] | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | 'extract' | 'check'>(null);
  const [error, setError] = useState<string | null>(null);
  /** Bumped after a check so the UI can tell fresh results from stale ones. */
  const [checkedAt, setCheckedAt] = useState<string>('');

  const words = useMemo(() => countWords(draft), [draft]);
  const citations = useMemo(() => countCitations(draft), [draft]);

  /**
   * Measurable criteria are scored here on every keystroke. Everything else
   * waits for the model. That split is the whole design: counting is free and
   * exact, judging is neither.
   */
  const rows = useMemo<Row[]>(() => {
    const byId = new Map((results ?? []).map((r) => [r.id, r]));

    return criteria.map((criterion) => {
      const result = byId.get(criterion.id);
      const m = criterion.measurable;

      if (m) {
        const have = m.kind === 'min_citations' ? citations : words;
        const noun = m.kind === 'min_citations' ? 'sources' : 'words';

        if (m.kind === 'max_words') {
          const over = have > m.value;
          return {
            criterion,
            status: over ? 'missing' : 'done',
            percent: Math.min(100, Math.round((have / m.value) * 100)),
            result,
            live: over
              ? `${have.toLocaleString()} words, ${(have - m.value).toLocaleString()} over the limit`
              : `${have.toLocaleString()} of ${m.value.toLocaleString()} words`,
          };
        }

        const percent = m.value === 0 ? 100 : Math.min(100, Math.round((have / m.value) * 100));
        return {
          criterion,
          status: have >= m.value ? 'done' : have === 0 ? 'missing' : 'in_progress',
          percent,
          result,
          live: `${have.toLocaleString()} of ${m.value.toLocaleString()} ${noun}`,
        };
      }

      if (!result) {
        return { criterion, status: 'missing' as CriterionStatus, percent: 0 };
      }
      return {
        criterion,
        status: result.status,
        percent: Math.round(result.score * 10),
        result,
      };
    });
  }, [criteria, results, words, citations]);

  const doneCount = rows.filter((r) => r.status === 'done').length;

  const loadRubric = useCallback(async (text: string) => {
    setBusy('extract');
    setError(null);
    try {
      const { criteria: found } = await extractRubric(text);
      setCriteria(found);
      setResults(null);
      setSuggestion(null);
      setCheckedAt('');
      setStep('checklist');
    } catch (err) {
      setError(err instanceof ApiFailure ? err.message : 'Could not read that rubric.');
    } finally {
      setBusy(null);
    }
  }, []);

  const runCheck = useCallback(async () => {
    if (!criteria.length) return;
    if (!draft.trim()) {
      setError('Write something first, then check it.');
      return;
    }
    setBusy('check');
    setError(null);
    try {
      const result = await checkDraft(draft, criteria);
      setResults(result.results);
      setSuggestion(result.suggestion);
      setCheckedAt(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      setStep('progress');
    } catch (err) {
      setError(err instanceof ApiFailure ? err.message : 'Could not check the draft.');
    } finally {
      setBusy(null);
    }
  }, [criteria, draft]);

  const reset = useCallback(() => {
    setStep('upload');
    setCriteria([]);
    setDraft('');
    setResults(null);
    setSuggestion(null);
    setError(null);
    setCheckedAt('');
  }, []);

  return {
    step,
    criteria,
    draft,
    setDraft,
    rows,
    doneCount,
    words,
    citations,
    suggestion,
    busy,
    error,
    dismissError: () => setError(null),
    checkedAt,
    loadRubric,
    runCheck,
    reset,
  };
}
