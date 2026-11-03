import { describe, it, expect } from 'vitest';
import { ExerciseEvaluator } from './evaluator.ts';
import { Exercise } from '../types/exercise.ts';
import { buildExercise } from '../../infrastructure/seed/exerciseBuilder.ts';

function createMockExercise(overrides?: Partial<Exercise>): Exercise {
  const base = buildExercise({
    id: 'test-ex',
    title: 'Test Exercise',
    difficulty: 'beginner',
    scenario: 'Test Scenario',
    senderName: 'Test Sender',
    senderAddress: 'alert@fake-service.net',
    domain: 'fake-service.net',
    domainClue: { isClue: true, category: 'contextual', explanation: 'Fake domain' },
    subject: 'Test Subject with Alert',
    dateLabel: 'Hoy',
    preview: 'Test preview',
    paragraphs: [
      [
        'Hola',
        'usuario,',
        { word: 'urgente', isClue: true, category: 'linguistic', explanation: 'Urgency word' },
        'verifique',
        'su',
        'cuenta',
        'ahora.',
      ],
    ],
    referenceClassification: 'phishing',
    referenceExplanation: 'Reference phishing explanation',
    signals: [],
    learningObjective: 'Test objective',
    practicalRecommendation: 'Test recommendation',
  });

  return {
    ...base,
    ...overrides,
  };
}

describe('ExerciseEvaluator Mathematical Rigor', () => {
  const exercise = createMockExercise();
  const allElements = ExerciseEvaluator.getAllEvaluableElements(exercise);
  const clueElements = allElements.filter((el) => el.isRelevantClue);
  const nonClueElements = allElements.filter((el) => !el.isRelevantClue);

  const clueIds = clueElements.map((el) => el.id);
  const nonClueIds = nonClueElements.map((el) => el.id);

  it('1. Seleccion perfecta de indicios (Precision 1.0, Recall 1.0, F1 1.0, P_indicios 100)', () => {
    const metrics = ExerciseEvaluator.evaluate(exercise, 'phishing', clueIds);

    expect(metrics.tp).toBe(clueIds.length);
    expect(metrics.fp).toBe(0);
    expect(metrics.fn).toBe(0);
    expect(metrics.precision).toBeCloseTo(1.0);
    expect(metrics.recall).toBeCloseTo(1.0);
    expect(metrics.f1).toBeCloseTo(1.0);
    expect(metrics.cluesScore).toBe(100);
    expect(metrics.isClassificationCorrect).toBe(true);
    expect(metrics.classificationScore).toBe(100);
    expect(metrics.finalScore).toBe(100);
  });

  it('2. Seleccion parcial (Recall < 1.0, Precision 1.0 si no hay falsos positivos)', () => {
    // Select only half of the clue elements
    const halfClues = clueIds.slice(0, 1);
    const metrics = ExerciseEvaluator.evaluate(exercise, 'phishing', halfClues);

    expect(metrics.tp).toBe(1);
    expect(metrics.fp).toBe(0);
    expect(metrics.fn).toBe(clueIds.length - 1);
    expect(metrics.precision).toBe(1.0);
    expect(metrics.recall).toBe(1 / clueIds.length);
    expect(metrics.f1).toBeGreaterThan(0);
    expect(metrics.f1).toBeLessThan(1.0);
  });

  it('3. Seleccion de elementos irrelevantes (Falsos positivos castigados)', () => {
    // Select non-clue elements only
    const metrics = ExerciseEvaluator.evaluate(exercise, 'phishing', nonClueIds.slice(0, 2));

    expect(metrics.tp).toBe(0);
    expect(metrics.fp).toBe(2);
    expect(metrics.fn).toBe(clueIds.length);
    expect(metrics.precision).toBe(0);
    expect(metrics.recall).toBe(0);
    expect(metrics.f1).toBe(0);
    expect(metrics.cluesScore).toBe(0);
    // Even if classification is correct, final score is only 30%
    expect(metrics.classificationScore).toBe(100);
    expect(metrics.finalScore).toBe(30);
  });

  it('4. Seleccion de todos los elementos (Recall 1.0 pero Precision baja, F1 penalizado)', () => {
    const allIds = allElements.map((el) => el.id);
    const metrics = ExerciseEvaluator.evaluate(exercise, 'phishing', allIds);

    expect(metrics.tp).toBe(clueIds.length);
    expect(metrics.recall).toBe(1.0);
    expect(metrics.fp).toBe(nonClueIds.length);
    expect(metrics.precision).toBe(clueIds.length / allIds.length);
    expect(metrics.f1).toBeLessThan(1.0);
    expect(metrics.finalScore).toBeLessThan(100);
  });

  it('5. Ninguna seleccion (Precision 0, Recall 0, F1 0 cuando hay indicios de referencia)', () => {
    const metrics = ExerciseEvaluator.evaluate(exercise, 'phishing', []);

    expect(metrics.tp).toBe(0);
    expect(metrics.fp).toBe(0);
    expect(metrics.fn).toBe(clueIds.length);
    expect(metrics.precision).toBe(0);
    expect(metrics.recall).toBe(0);
    expect(metrics.f1).toBe(0);
    expect(metrics.cluesScore).toBe(0);
    expect(metrics.finalScore).toBe(30); // 30% for classification
  });

  it('6. Ejercicio sin indicios de referencia (Manejo explícito de conjunto vacio)', () => {
    const noClueExercise = buildExercise({
      id: 'no-clues-ex',
      title: 'No Clues Exercise',
      difficulty: 'beginner',
      scenario: 'Test',
      senderName: 'Sender',
      senderAddress: 'sender@univ.edu',
      domain: 'univ.edu',
      subject: 'Subject',
      dateLabel: 'Hoy',
      preview: 'Preview',
      paragraphs: ['Texto', 'completamente', 'neutro'],
      referenceClassification: 'legitimate',
      referenceExplanation: 'Neutral',
      signals: [],
      learningObjective: 'Objective',
      practicalRecommendation: 'Recommendation',
    });

    // Case A: User selects nothing -> Perfect score 100
    const perfectEmpty = ExerciseEvaluator.evaluate(noClueExercise, 'legitimate', []);
    expect(perfectEmpty.precision).toBe(1.0);
    expect(perfectEmpty.recall).toBe(1.0);
    expect(perfectEmpty.f1).toBe(1.0);
    expect(perfectEmpty.cluesScore).toBe(100);
    expect(perfectEmpty.finalScore).toBe(100);

    // Case B: User selects elements when there are no clues -> Precision 0, F1 0
    const allNoClueElements = ExerciseEvaluator.getAllEvaluableElements(noClueExercise);
    const badEmpty = ExerciseEvaluator.evaluate(noClueExercise, 'legitimate', [allNoClueElements[0].id]);
    expect(badEmpty.precision).toBe(0);
    expect(badEmpty.recall).toBe(0);
    expect(badEmpty.f1).toBe(0);
    expect(badEmpty.cluesScore).toBe(0);
  });

  it('7. Clasificación correcta e incorrecta (P_clasificacion 100 vs 0)', () => {
    const correct = ExerciseEvaluator.evaluate(exercise, 'phishing', clueIds);
    expect(correct.isClassificationCorrect).toBe(true);
    expect(correct.classificationScore).toBe(100);

    const incorrect = ExerciseEvaluator.evaluate(exercise, 'legitimate', clueIds);
    expect(incorrect.isClassificationCorrect).toBe(false);
    expect(incorrect.classificationScore).toBe(0);
    expect(incorrect.finalScore).toBeCloseTo(70.0); // 0.70 * 100 + 0.30 * 0 = 70
  });

  it('8. Clasificación insufficient_information', () => {
    const insufficientEx = buildExercise({
      id: 'insuf-ex',
      title: 'Insuff',
      difficulty: 'advanced',
      scenario: 'Unclear email',
      senderName: 'Unknown',
      senderAddress: 'unknown@cloud.org',
      domain: 'cloud.org',
      subject: 'Doc shared',
      dateLabel: 'Ayer',
      preview: 'Click here',
      paragraphs: ['Archivo', 'compartido'],
      referenceClassification: 'insufficient_information',
      referenceExplanation: 'Information is incomplete',
      signals: [],
      learningObjective: 'Objective',
      practicalRecommendation: 'Verify independently',
    });

    const evaluated = ExerciseEvaluator.evaluate(insufficientEx, 'insufficient_information', []);
    expect(evaluated.isClassificationCorrect).toBe(true);
    expect(evaluated.classificationScore).toBe(100);
  });

  it('9. Robustez numérica y selección con IDs no existentes o vacíos (Evita NaN/Infinity)', () => {
    // Pass bogus element IDs
    const metrics = ExerciseEvaluator.evaluate(exercise, 'phishing', ['non-existent-1', 'fake-id-2']);
    expect(metrics.tp).toBe(0);
    expect(metrics.fp).toBe(0);
    expect(Number.isNaN(metrics.precision)).toBe(false);
    expect(Number.isNaN(metrics.recall)).toBe(false);
    expect(Number.isNaN(metrics.f1)).toBe(false);
    expect(Number.isFinite(metrics.finalScore)).toBe(true);
    expect(metrics.finalScore).toBe(30);
  });

  it('10. Categorías y cálculo de TP por dimensión analítica (Linguistic, Visual, Contextual)', () => {
    const metrics = ExerciseEvaluator.evaluate(exercise, 'phishing', clueIds);
    expect(metrics.categoryBreakdown.linguistic).toBeDefined();
    expect(metrics.categoryBreakdown.contextual).toBeDefined();
    expect(metrics.categoryBreakdown.visual).toBeDefined();
    expect(metrics.categoryBreakdown.linguistic.totalClues).toBeGreaterThan(0);
  });

  it('11. Generación de elementDetails y consistencia exacta con TP, FP, FN, TN', () => {
    // Select one clue and one non-clue
    const selection = [clueIds[0], nonClueIds[0]];
    const metrics = ExerciseEvaluator.evaluate(exercise, 'phishing', selection);

    expect(metrics.elementDetails).toBeDefined();
    expect(metrics.elementDetails.length).toBe(allElements.length);

    const tpList = metrics.elementDetails.filter((d) => d.resultType === 'TP');
    const fpList = metrics.elementDetails.filter((d) => d.resultType === 'FP');
    const fnList = metrics.elementDetails.filter((d) => d.resultType === 'FN');
    const tnList = metrics.elementDetails.filter((d) => d.resultType === 'TN');

    expect(tpList.length).toBe(metrics.tp);
    expect(fpList.length).toBe(metrics.fp);
    expect(fnList.length).toBe(metrics.fn);
    expect(tnList.length).toBe(metrics.tn);

    // Verify status labels
    expect(tpList[0].evaluationStatus).toBe('Acierto');
    expect(fpList[0].evaluationStatus).toBe('Falsa_Alarma');
    expect(fnList[0].evaluationStatus).toBe('Omision');
    expect(tnList[0].evaluationStatus).toBe('Neutro_Correcto');
  });
});

