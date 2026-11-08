import React from 'react';
import { Mail, Clock, Check, X, AlertCircle } from 'lucide-react';
import { Exercise } from '../../domain/types/exercise.ts';
import { ExerciseMetrics } from '../../domain/types/evaluation.ts';

export interface EmailHeadersProps {
  exercise: Exercise;
  selectedElementIds: Set<string>;
  onToggleElement: (id: string) => void;
  metrics: ExerciseMetrics | null;
}

export const EmailHeaders: React.FC<EmailHeadersProps> = ({
  exercise,
  selectedElementIds,
  onToggleElement,
  metrics,
}) => {
  const isEvaluated = metrics !== null;

  const senderNameEl = exercise.metadataElements.find((el) => el.type === 'sender_name');
  const senderAddressEl = exercise.metadataElements.find((el) => el.type === 'sender_address');
  const domainEl = exercise.metadataElements.find((el) => el.type === 'domain');
  const subjectEl = exercise.metadataElements.find((el) => el.type === 'subject');

  const renderSelectablePill = (
    id: string,
    text: string,
    label: string,
    explanation?: string
  ) => {
    const isSelected = selectedElementIds.has(id);
    const isTP = isEvaluated && metrics?.correctElementIds.includes(id);
    const isFP = isEvaluated && metrics?.incorrectElementIds.includes(id);
    const isFN = isEvaluated && metrics?.missedElementIds.includes(id);

    let stateClass =
      'border-[#263A50] bg-[#0D1B2A] text-[#F1F5F9] hover:border-[#35E0D0]/50 hover:bg-[#1A324C]';

    let icon: React.ReactNode = null;

    if (!isEvaluated) {
      if (isSelected) {
        stateClass = 'border-[#35E0D0] bg-[#35E0D0]/20 text-[#35E0D0] font-semibold ring-1 ring-[#35E0D0]';
      }
    } else {
      if (isTP) {
        stateClass = 'border-[#4ADE80] bg-[#4ADE80]/20 text-[#4ADE80] font-semibold';
        icon = <Check className="w-3.5 h-3.5 text-[#4ADE80]" />;
      } else if (isFP) {
        stateClass = 'border-[#FB7185] bg-[#FB7185]/20 text-[#FB7185] line-through';
        icon = <X className="w-3.5 h-3.5 text-[#FB7185]" />;
      } else if (isFN) {
        stateClass = 'border-[#FBBF24] border-dashed bg-[#FBBF24]/15 text-[#FBBF24]';
        icon = <AlertCircle className="w-3.5 h-3.5 text-[#FBBF24]" />;
      } else {
        stateClass = 'border-[#263A50] bg-[#0D1B2A] text-[#A7B5C7] opacity-80';
      }
    }

    return (
      <button
        type="button"
        role="button"
        aria-pressed={isSelected}
        aria-label={`${label}: ${text}`}
        title={explanation || `Clic para marcar ${label.toLowerCase()} como indicio`}
        onClick={() => !isEvaluated && onToggleElement(id)}
        disabled={isEvaluated}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-2.5 sm:py-1 text-xs rounded-lg border transition-all text-left max-w-full truncate cursor-pointer touch-manipulation active:scale-[0.98] min-h-[36px] sm:min-h-[30px] ${stateClass} ${
          isEvaluated ? 'cursor-default' : ''
        }`}
      >
        <span className="truncate">{text}</span>
        {icon}
      </button>
    );
  };

  return (
    <div className="bg-[#122438] border-b border-[#263A50] p-4 sm:p-5 space-y-3">
      {/* Subject Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#263A50]">
        <div className="flex items-center gap-2 max-w-full">
          <Mail className="w-5 h-5 text-[#35E0D0] shrink-0" />
          {subjectEl ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A7B5C7] font-mono shrink-0 hidden sm:inline">Asunto:</span>
              {renderSelectablePill(
                subjectEl.id,
                subjectEl.text,
                'Asunto',
                subjectEl.explanation
              )}
            </div>
          ) : (
            <h1 className="text-base sm:text-lg font-bold text-[#F1F5F9] truncate">
              {exercise.subject}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#A7B5C7] shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>{exercise.dateLabel}</span>
        </div>
      </div>

      {/* From and To Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* From */}
        <div className="space-y-1.5">
          <span className="text-[#A7B5C7] font-medium block">De (Remitente):</span>
          <div className="flex flex-wrap items-center gap-1.5">
            {senderNameEl &&
              renderSelectablePill(
                senderNameEl.id,
                senderNameEl.text,
                'Nombre del Remitente',
                senderNameEl.explanation
              )}
            {senderAddressEl &&
              renderSelectablePill(
                senderAddressEl.id,
                `<${senderAddressEl.text}>`,
                'Dirección de correo',
                senderAddressEl.explanation
              )}
            {domainEl && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[#A7B5C7]">
                <span className="text-[#A7B5C7]/70">Dominio:</span>
                {renderSelectablePill(domainEl.id, domainEl.text, 'Dominio', domainEl.explanation)}
              </span>
            )}
          </div>
        </div>

        {/* To */}
        <div className="space-y-1.5 md:text-right">
          <span className="text-[#A7B5C7] font-medium block">Para:</span>
          <div className="inline-block px-2.5 py-1 text-xs rounded-lg bg-[#0D1B2A] border border-[#263A50] text-[#A7B5C7]">
            estudiante.universitario@institucion.edu
          </div>
        </div>
      </div>
    </div>
  );
};
