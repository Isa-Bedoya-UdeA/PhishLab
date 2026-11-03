import { ExerciseAttempt, DashboardStats } from '../../domain/types/attempt.ts';
import { safeStorage, STORAGE_KEYS } from '../storage/localStorage.ts';

export interface IAttemptRepository {
  getAllAttempts(): Promise<ExerciseAttempt[]>;
  getAttemptsByExercise(exerciseId: string): Promise<ExerciseAttempt[]>;
  getLatestAttemptForExercise(exerciseId: string): Promise<ExerciseAttempt | null>;
  saveAttempt(attempt: ExerciseAttempt): Promise<void>;
  getDashboardStats(totalAvailableExercises: number): Promise<DashboardStats>;
  clearAllAttempts(): Promise<void>;
}

export class AttemptRepository implements IAttemptRepository {
  public async getAllAttempts(): Promise<ExerciseAttempt[]> {
    const rawAttempts = safeStorage.getItem<ExerciseAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    // Sort descending by completion date
    return [...rawAttempts].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  public async getAttemptsByExercise(exerciseId: string): Promise<ExerciseAttempt[]> {
    const all = await this.getAllAttempts();
    return all.filter((a) => a.exerciseId === exerciseId);
  }

  public async getLatestAttemptForExercise(exerciseId: string): Promise<ExerciseAttempt | null> {
    const attempts = await this.getAttemptsByExercise(exerciseId);
    return attempts.length > 0 ? attempts[0] : null;
  }

  public async saveAttempt(attempt: ExerciseAttempt): Promise<void> {
    const all = await this.getAllAttempts();
    all.unshift(attempt);
    safeStorage.setItem(STORAGE_KEYS.ATTEMPTS, all);
  }

  public async clearAllAttempts(): Promise<void> {
    safeStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  }

  public async getDashboardStats(totalAvailableExercises: number): Promise<DashboardStats> {
    const attempts = await this.getAllAttempts();

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        completedExercisesCount: 0,
        uniqueCompletedCount: 0,
        accuracyRate: 0,
        averageCluesScore: 0,
        averageFinalScore: 0,
        lastAttempt: null,
        frequentErrors: {
          falsePositivesCount: 0,
          falseNegativesCount: 0,
          insufficientMisclassified: 0,
          averageIrrelevantElementsSelected: 0,
          averageCluesMissed: 0,
        },
        categoryAverages: {
          linguisticRecall: 0,
          visualRecall: 0,
          contextualRecall: 0,
        },
      };
    }

    const uniqueCompleted = new Set(attempts.map((a) => a.exerciseId));
    const correctClassifications = attempts.filter((a) => a.metrics.isClassificationCorrect).length;
    const accuracyRate = (correctClassifications / attempts.length) * 100;

    const sumCluesScore = attempts.reduce((acc, a) => acc + a.metrics.cluesScore, 0);
    const sumFinalScore = attempts.reduce((acc, a) => acc + a.metrics.finalScore, 0);

    const averageCluesScore = sumCluesScore / attempts.length;
    const averageFinalScore = sumFinalScore / attempts.length;

    // Error patterns
    let falsePositivesCount = 0; // legit classified as phishing
    let falseNegativesCount = 0; // phishing classified as legit
    let insufficientMisclassified = 0;
    let totalFpWords = 0;
    let totalFnWords = 0;

    let lingRecallSum = 0;
    let visRecallSum = 0;
    let ctxRecallSum = 0;

    for (const att of attempts) {
      if (att.referenceClassification === 'legitimate' && att.selectedClassification === 'phishing') {
        falsePositivesCount++;
      } else if (att.referenceClassification === 'phishing' && att.selectedClassification === 'legitimate') {
        falseNegativesCount++;
      } else if (att.referenceClassification === 'insufficient_information' && att.selectedClassification !== 'insufficient_information') {
        insufficientMisclassified++;
      }

      totalFpWords += att.metrics.fp;
      totalFnWords += att.metrics.fn;

      lingRecallSum += att.metrics.categoryBreakdown.linguistic.recall;
      visRecallSum += att.metrics.categoryBreakdown.visual.recall;
      ctxRecallSum += att.metrics.categoryBreakdown.contextual.recall;
    }

    return {
      totalAttempts: attempts.length,
      completedExercisesCount: totalAvailableExercises,
      uniqueCompletedCount: uniqueCompleted.size,
      accuracyRate,
      averageCluesScore,
      averageFinalScore,
      lastAttempt: attempts[0],
      frequentErrors: {
        falsePositivesCount,
        falseNegativesCount,
        insufficientMisclassified,
        averageIrrelevantElementsSelected: totalFpWords / attempts.length,
        averageCluesMissed: totalFnWords / attempts.length,
      },
      categoryAverages: {
        linguisticRecall: (lingRecallSum / attempts.length) * 100,
        visualRecall: (visRecallSum / attempts.length) * 100,
        contextualRecall: (ctxRecallSum / attempts.length) * 100,
      },
    };
  }
}

export const attemptRepository = new AttemptRepository();
