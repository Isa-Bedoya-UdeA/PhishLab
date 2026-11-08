import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Info,
} from 'lucide-react';
import { Exercise, MessageClassification } from '../../domain/types/exercise.ts';
import { ExerciseMetrics } from '../../domain/types/evaluation.ts';
import { ExerciseAttempt } from '../../domain/types/attempt.ts';
import { ExerciseEvaluator } from '../../domain/services/evaluator.ts';
import { attemptRepository } from '../../infrastructure/repositories/AttemptRepository.ts';
import { exerciseRepository } from '../../infrastructure/repositories/ExerciseRepository.ts';
import { EmailViewer } from '../../components/email/EmailViewer.tsx';
import { ClassificationBar } from '../../components/email/ClassificationBar.tsx';
import { EvaluationSummary } from '../../components/feedback/EvaluationSummary.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { triggerCompletionConfetti } from '../../shared/utils/confetti.ts';

export interface ExerciseViewProps {
  exerciseId: string;
  onSelectExercise: (id: string) => void;
  onBackToInbox: () => void;
  onGoToDashboard: () => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  exerciseId,
  onSelectExercise,
  onBackToInbox,
  onGoToDashboard,
}) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [nextExercise, setNextExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // User responses
  const [selectedElementIds, setSelectedElementIds] = useState<Set<string>>(new Set());
  const [selectedClassification, setSelectedClassification] =
    useState<MessageClassification | null>(null);

  // Evaluation state
  const [metrics, setMetrics] = useState<ExerciseMetrics | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>(new Date().toISOString());

  // Review mode toggle (switch between viewing the email highlights and the summary card)
  const [activeTab, setActiveTab] = useState<'email' | 'summary'>('email');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      const ex = await exerciseRepository.getById(exerciseId);
      const next = await exerciseRepository.getNext(exerciseId);
      if (isMounted) {
        setExercise(ex);
        setNextExercise(next);
        setSelectedElementIds(new Set());
        setSelectedClassification(null);
        setMetrics(null);
        setActiveTab('email');
        setStartTime(new Date().toISOString());
        setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [exerciseId]);

  if (loading || !exercise) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-[#A7B5C7] space-y-3">
        <div className="w-8 h-8 border-2 border-[#35E0D0] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Cargando ejercicio de entrenamiento...</span>
      </div>
    );
  }

  const handleToggleElement = (id: string) => {
    if (metrics) return; // locked after evaluation
    setSelectedElementIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    if (metrics) return;
    setSelectedElementIds(new Set());
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedClassification || !exercise) return;
    setIsSubmitting(true);

    const evaluatedMetrics = ExerciseEvaluator.evaluate(
      exercise,
      selectedClassification,
      Array.from(selectedElementIds)
    );

    const completedAt = new Date().toISOString();
    const durationSeconds = Math.max(
      1,
      Math.round((new Date(completedAt).getTime() - new Date(startTime).getTime()) / 1000)
    );

    const attempt: ExerciseAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      referenceClassification: exercise.referenceClassification,
      selectedClassification,
      selectedElementIds: Array.from(selectedElementIds),
      metrics: evaluatedMetrics,
      startedAt: startTime,
      completedAt,
      durationSeconds,
    };

    await attemptRepository.saveAttempt(attempt);

    setMetrics(evaluatedMetrics);
    setActiveTab('summary');
    setIsSubmitting(false);

    if (evaluatedMetrics.finalScore >= 70) {
      triggerCompletionConfetti();
    }
  };

  const getDifficultyBadge = (diff: Exercise['difficulty']) => {
    switch (diff) {
      case 'beginner':
        return <span className="text-[#4ADE80] font-mono text-xs">Nivel inicial</span>;
      case 'intermediate':
        return <span className="text-[#FBBF24] font-mono text-xs">Nivel intermedio</span>;
      case 'advanced':
        return <span className="text-[#A78BFA] font-mono text-xs">Nivel avanzado</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Navigation & Scenario Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#263A50]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            icon={<ChevronLeft className="w-4 h-4" />}
            onClick={onBackToInbox}
          >
            Volver a la bandeja
          </Button>
          <span className="text-[#263A50] hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A7B5C7]">{getDifficultyBadge(exercise.difficulty)}</span>
            <span className="text-[#A7B5C7] text-xs">·</span>
            <span className="text-xs font-semibold text-[#F1F5F9] truncate">{exercise.title}</span>
          </div>
        </div>

        {metrics && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('summary')}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                activeTab === 'summary'
                  ? 'bg-[#35E0D0] text-[#08111F] border-[#35E0D0] font-bold'
                  : 'bg-[#122438] text-[#A7B5C7] border-[#263A50] hover:text-[#F1F5F9]'
              }`}
            >
              Ver resultados
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                activeTab === 'email'
                  ? 'bg-[#35E0D0] text-[#08111F] border-[#35E0D0] font-bold'
                  : 'bg-[#122438] text-[#A7B5C7] border-[#263A50] hover:text-[#F1F5F9]'
              }`}
            >
              Revisar mensaje interactivo
            </button>
          </div>
        )}
      </div>

      {/* Scenario Briefing Card */}
      <Card padding="md" className="bg-[#0D1B2A] border-[#263A50]/70">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#35E0D0]/10 border border-[#35E0D0]/30 flex items-center justify-center shrink-0 text-[#35E0D0] mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#35E0D0] block">
              Situación simulada
            </span>
            <p className="text-sm text-[#F1F5F9] leading-relaxed">{exercise.scenario}</p>
          </div>
        </div>
      </Card>

      {/* View Switch: Summary or Email */}
      {metrics && activeTab === 'summary' ? (
        <EvaluationSummary
          exercise={exercise}
          userClassification={selectedClassification!}
          metrics={metrics}
          onNextExercise={() => nextExercise && onSelectExercise(nextExercise.id)}
          onReviewEmail={() => setActiveTab('email')}
          onGoToDashboard={onGoToDashboard}
          hasNextExercise={Boolean(nextExercise)}
        />
      ) : (
        <div className="space-y-6">
          {/* Main Interactive Email Viewer */}
          <EmailViewer
            exercise={exercise}
            selectedElementIds={selectedElementIds}
            onToggleElement={handleToggleElement}
            onClearSelection={handleClearSelection}
            metrics={metrics}
          />

          {/* Classification & Submission Bar (Only active before submission) */}
          <ClassificationBar
            selectedClassification={selectedClassification}
            onSelectClassification={setSelectedClassification}
            onSubmit={handleSubmitEvaluation}
            isSubmitted={metrics !== null}
            disabled={isSubmitting}
            selectedCluesCount={selectedElementIds.size}
          />
        </div>
      )}
    </div>
  );
};
