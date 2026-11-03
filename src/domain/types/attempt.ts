import { MessageClassification } from './exercise.ts';
import { ExerciseMetrics } from './evaluation.ts';

export interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  referenceClassification: MessageClassification;
  selectedClassification: MessageClassification;
  selectedElementIds: string[];
  metrics: ExerciseMetrics;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
}

export interface DashboardStats {
  totalAttempts: number;
  completedExercisesCount: number;
  uniqueCompletedCount: number;
  accuracyRate: number; // percentage (0 - 100) or null if no attempts
  averageCluesScore: number; // 0 - 100
  averageFinalScore: number; // 0 - 100
  lastAttempt: ExerciseAttempt | null;
  frequentErrors: {
    falsePositivesCount: number; // User classified legit as phishing
    falseNegativesCount: number; // User classified phishing as legit
    insufficientMisclassified: number; // User missed or mislabeled insufficient_info
    averageIrrelevantElementsSelected: number;
    averageCluesMissed: number;
  };
  categoryAverages: {
    linguisticRecall: number;
    visualRecall: number;
    contextualRecall: number;
  };
}
