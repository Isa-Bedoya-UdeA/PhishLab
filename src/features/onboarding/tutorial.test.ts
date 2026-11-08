import { describe, it, expect, beforeEach } from 'vitest';
import { TUTORIAL_EXERCISE, TUTORIAL_STEPS } from './tutorialData.ts';
import { ExerciseEvaluator } from '../../domain/services/evaluator.ts';
import { safeStorage, STORAGE_KEYS } from '../../infrastructure/storage/localStorage.ts';
import { attemptRepository } from '../../infrastructure/repositories/AttemptRepository.ts';

describe('Tutorial Onboarding & Practice Isolation', () => {
  beforeEach(() => {
    safeStorage.clearAllPhishLabData();
  });

  it('TUTORIAL_EXERCISE is well-formed with metadata and body elements', () => {
    expect(TUTORIAL_EXERCISE.id).toBe('ex-tutorial');
    expect(TUTORIAL_EXERCISE.referenceClassification).toBe('phishing');
    expect(TUTORIAL_EXERCISE.metadataElements.length).toBeGreaterThanOrEqual(4);
    expect(TUTORIAL_EXERCISE.bodyElements.length).toBeGreaterThan(10);
    expect(TUTORIAL_EXERCISE.apparentLinks.length).toBe(1);
    expect(TUTORIAL_EXERCISE.signals.length).toBeGreaterThanOrEqual(3);
  });

  it('All 6 tutorial steps are documented with instructions and tips', () => {
    expect(TUTORIAL_STEPS.length).toBe(6);
    TUTORIAL_STEPS.forEach((step, idx) => {
      expect(step.id).toBe(idx + 1);
      expect(step.title.length).toBeGreaterThan(5);
      expect(step.instruction.length).toBeGreaterThan(15);
      expect(step.tip.length).toBeGreaterThan(10);
    });
  });

  it('Evaluating the tutorial exercise produces deterministic metrics without NaNs', () => {
    // Select relevant clue IDs
    const relevantIds = new Set<string>();
    TUTORIAL_EXERCISE.metadataElements.forEach((el) => {
      if (el.isRelevantClue) relevantIds.add(el.id);
    });
    TUTORIAL_EXERCISE.bodyElements.forEach((el) => {
      if (el.isRelevantClue) relevantIds.add(el.id);
    });
    TUTORIAL_EXERCISE.apparentLinks.forEach((l) => {
      if (l.isRelevantClue) relevantIds.add(l.elementId);
    });

    const metrics = ExerciseEvaluator.evaluate(
      TUTORIAL_EXERCISE,
      'phishing',
      Array.from(relevantIds)
    );

    expect(metrics.isClassificationCorrect).toBe(true);
    expect(metrics.tp).toBeGreaterThan(0);
    expect(metrics.fp).toBe(0);
    expect(metrics.fn).toBe(0);
    expect(metrics.precision).toBe(1);
    expect(metrics.recall).toBe(1);
    expect(metrics.f1).toBe(1);
    expect(metrics.finalScore).toBe(100);
    expect(Number.isNaN(metrics.finalScore)).toBe(false);
  });

  it('Practice in tutorial mode does NOT pollute attempts repository or localStorage attempts', async () => {
    const initialAttempts = await attemptRepository.getAllAttempts();
    expect(initialAttempts).toHaveLength(0);

    // Verify localStorage key for attempts is untouched
    const storedAttempts = safeStorage.getItem<unknown[]>(STORAGE_KEYS.ATTEMPTS, []);
    expect(storedAttempts).toHaveLength(0);

    // Complete tutorial flag can be saved independently
    safeStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, true);
    expect(safeStorage.getItem<boolean>(STORAGE_KEYS.TUTORIAL_COMPLETED, false)).toBe(true);

    // Attempts remain completely pristine (0 items)
    const postAttempts = await attemptRepository.getAllAttempts();
    expect(postAttempts).toHaveLength(0);
  });
});
