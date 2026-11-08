import React from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  LayoutDashboard,
  Lightbulb,
} from 'lucide-react';
import { Exercise, MessageClassification } from '../../domain/types/exercise.ts';
import { ExerciseMetrics } from '../../domain/types/evaluation.ts';
import { SignalsBreakdown } from './SignalsBreakdown.tsx';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';

export interface EvaluationSummaryProps {
  exercise: Exercise;
  userClassification: MessageClassification;
  metrics: ExerciseMetrics;
  onNextExercise: () => void;
  onReviewEmail: () => void;
  onGoToDashboard: () => void;
  hasNextExercise: boolean;
}

export const EvaluationSummary: React.FC<EvaluationSummaryProps> = ({
  exercise,
  userClassification,
  metrics,
  onNextExercise,
  onReviewEmail,
  onGoToDashboard,
  hasNextExercise,
}) => {
  const getClassificationLabel = (cls: MessageClassification) => {
    switch (cls) {
      case 'legitimate':
        return 'Mensaje legítimo';
      case 'phishing':
        return 'Sospechoso / Phishing';
      case 'insufficient_information':
        return 'Información insuficiente para decidir';
    }
  };

  const isClassCorrect = metrics.isClassificationCorrect;

  return (
    <div className="space-y-6">
      {/* Top Hero Result Card */}
      <Card
        padding="lg"
        className={`border-2 ${
          isClassCorrect ? 'border-[#4ADE80]/50 bg-[#0D1B2A]' : 'border-[#FB7185]/50 bg-[#0D1B2A]'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              {isClassCorrect ? (
                <div className="w-10 h-10 rounded-xl bg-[#4ADE80]/15 border border-[#4ADE80]/40 flex items-center justify-center text-[#4ADE80]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#FB7185]/15 border border-[#FB7185]/40 flex items-center justify-center text-[#FB7185]">
                  <XCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F1F5F9]">
                  {isClassCorrect
                    ? '¡Clasificación Acertada!'
                    : 'Clasificación Discrepante'}
                </h2>
                <p className="text-xs text-[#A7B5C7]">
                  Evaluación determinista basada en el análisis de indicios y contexto.
                </p>
              </div>
            </div>

            {/* Comparison Pill Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-[#122438] p-3 rounded-lg border border-[#263A50]">
                <span className="text-[#A7B5C7] block text-[11px] uppercase font-sans">
                  Tu clasificación
                </span>
                <span
                  className={`font-semibold text-sm ${
                    isClassCorrect ? 'text-[#4ADE80]' : 'text-[#FB7185]'
                  }`}
                >
                  {getClassificationLabel(userClassification)}
                </span>
              </div>
              <div className="bg-[#122438] p-3 rounded-lg border border-[#263A50]">
                <span className="text-[#A7B5C7] block text-[11px] uppercase font-sans">
                  Clasificación de referencia
                </span>
                <span className="font-semibold text-sm text-[#35E0D0]">
                  {getClassificationLabel(exercise.referenceClassification)}
                </span>
              </div>
            </div>
          </div>

          {/* Scores Badge Box */}
          <div className="bg-[#122438] border border-[#263A50] rounded-2xl p-5 flex flex-col items-center justify-center text-center shrink-0 min-w-[220px]">
            <span className="text-xs uppercase tracking-wider text-[#A7B5C7] font-semibold">
              Puntaje Final Ponderado
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold font-mono text-[#35E0D0] my-2 tabular-nums">
              {metrics.finalScore.toFixed(1)}
              <span className="text-base text-[#A7B5C7] font-sans font-normal">/100</span>
            </div>
            <div className="text-[11px] text-[#A7B5C7] space-y-0.5 pt-1 border-t border-[#263A50] w-full font-mono">
              <div className="flex justify-between">
                <span>Indicios (70%):</span>
                <span className="text-[#F1F5F9] font-bold">{metrics.cluesScore.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Clasificación (30%):</span>
                <span className="text-[#F1F5F9] font-bold">{metrics.classificationScore}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reference Explanation Prose */}
        <div className="mt-5 pt-4 border-t border-[#263A50] text-sm text-[#F1F5F9] leading-relaxed bg-[#08111F]/50 p-4 rounded-xl space-y-2">
          <span className="font-semibold text-[#35E0D0] block text-xs uppercase tracking-wider">
            Justificación metodológica de referencia
          </span>
          <p>{exercise.referenceExplanation}</p>

          <div className="pt-2 border-t border-[#263A50]/60 text-[11px] text-[#A7B5C7] leading-relaxed flex items-start gap-2">
            <span className="text-[#35E0D0] font-bold shrink-0">Claridad metodológica:</span>
            <span>
              El puntaje ponderado (70% detección de indicios + 30% clasificación global) es un índice experimental y pedagógico de esta investigación, no una certificación formal de competencia en ciberseguridad. Evalúa tu capacidad de fundamentar tus juicios mediante evidencias concretas.
            </span>
          </div>
        </div>
      </Card>

      {/* Confusion Matrix and Clues Detection Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detection Metrics */}
        <Card padding="md" className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#35E0D0] block">
            Métricas de detección de indicios
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#0D1B2A] p-3 rounded-lg border border-[#263A50]">
              <span className="text-[11px] text-[#A7B5C7] block">Precisión</span>
              <span className="text-lg font-mono font-bold text-[#F1F5F9] tabular-nums">
                {(metrics.precision * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-[#0D1B2A] p-3 rounded-lg border border-[#263A50]">
              <span className="text-[11px] text-[#A7B5C7] block">Recall (Cobertura)</span>
              <span className="text-lg font-mono font-bold text-[#F1F5F9] tabular-nums">
                {(metrics.recall * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-[#0D1B2A] p-3 rounded-lg border border-[#263A50]">
              <span className="text-[11px] text-[#A7B5C7] block">F1-Score</span>
              <span className="text-lg font-mono font-bold text-[#35E0D0] tabular-nums">
                {metrics.f1.toFixed(3)}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#A7B5C7] leading-relaxed">
            El F1-Score equilibra la precisión (no marcar palabras al azar) con el recall (identificar todos los indicios presentes).
          </p>
        </Card>

        {/* Confusion Matrix Grid */}
        <Card padding="md" className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A7B5C7] block">
            Matriz de confusión de elementos
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#0D1B2A] p-2.5 rounded-lg border border-[#4ADE80]/30 flex justify-between items-center">
              <div>
                <span className="font-semibold text-[#4ADE80] block">Verdaderos Positivos</span>
                <span className="text-[10px] text-[#A7B5C7]">Indicios detectados</span>
              </div>
              <span className="text-xl font-mono font-bold text-[#4ADE80] tabular-nums">
                {metrics.tp}
              </span>
            </div>
            <div className="bg-[#0D1B2A] p-2.5 rounded-lg border border-[#FB7185]/30 flex justify-between items-center">
              <div>
                <span className="font-semibold text-[#FB7185] block">Falsos Positivos</span>
                <span className="text-[10px] text-[#A7B5C7]">Selecciones irrelevantes</span>
              </div>
              <span className="text-xl font-mono font-bold text-[#FB7185] tabular-nums">
                {metrics.fp}
              </span>
            </div>
            <div className="bg-[#0D1B2A] p-2.5 rounded-lg border border-[#FBBF24]/30 flex justify-between items-center">
              <div>
                <span className="font-semibold text-[#FBBF24] block">Falsos Negativos</span>
                <span className="text-[10px] text-[#A7B5C7]">Indicios omitidos</span>
              </div>
              <span className="text-xl font-mono font-bold text-[#FBBF24] tabular-nums">
                {metrics.fn}
              </span>
            </div>
            <div className="bg-[#0D1B2A] p-2.5 rounded-lg border border-[#263A50] flex justify-between items-center">
              <div>
                <span className="font-semibold text-[#A7B5C7] block">Verdaderos Negativos</span>
                <span className="text-[10px] text-[#A7B5C7]">Elementos neutros</span>
              </div>
              <span className="text-xl font-mono font-bold text-[#F1F5F9] tabular-nums">
                {metrics.tn}
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-[#263A50]/60 text-[11px] text-[#A7B5C7] leading-relaxed">
            <strong className="text-[#F1F5F9]">Diferenciación conceptual:</strong> La clasificación global refleja tu juicio final, pero la matriz de indicios (TP, FP, FN, TN) mide tu habilidad analítica para fundamentar ese juicio en evidencias concretas y evitar tanto la ingenuidad como la paranoia indiscriminada.
          </div>
        </Card>
      </div>

      {/* Signals Detailed Breakdown */}
      <SignalsBreakdown exercise={exercise} metrics={metrics} />

      {/* Practical Recommendation Box */}
      <Card padding="md" className="bg-[#0D1B2A] border-[#35E0D0]/30">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#35E0D0]/10 border border-[#35E0D0]/30 flex items-center justify-center shrink-0 text-[#35E0D0] mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#35E0D0]">
              Recomendación práctica para la vida cotidiana
            </h4>
            <p className="text-xs sm:text-sm text-[#F1F5F9] leading-relaxed">
              {exercise.practicalRecommendation}
            </p>
          </div>
        </div>
      </Card>

      {/* Navigation Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#263A50]">
        <Button
          variant="secondary"
          size="md"
          icon={<RotateCcw className="w-4 h-4" />}
          onClick={onReviewEmail}
        >
          Revisar mensaje interactivo
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="md"
            icon={<LayoutDashboard className="w-4 h-4" />}
            onClick={onGoToDashboard}
          >
            Volver al Dashboard
          </Button>

          {hasNextExercise && (
            <Button
              variant="primary"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
              onClick={onNextExercise}
            >
              Siguiente ejercicio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
