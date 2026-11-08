import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import { EmailElement } from '../../domain/types/exercise.ts';
import { ExerciseMetrics } from '../../domain/types/evaluation.ts';

export interface InteractiveElementProps {
  element: EmailElement;
  isSelected: boolean;
  onToggle: (id: string) => void;
  metrics: ExerciseMetrics | null; // null before submission
  disabled?: boolean;
}

export const InteractiveElement: React.FC<InteractiveElementProps> = ({
  element,
  isSelected,
  onToggle,
  metrics,
  disabled = false,
}) => {
  const isEvaluated = metrics !== null;

  // Determine state in post-evaluation mode
  const isTP = isEvaluated && metrics.correctElementIds.includes(element.id);
  const isFP = isEvaluated && metrics.incorrectElementIds.includes(element.id);
  const isFN = isEvaluated && metrics.missedElementIds.includes(element.id);

  let statusClass = 'text-[#F1F5F9] hover:bg-[#1A324C]/60 hover:text-[#35E0D0] cursor-pointer';
  let badgeIcon: React.ReactNode = null;
  let statusLabel = '';

  if (!isEvaluated) {
    if (isSelected) {
      statusClass =
        'bg-[#35E0D0]/20 text-[#35E0D0] font-semibold border-b-2 border-[#35E0D0] shadow-xs';
    }
  } else {
    // Post evaluation coloring and icons
    if (isTP) {
      statusClass =
        'bg-[#4ADE80]/20 text-[#4ADE80] font-semibold border-b-2 border-[#4ADE80]';
      badgeIcon = <Check className="w-3 h-3 text-[#4ADE80] inline ml-0.5" aria-hidden="true" />;
      statusLabel = 'Indicio correcto';
    } else if (isFP) {
      statusClass =
        'bg-[#FB7185]/20 text-[#FB7185] line-through border-b border-[#FB7185]';
      badgeIcon = <X className="w-3 h-3 text-[#FB7185] inline ml-0.5" aria-hidden="true" />;
      statusLabel = 'Elemento irrelevante seleccionado';
    } else if (isFN) {
      statusClass =
        'bg-[#FBBF24]/15 text-[#FBBF24] border-b-2 border-dashed border-[#FBBF24]';
      badgeIcon = <AlertCircle className="w-3 h-3 text-[#FBBF24] inline ml-0.5" aria-hidden="true" />;
      statusLabel = 'Indicio relevante omitido';
    } else {
      statusClass = 'text-[#A7B5C7]/80';
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled && !isEvaluated) {
      onToggle(element.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isEvaluated) {
      e.preventDefault();
      onToggle(element.id);
    }
  };

  return (
    <span
      role="button"
      tabIndex={isEvaluated ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={`${element.text}${statusLabel ? ` — ${statusLabel}` : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={element.explanation ? element.explanation : undefined}
      className={`inline-block px-1.5 py-1 sm:px-1 sm:py-0.5 my-0.5 rounded transition-all duration-100 outline-none select-none touch-manipulation active:scale-[0.98] ${statusClass} ${
        disabled ? 'cursor-default' : ''
      }`}
    >
      <span>{element.text}</span>
      {badgeIcon}
    </span>
  );
};
