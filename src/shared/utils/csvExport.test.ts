import { describe, it, expect } from 'vitest';
import {
  generateExerciseResultsCsv,
  generateClueResultsCsv,
  generateClueSummaryCsv,
  calculateCluesSummary,
} from './csvExport.ts';
import { ExerciseAttempt } from '../../domain/types/attempt.ts';
import { Exercise } from '../../domain/types/exercise.ts';
import { buildExercise } from '../../infrastructure/seed/exerciseBuilder.ts';
import { ExerciseEvaluator } from '../../domain/services/evaluator.ts';

describe('CSV Exporters for Academic Research', () => {
  const testExercise: Exercise = buildExercise({
    id: 'ex-01',
    title: 'Notificación de seguridad de cuenta institucional',
    difficulty: 'beginner',
    scenario: 'Alerta de cuenta',
    senderName: 'Centro de Seguridad',
    senderAddress: 'seguridad@servicios-portal-auth.net',
    senderAddressClue: { isClue: true, category: 'contextual', explanation: 'Dominio externo' },
    domain: 'servicios-portal-auth.net',
    domainClue: { isClue: true, category: 'contextual', explanation: 'Dominio anómalo' },
    subject: 'URGENTE: Verificación de acceso',
    subjectClue: { isClue: true, category: 'linguistic', explanation: 'Urgencia artificial' },
    dateLabel: 'Hoy',
    preview: 'Acceso no reconocido...',
    paragraphs: [
      [
        'Estimado',
        'usuario,',
        { word: 'obligatorio', isClue: true, category: 'linguistic', explanation: 'Lenguaje coercitivo' },
        'verificar',
        'en',
        { word: '24', isClue: true, category: 'linguistic', explanation: 'Presión temporal de 24 horas' },
        { word: 'horas.', isClue: true, category: 'linguistic', explanation: 'Presión temporal' },
      ],
    ],
    apparentLinks: [
      {
        id: 'link-1',
        label: 'Verificar cuenta ahora',
        displayedUrl: 'https://portal-validacion-seguridad.net/login',
        isClue: true,
        category: 'contextual',
        explanation: 'Enlace externo sospechoso',
      },
    ],
    referenceClassification: 'phishing',
    referenceExplanation: 'Mensaje de phishing con enlaces externos y urgencia.',
    signals: [],
    learningObjective: 'Detectar phishing',
    practicalRecommendation: 'No abrir enlaces',
  });

  // Participant selects senderAddress (TP), '24' (TP), but misses 'horas.' (FN), 'obligatorio' (FN), link-1 (FN),
  // and erroneously selects 'usuario,' (FP - neutral element selected).
  const mockAttempt: ExerciseAttempt = {
    id: 'att-user-1',
    exerciseId: 'ex-01',
    exerciseTitle: 'Notificación de seguridad de cuenta institucional',
    referenceClassification: 'phishing',
    selectedClassification: 'phishing',
    selectedElementIds: [
      'ex-01-meta-sender-address', // TP (clue)
      'ex-01-w6', // '24' TP (clue)
      'ex-01-w2', // 'usuario,' FP (neutral word selected by mistake)
    ],
    metrics: {
      tp: 2,
      fp: 1,
      fn: 4,
      tn: 5,
      totalElements: 12,
      totalClues: 6,
      selectedCount: 3,
      precision: 2 / 3,
      recall: 2 / 6,
      f1: 0.4444,
      cluesScore: 44.4,
      isClassificationCorrect: true,
      classificationScore: 100,
      finalScore: 61.1,
      correctElementIds: ['ex-01-meta-sender-address', 'ex-01-w6'],
      missedElementIds: ['ex-01-meta-domain', 'ex-01-meta-subject', 'ex-01-w3', 'ex-01-w7', 'ex-01-link-link-1'],
      incorrectElementIds: ['ex-01-w2'],
      categoryBreakdown: {
        linguistic: { category: 'linguistic', totalClues: 4, identifiedClues: 1, missedClues: 3, precision: 1, recall: 0.25, f1: 0.4 },
        visual: { category: 'visual', totalClues: 0, identifiedClues: 0, missedClues: 0, precision: 1, recall: 1, f1: 1 },
        contextual: { category: 'contextual', totalClues: 2, identifiedClues: 1, missedClues: 1, precision: 1, recall: 0.5, f1: 0.67 },
      },
      elementDetails: [
        {
          elementId: 'ex-01-meta-sender-address',
          text: 'seguridad@servicios-portal-auth.net',
          type: 'sender_address',
          category: 'contextual',
          subcategory: 'direccion_anomala',
          isRelevantClue: true,
          isSelected: true,
          resultType: 'TP',
          evaluationStatus: 'Acierto',
          explanation: 'Dominio externo',
        },
        {
          elementId: 'ex-01-w2',
          text: 'usuario,',
          type: 'word',
          category: 'linguistic',
          subcategory: 'texto_ordinario',
          isRelevantClue: false,
          isSelected: true,
          resultType: 'FP',
          evaluationStatus: 'Falsa_Alarma',
          explanation: undefined,
        },
        {
          elementId: 'ex-01-w3',
          text: 'obligatorio',
          type: 'word',
          category: 'linguistic',
          subcategory: 'autoridad_presion',
          isRelevantClue: true,
          isSelected: false,
          resultType: 'FN',
          evaluationStatus: 'Omision',
          explanation: 'Lenguaje coercitivo',
        },
        {
          elementId: 'ex-01-w1',
          text: 'Estimado',
          type: 'word',
          category: 'linguistic',
          subcategory: 'texto_ordinario',
          isRelevantClue: false,
          isSelected: false,
          resultType: 'TN',
          evaluationStatus: 'Neutro_Correcto',
          explanation: undefined,
        },
      ],
    },
    startedAt: '2026-10-28T10:00:00.000Z',
    completedAt: '2026-10-28T10:02:15.000Z',
    durationSeconds: 135,
  };

  it('1. Generates File A (resultados_ejercicios.csv) with attempt-level metrics and stable anonymous IDs', () => {
    const csv = generateExerciseResultsCsv([mockAttempt]);
    expect(csv).toContain('ID_Intento_Anonimo');
    expect(csv).toContain('PART-0001');
    expect(csv).toContain('ex-01');
    expect(csv).toContain('Notificación de seguridad de cuenta institucional');
    expect(csv).toContain('CORRECTO');
    expect(csv).toContain('61.1');
    expect(csv).toContain('135');
  });

  it('2. Generates File B (resultados_indicios.csv) with granular clue decisions (TP, FP, FN, TN)', () => {
    const csv = generateClueResultsCsv([mockAttempt], [testExercise]);
    expect(csv).toContain('ID_Intento_Anonimo,ID_Intento_Unico,ID_Ejercicio');
    expect(csv).toContain('PART-0001');
    expect(csv).toContain('ex-01-meta-sender-address');
    expect(csv).toContain('Acierto');
    expect(csv).toContain('TP');
    expect(csv).toContain('Falsa_Alarma');
    expect(csv).toContain('FP');
    expect(csv).toContain('Omision');
    expect(csv).toContain('FN');
    expect(csv).toContain('Neutro_Correcto');
    expect(csv).toContain('TN');
  });

  it('3. Generates File C (resumen_indicios.csv) with explicit denominators and rates', () => {
    const summaryList = calculateCluesSummary([mockAttempt], [testExercise]);
    expect(summaryList.length).toBeGreaterThan(0);

    const senderClue = summaryList.find((c) => c.elementId === 'ex-01-meta-sender-address');
    expect(senderClue).toBeDefined();
    expect(senderClue!.totalExposed).toBe(1);
    expect(senderClue!.totalTP).toBe(1);
    expect(senderClue!.recognitionRatePct).toBe(100);

    const csv = generateClueSummaryCsv([mockAttempt], [testExercise]);
    expect(csv).toContain('ID_Ejercicio,Titulo_Ejercicio,ID_Indicio');
    expect(csv).toContain('ex-01-meta-sender-address');
    expect(csv).toContain('Tasa_Reconocimiento_Pct');
    expect(csv).toContain('Denominador_Respuestas_Validas');
  });

  it('4. Realiza prueba E2E: responde ejercicio real, selecciona aciertos, omisiones y falsa alarma, verificando coherencia de totales', () => {
    // We evaluate with testExercise directly using ExerciseEvaluator
    const allElements = ExerciseEvaluator.getAllEvaluableElements(testExercise);
    const clueElements = allElements.filter((e) => e.isRelevantClue);
    const neutralElements = allElements.filter((e) => !e.isRelevantClue);

    expect(clueElements.length).toBeGreaterThan(0);
    expect(neutralElements.length).toBeGreaterThan(0);

    // Pick:
    // 2 real clues (TP)
    const tpClues = clueElements.slice(0, 2).map((e) => e.id);
    // 1 neutral element mistakenly chosen (FP)
    const fpElements = neutralElements.slice(0, 1).map((e) => e.id);
    // User selection is TP + FP
    const userSelection = [...tpClues, ...fpElements];

    const evaluatedMetrics = ExerciseEvaluator.evaluate(
      testExercise,
      'phishing',
      userSelection
    );

    expect(evaluatedMetrics.tp).toBe(2);
    expect(evaluatedMetrics.fp).toBe(1);
    expect(evaluatedMetrics.fn).toBe(clueElements.length - 2);
    expect(evaluatedMetrics.tn).toBe(neutralElements.length - 1);

    const fullAttempt: ExerciseAttempt = {
      id: 'att-e2e-001',
      exerciseId: testExercise.id,
      exerciseTitle: testExercise.title,
      referenceClassification: testExercise.referenceClassification,
      selectedClassification: 'phishing',
      selectedElementIds: userSelection,
      metrics: evaluatedMetrics,
      startedAt: '2026-10-28T12:00:00.000Z',
      completedAt: '2026-10-28T12:02:00.000Z',
      durationSeconds: 120,
    };

    // Generate CSVs
    const csvExercises = generateExerciseResultsCsv([fullAttempt]);
    const csvClues = generateClueResultsCsv([fullAttempt], [testExercise]);
    const csvSummary = generateClueSummaryCsv([fullAttempt], [testExercise]);

    // Check File A
    expect(csvExercises).toContain('PART-0001');
    expect(csvExercises).toContain('ex-01');

    // Check File B: count occurrences of TP, FP, FN, TN in the CSV rows
    const clueRows = csvClues.split('\r\n').slice(1).filter(Boolean);
    expect(clueRows.length).toBe(allElements.length);

    let countTP = 0;
    let countFP = 0;
    let countFN = 0;
    let countTN = 0;

    clueRows.forEach((row) => {
      if (row.includes(',"TP",') || row.includes(',"Acierto",')) countTP++;
      if (row.includes(',"FP",') || row.includes(',"Falsa_Alarma",')) countFP++;
      if (row.includes(',"FN",') || row.includes(',"Omision",')) countFN++;
      if (row.includes(',"TN",') || row.includes(',"Neutro_Correcto",')) countTN++;
    });

    expect(countTP).toBe(evaluatedMetrics.tp);
    expect(countFP).toBe(evaluatedMetrics.fp);
    expect(countFN).toBe(evaluatedMetrics.fn);
    expect(countTN).toBe(evaluatedMetrics.tn);
    expect(countTP + countFP + countFN + countTN).toBe(allElements.length);

    // Check File C: summary metrics
    const summaryItems = calculateCluesSummary([fullAttempt], [testExercise]);
    const sumTP = summaryItems.reduce((acc, item) => acc + item.totalTP, 0);
    const sumFP = summaryItems.reduce((acc, item) => acc + item.totalFP, 0);
    const sumFN = summaryItems.reduce((acc, item) => acc + item.totalFN, 0);
    const sumTN = summaryItems.reduce((acc, item) => acc + item.totalTN, 0);

    expect(sumTP).toBe(evaluatedMetrics.tp);
    expect(sumFP).toBe(evaluatedMetrics.fp);
    expect(sumFN).toBe(evaluatedMetrics.fn);
    expect(sumTN).toBe(evaluatedMetrics.tn);
    expect(csvSummary).toContain('Denominador_Respuestas_Validas');
  });
});
