import { MessageClassification, SignalCategory, EmailElementType } from './exercise.ts';

export type ClueResultType = 'TP' | 'FP' | 'FN' | 'TN';
export type ClueEvaluationStatus = 'Acierto' | 'Falsa_Alarma' | 'Omision' | 'Neutro_Correcto';

export interface ElementEvaluationDetail {
  elementId: string;
  text: string;
  type: EmailElementType;
  category: SignalCategory;
  subcategory: string;
  isRelevantClue: boolean;
  isSelected: boolean;
  resultType: ClueResultType;
  evaluationStatus: ClueEvaluationStatus;
  explanation?: string;
}

export interface CategoryMetrics {
  category: SignalCategory;
  totalClues: number;
  identifiedClues: number;
  missedClues: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface ExerciseMetrics {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  totalElements: number;
  totalClues: number;
  selectedCount: number;
  precision: number;
  recall: number;
  f1: number;
  cluesScore: number; // 0 - 100
  isClassificationCorrect: boolean;
  classificationScore: number; // 0 or 100
  finalScore: number; // 0.70 * cluesScore + 0.30 * classificationScore
  correctElementIds: string[]; // TP
  missedElementIds: string[]; // FN
  incorrectElementIds: string[]; // FP
  categoryBreakdown: Record<SignalCategory, CategoryMetrics>;
  elementDetails: ElementEvaluationDetail[];
}

export interface EvaluatorInput {
  exerciseId: string;
  userClassification: MessageClassification;
  selectedElementIds: string[];
}
