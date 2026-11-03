import { ExerciseAttempt } from '../../domain/types/attempt.ts';
import { Exercise } from '../../domain/types/exercise.ts';
import { ElementEvaluationDetail } from '../../domain/types/evaluation.ts';
import { ExerciseEvaluator } from '../../domain/services/evaluator.ts';

export function escapeCsvField(val: string | number | boolean | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const stringVal = String(val);
  if (
    stringVal.includes(',') ||
    stringVal.includes('"') ||
    stringVal.includes('\n') ||
    stringVal.includes('\r') ||
    stringVal.includes(';')
  ) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return `"${stringVal}"`;
}

/**
 * Creates anonymous sequential IDs for attempts (e.g. PART-0001)
 * based on earliest completion date.
 */
export function buildAnonymousIdMap(attempts: ExerciseAttempt[]): Map<string, string> {
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );
  const map = new Map<string, string>();
  sorted.forEach((att, idx) => {
    map.set(att.id, `PART-${String(idx + 1).padStart(4, '0')}`);
  });
  return map;
}

/**
 * Helper to ensure every attempt has its full elementDetails array.
 * If an attempt was stored in older format, reconstructs the details deterministically.
 */
export function getAttemptElementDetails(
  att: ExerciseAttempt,
  exerciseMap: Map<string, Exercise>
): ElementEvaluationDetail[] {
  if (att.metrics.elementDetails && att.metrics.elementDetails.length > 0) {
    return att.metrics.elementDetails;
  }

  const exercise = exerciseMap.get(att.exerciseId);
  if (!exercise) return [];

  const allElements = ExerciseEvaluator.getAllEvaluableElements(exercise);
  const selectedSet = new Set(att.selectedElementIds || []);

  return allElements.map((el) => {
    const isSelected = selectedSet.has(el.id);
    const isClue = el.isRelevantClue;

    let resultType: 'TP' | 'FP' | 'FN' | 'TN';
    let evaluationStatus: 'Acierto' | 'Falsa_Alarma' | 'Omision' | 'Neutro_Correcto';

    if (isClue && isSelected) {
      resultType = 'TP';
      evaluationStatus = 'Acierto';
    } else if (!isClue && isSelected) {
      resultType = 'FP';
      evaluationStatus = 'Falsa_Alarma';
    } else if (isClue && !isSelected) {
      resultType = 'FN';
      evaluationStatus = 'Omision';
    } else {
      resultType = 'TN';
      evaluationStatus = 'Neutro_Correcto';
    }

    return {
      elementId: el.id,
      text: el.text,
      type: el.type,
      category: el.category || 'contextual',
      subcategory: el.subcategory || 'texto_ordinario',
      isRelevantClue: isClue,
      isSelected,
      resultType,
      evaluationStatus,
      explanation: el.explanation,
    };
  });
}

function translateCategory(cat: string): string {
  switch (cat) {
    case 'linguistic':
      return 'Lingüística';
    case 'visual':
      return 'Visual';
    case 'contextual':
      return 'Contextual';
    default:
      return cat;
  }
}

/**
 * ARCHIVO A: resultados_ejercicios.csv
 * 1 fila por intento y ejercicio.
 */
export function generateExerciseResultsCsv(attempts: ExerciseAttempt[]): string {
  const idMap = buildAnonymousIdMap(attempts);

  const headers = [
    'ID_Intento_Anonimo',
    'ID_Intento_Unico',
    'ID_Ejercicio',
    'Titulo_Ejercicio',
    'Clasificacion_Seleccionada',
    'Clasificacion_Referencia',
    'Clasificacion_Correcta',
    'Verdaderos_Positivos_TP',
    'Falsos_Positivos_FP',
    'Falsos_Negativos_FN',
    'Verdaderos_Negativos_TN',
    'Precision_Indicios',
    'Recall_Indicios',
    'F1_Score_Indicios',
    'Puntaje_Indicios',
    'Puntaje_Clasificacion',
    'Puntaje_Final',
    'Duracion_Segundos',
    'Fecha_Inicio',
    'Fecha_Finalizacion',
  ];

  const rows = attempts.map((att) => {
    const anonId = idMap.get(att.id) || 'PART-0000';
    return [
      escapeCsvField(anonId),
      escapeCsvField(att.id),
      escapeCsvField(att.exerciseId),
      escapeCsvField(att.exerciseTitle),
      escapeCsvField(att.selectedClassification),
      escapeCsvField(att.referenceClassification),
      escapeCsvField(att.metrics.isClassificationCorrect ? 'CORRECTO' : 'INCORRECTO'),
      escapeCsvField(att.metrics.tp),
      escapeCsvField(att.metrics.fp),
      escapeCsvField(att.metrics.fn),
      escapeCsvField(att.metrics.tn),
      escapeCsvField(att.metrics.precision.toFixed(4)),
      escapeCsvField(att.metrics.recall.toFixed(4)),
      escapeCsvField(att.metrics.f1.toFixed(4)),
      escapeCsvField(att.metrics.cluesScore.toFixed(1)),
      escapeCsvField(att.metrics.classificationScore.toFixed(1)),
      escapeCsvField(att.metrics.finalScore.toFixed(1)),
      escapeCsvField(att.durationSeconds),
      escapeCsvField(att.startedAt),
      escapeCsvField(att.completedAt),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * ARCHIVO B: resultados_indicios.csv
 * 1 fila por cada combinación de intento e indicio evaluado.
 */
export function generateClueResultsCsv(
  attempts: ExerciseAttempt[],
  exercises: Exercise[]
): string {
  const idMap = buildAnonymousIdMap(attempts);
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

  const headers = [
    'ID_Intento_Anonimo',
    'ID_Intento_Unico',
    'ID_Ejercicio',
    'Titulo_Ejercicio',
    'ID_Indicio',
    'Texto_Elemento',
    'Tipo_Elemento',
    'Categoria_Indicio',
    'Subcategoria_Indicio',
    'Es_Indicio_Relevante_Referencia',
    'Seleccionado_Por_Participante',
    'Estado_Evaluacion',
    'Tipo_Resultado',
    'Explicacion_Pedagogica',
    'Clasificacion_General_Ejercicio',
    'Acierto_Clasificacion_General',
    'Fecha_Finalizacion',
  ];

  const rows: string[] = [];

  attempts.forEach((att) => {
    const anonId = idMap.get(att.id) || 'PART-0000';
    const details = getAttemptElementDetails(att, exerciseMap);

    details.forEach((item) => {
      rows.push(
        [
          escapeCsvField(anonId),
          escapeCsvField(att.id),
          escapeCsvField(att.exerciseId),
          escapeCsvField(att.exerciseTitle),
          escapeCsvField(item.elementId),
          escapeCsvField(item.text),
          escapeCsvField(item.type),
          escapeCsvField(translateCategory(item.category)),
          escapeCsvField(item.subcategory),
          escapeCsvField(item.isRelevantClue ? 'SI' : 'NO'),
          escapeCsvField(item.isSelected ? 'SI' : 'NO'),
          escapeCsvField(item.evaluationStatus),
          escapeCsvField(item.resultType),
          escapeCsvField(item.explanation || ''),
          escapeCsvField(att.selectedClassification),
          escapeCsvField(att.metrics.isClassificationCorrect ? 'CORRECTO' : 'INCORRECTO'),
          escapeCsvField(att.completedAt),
        ].join(',')
      );
    });
  });

  return [headers.join(','), ...rows].join('\r\n');
}

export interface ClueSummaryItem {
  exerciseId: string;
  exerciseTitle: string;
  elementId: string;
  text: string;
  type: string;
  category: string;
  subcategory: string;
  isRelevantClue: boolean;
  totalExposed: number;
  totalSelected: number;
  totalTP: number;
  totalFN: number;
  totalFP: number;
  totalTN: number;
  recognitionRatePct: number;
  omissionRatePct: number;
  falseAlarmRatePct: number;
  explanation: string;
}

/**
 * Calculates aggregate stats per clue/element across attempts.
 */
export function calculateCluesSummary(
  attempts: ExerciseAttempt[],
  exercises: Exercise[]
): ClueSummaryItem[] {
  const summary: ClueSummaryItem[] = [];
  const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

  exercises.forEach((ex) => {
    const allElements = ExerciseEvaluator.getAllEvaluableElements(ex);
    const exerciseAttempts = attempts.filter((a) => a.exerciseId === ex.id);
    const totalExposed = exerciseAttempts.length;

    allElements.forEach((el) => {
      let totalSelected = 0;
      let totalTP = 0;
      let totalFN = 0;
      let totalFP = 0;
      let totalTN = 0;

      exerciseAttempts.forEach((att) => {
        const details = getAttemptElementDetails(att, exerciseMap);
        const match = details.find((d) => d.elementId === el.id);
        const isSelected = match ? match.isSelected : (att.selectedElementIds || []).includes(el.id);

        if (isSelected) totalSelected++;

        if (el.isRelevantClue) {
          if (isSelected) totalTP++;
          else totalFN++;
        } else {
          if (isSelected) totalFP++;
          else totalTN++;
        }
      });

      const recognitionRatePct =
        totalExposed > 0
          ? el.isRelevantClue
            ? (totalTP / totalExposed) * 100
            : (totalTN / totalExposed) * 100
          : 0;

      const omissionRatePct =
        totalExposed > 0 && el.isRelevantClue ? (totalFN / totalExposed) * 100 : 0;

      const falseAlarmRatePct =
        totalExposed > 0 && !el.isRelevantClue ? (totalFP / totalExposed) * 100 : 0;

      summary.push({
        exerciseId: ex.id,
        exerciseTitle: ex.title,
        elementId: el.id,
        text: el.text,
        type: el.type,
        category: translateCategory(el.category || 'contextual'),
        subcategory: el.subcategory || 'texto_ordinario',
        isRelevantClue: el.isRelevantClue,
        totalExposed,
        totalSelected,
        totalTP,
        totalFN,
        totalFP,
        totalTN,
        recognitionRatePct,
        omissionRatePct,
        falseAlarmRatePct,
        explanation: el.explanation || '',
      });
    });
  });

  return summary;
}

/**
 * ARCHIVO C: resumen_indicios.csv
 * Estadísticas consolidadas por indicio y categoría.
 */
export function generateClueSummaryCsv(
  attempts: ExerciseAttempt[],
  exercises: Exercise[]
): string {
  const summaryItems = calculateCluesSummary(attempts, exercises);

  const headers = [
    'ID_Ejercicio',
    'Titulo_Ejercicio',
    'ID_Indicio',
    'Texto_Elemento',
    'Tipo_Elemento',
    'Categoria_Indicio',
    'Subcategoria_Indicio',
    'Es_Indicio_Relevante_Referencia',
    'Total_Participantes_Expuestos',
    'Total_Veces_Seleccionado',
    'Total_Aciertos_TP',
    'Total_Omisiones_FN',
    'Total_Falsas_Alarmas_FP',
    'Total_Neutro_Correcto_TN',
    'Tasa_Reconocimiento_Pct',
    'Tasa_Omision_Pct',
    'Tasa_Falsa_Alarma_Pct',
    'Denominador_Respuestas_Validas',
    'Explicacion_Pedagogica',
  ];

  const rows = summaryItems.map((item) => {
    return [
      escapeCsvField(item.exerciseId),
      escapeCsvField(item.exerciseTitle),
      escapeCsvField(item.elementId),
      escapeCsvField(item.text),
      escapeCsvField(item.type),
      escapeCsvField(item.category),
      escapeCsvField(item.subcategory),
      escapeCsvField(item.isRelevantClue ? 'SI' : 'NO'),
      escapeCsvField(item.totalExposed),
      escapeCsvField(item.totalSelected),
      escapeCsvField(item.totalTP),
      escapeCsvField(item.totalFN),
      escapeCsvField(item.totalFP),
      escapeCsvField(item.totalTN),
      escapeCsvField(item.recognitionRatePct.toFixed(2)),
      escapeCsvField(item.omissionRatePct.toFixed(2)),
      escapeCsvField(item.falseAlarmRatePct.toFixed(2)),
      escapeCsvField(item.totalExposed),
      escapeCsvField(item.explanation),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Helpers for in-browser file downloads
 */
function downloadFile(content: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadExerciseResultsCsv(attempts: ExerciseAttempt[]): void {
  const dateTag = new Date().toISOString().slice(0, 10);
  const content = generateExerciseResultsCsv(attempts);
  downloadFile(content, `resultados_ejercicios_${dateTag}.csv`);
}

export function downloadClueResultsCsv(attempts: ExerciseAttempt[], exercises: Exercise[]): void {
  const dateTag = new Date().toISOString().slice(0, 10);
  const content = generateClueResultsCsv(attempts, exercises);
  downloadFile(content, `resultados_indicios_${dateTag}.csv`);
}

export function downloadClueSummaryCsv(attempts: ExerciseAttempt[], exercises: Exercise[]): void {
  const dateTag = new Date().toISOString().slice(0, 10);
  const content = generateClueSummaryCsv(attempts, exercises);
  downloadFile(content, `resumen_indicios_${dateTag}.csv`);
}

export function downloadAllCsvFiles(attempts: ExerciseAttempt[], exercises: Exercise[]): void {
  downloadExerciseResultsCsv(attempts);
  setTimeout(() => {
    downloadClueResultsCsv(attempts, exercises);
  }, 200);
  setTimeout(() => {
    downloadClueSummaryCsv(attempts, exercises);
  }, 400);
}

// Backwards compatibility alias
export const generateAttemptsCsv = generateExerciseResultsCsv;
export const downloadAttemptsCsv = downloadExerciseResultsCsv;
