import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, Eye, Tag, FileText } from 'lucide-react';
import { Exercise, SignalCategory } from '../../domain/types/exercise.ts';
import { ExerciseMetrics } from '../../domain/types/evaluation.ts';
import { Badge } from '../ui/Badge.tsx';

export interface SignalsBreakdownProps {
  exercise: Exercise;
  metrics: ExerciseMetrics;
}

export const SignalsBreakdown: React.FC<SignalsBreakdownProps> = ({ exercise, metrics }) => {
  const getCategoryBadge = (category: SignalCategory) => {
    switch (category) {
      case 'linguistic':
        return <Badge variant="lilac" size="sm" icon={<FileText className="w-3 h-3" />}>Lingüística</Badge>;
      case 'contextual':
        return <Badge variant="turquoise" size="sm" icon={<Tag className="w-3 h-3" />}>Contextual</Badge>;
      case 'visual':
        return <Badge variant="warning" size="sm" icon={<Eye className="w-3 h-3" />}>Visual</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-[#263A50] pb-2">
        <h3 className="text-base font-bold text-[#F1F5F9]">
          Análisis detallado de indicios del ejercicio
        </h3>
        <p className="text-xs text-[#A7B5C7]">
          Identificación de las evidencias y su relevancia pedagógica según la referencia del caso.
        </p>
      </div>

      <div className="space-y-3">
        {exercise.signals.map((signal, idx) => {
          // Check how many of the signal elements the user identified
          const matchingElements = signal.elementIds.filter((id) =>
            metrics.correctElementIds.includes(id)
          );
          const totalInSignal = signal.elementIds.length;
          const isFullyDetected = totalInSignal > 0 && matchingElements.length === totalInSignal;
          const isPartiallyDetected = matchingElements.length > 0 && !isFullyDetected;

          return (
            <div
              key={idx}
              className="bg-[#0D1B2A] border border-[#263A50] rounded-xl p-4 space-y-2.5 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getCategoryBadge(signal.category)}
                  <span className="font-semibold text-sm text-[#F1F5F9]">{signal.title}</span>
                </div>

                {totalInSignal > 0 && (
                  <div>
                    {isFullyDetected ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#4ADE80] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Detectado ({matchingElements.length}/{totalInSignal})</span>
                      </span>
                    ) : isPartiallyDetected ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#FBBF24] font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Parcial ({matchingElements.length}/{totalInSignal})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-[#FB7185] font-medium">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Omitido (0/{totalInSignal})</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              <p className="text-xs text-[#A7B5C7] leading-relaxed">{signal.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
