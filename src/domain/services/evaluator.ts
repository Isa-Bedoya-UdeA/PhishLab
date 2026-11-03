import { Exercise, SignalCategory, EmailElement } from '../types/exercise.ts';
import {
  ExerciseMetrics,
  CategoryMetrics,
  ElementEvaluationDetail,
  ClueResultType,
  ClueEvaluationStatus,
} from '../types/evaluation.ts';
import { MessageClassification } from '../types/exercise.ts';

/**
 * Pure, deterministic evaluation engine for PhishLab.
 * Implements the exact formulas defined in the research project specifications.
 */
export class ExerciseEvaluator {
  /**
   * Collects all unique evaluable elements from an exercise
   */
  public static getAllEvaluableElements(exercise: Exercise): EmailElement[] {
    const elementMap = new Map<string, EmailElement>();

    // 1. Metadata elements
    for (const el of exercise.metadataElements) {
      elementMap.set(el.id, el);
    }

    // 2. Body elements
    for (const el of exercise.bodyElements) {
      elementMap.set(el.id, el);
    }

    // 3. Apparent links
    for (const link of exercise.apparentLinks) {
      if (!elementMap.has(link.elementId)) {
        elementMap.set(link.elementId, {
          id: link.elementId,
          text: link.label || link.displayedUrl,
          type: 'link',
          category: link.category || 'contextual',
          subcategory:
            link.subcategory ||
            (link.isRelevantClue ? 'enlace_sospechoso' : 'enlace_institucional_legitimo'),
          isRelevantClue: link.isRelevantClue ?? false,
          explanation: link.explanation,
        });
      }
    }

    // 4. Attachments
    for (const att of exercise.attachments) {
      if (!elementMap.has(att.elementId)) {
        elementMap.set(att.elementId, {
          id: att.elementId,
          text: att.name,
          type: 'attachment',
          category: att.category || 'contextual',
          subcategory:
            att.subcategory ||
            (att.isRelevantClue ? 'adjunto_sospechoso' : 'adjunto_legitimo'),
          isRelevantClue: att.isRelevantClue ?? false,
          explanation: att.explanation,
        });
      }
    }

    return Array.from(elementMap.values());
  }

  /**
   * Evaluates user's classification and selected clues against exercise reference ground truth.
   */
  public static evaluate(
    exercise: Exercise,
    userClassification: MessageClassification,
    selectedElementIds: string[]
  ): ExerciseMetrics {
    const allElements = this.getAllEvaluableElements(exercise);
    const elementMap = new Map(allElements.map((el) => [el.id, el]));

    // S: User selection set (deduplicated)
    const S = new Set(selectedElementIds.filter((id) => elementMap.has(id)));

    // G: Ground truth relevant clues set
    const G = new Set<string>();
    for (const el of allElements) {
      if (el.isRelevantClue) {
        G.add(el.id);
      }
    }

    // U: Universal set of all evaluable elements
    const U = new Set(allElements.map((el) => el.id));

    // True Positives: elements in both S and G
    const correctElementIds: string[] = [];
    // False Positives: elements in S but not in G
    const incorrectElementIds: string[] = [];
    // False Negatives: elements in G but not in S
    const missedElementIds: string[] = [];

    for (const id of S) {
      if (G.has(id)) {
        correctElementIds.push(id);
      } else {
        incorrectElementIds.push(id);
      }
    }

    for (const id of G) {
      if (!S.has(id)) {
        missedElementIds.push(id);
      }
    }

    const tp = correctElementIds.length;
    const fp = incorrectElementIds.length;
    const fn = missedElementIds.length;
    const tn = U.size - (tp + fp + fn);

    // Build granular element evaluations
    const elementDetails: ElementEvaluationDetail[] = allElements.map((el) => {
      const isSelected = S.has(el.id);
      const isClue = el.isRelevantClue;

      let resultType: ClueResultType;
      let evaluationStatus: ClueEvaluationStatus;

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

    // Precision, Recall, and F1 calculations with rigorous zero-handling
    let precision = 0;
    let recall = 0;
    let f1 = 0;

    if (G.size === 0) {
      if (S.size === 0) {
        // Special case: no reference clues and user selected nothing (perfect response)
        precision = 1.0;
        recall = 1.0;
        f1 = 1.0;
      } else {
        // No reference clues, but user selected elements (all are false positives)
        precision = 0.0;
        recall = 0.0;
        f1 = 0.0;
      }
    } else {
      precision = tp + fp > 0 ? tp / (tp + fp) : 0.0;
      recall = tp + fn > 0 ? tp / (tp + fn) : 0.0;
      f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0.0;
    }

    // Ensure numeric safety (no NaN / Infinity)
    precision = Number.isFinite(precision) ? precision : 0;
    recall = Number.isFinite(recall) ? recall : 0;
    f1 = Number.isFinite(f1) ? f1 : 0;

    const cluesScore = Math.max(0, Math.min(100, f1 * 100));

    // Classification score: 100 if matches reference, 0 otherwise
    const isClassificationCorrect = userClassification === exercise.referenceClassification;
    const classificationScore = isClassificationCorrect ? 100 : 0;

    // Final score formula: 0.70 * P_indicios + 0.30 * P_clasificacion
    const finalScore = 0.7 * cluesScore + 0.3 * classificationScore;

    // Category breakdown calculation
    const categoryBreakdown = this.calculateCategoryBreakdown(allElements, S);

    return {
      tp,
      fp,
      fn,
      tn,
      totalElements: U.size,
      totalClues: G.size,
      selectedCount: S.size,
      precision,
      recall,
      f1,
      cluesScore,
      isClassificationCorrect,
      classificationScore,
      finalScore,
      correctElementIds,
      missedElementIds,
      incorrectElementIds,
      categoryBreakdown,
      elementDetails,
    };
  }

  private static calculateCategoryBreakdown(
    allElements: EmailElement[],
    selectedIds: Set<string>
  ): Record<SignalCategory, CategoryMetrics> {
    const categories: SignalCategory[] = ['linguistic', 'visual', 'contextual'];
    const result: Record<SignalCategory, CategoryMetrics> = {
      linguistic: { category: 'linguistic', totalClues: 0, identifiedClues: 0, missedClues: 0, precision: 0, recall: 0, f1: 0 },
      visual: { category: 'visual', totalClues: 0, identifiedClues: 0, missedClues: 0, precision: 0, recall: 0, f1: 0 },
      contextual: { category: 'contextual', totalClues: 0, identifiedClues: 0, missedClues: 0, precision: 0, recall: 0, f1: 0 },
    };

    for (const cat of categories) {
      const categoryElements = allElements.filter((el) => el.category === cat);
      const catClues = categoryElements.filter((el) => el.isRelevantClue);
      const totalClues = catClues.length;

      let tp = 0;
      let fp = 0;

      for (const el of categoryElements) {
        const isSelected = selectedIds.has(el.id);
        if (isSelected && el.isRelevantClue) {
          tp++;
        } else if (isSelected && !el.isRelevantClue) {
          fp++;
        }
      }

      const missed = totalClues - tp;
      const precision = tp + fp > 0 ? tp / (tp + fp) : (totalClues === 0 ? 1 : 0);
      const recall = totalClues > 0 ? tp / totalClues : 1;
      const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

      result[cat] = {
        category: cat,
        totalClues,
        identifiedClues: tp,
        missedClues: missed,
        precision: Number.isFinite(precision) ? precision : 0,
        recall: Number.isFinite(recall) ? recall : 0,
        f1: Number.isFinite(f1) ? f1 : 0,
      };
    }

    return result;
  }
}
