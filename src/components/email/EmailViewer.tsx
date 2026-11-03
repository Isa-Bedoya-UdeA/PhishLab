import React, { useState } from 'react';
import {
  RotateCcw,
  MousePointerClick,
  ExternalLink,
  Paperclip,
  ShieldAlert,
} from 'lucide-react';
import { Exercise, ApparentLink } from '../../domain/types/exercise.ts';
import { ExerciseMetrics } from '../../domain/types/evaluation.ts';
import { EmailHeaders } from './EmailHeaders.tsx';
import { InteractiveElement } from './InteractiveElement.tsx';
import { UrlInspectionPanel } from './UrlInspectionPanel.tsx';

export interface EmailViewerProps {
  exercise: Exercise;
  selectedElementIds: Set<string>;
  onToggleElement: (id: string) => void;
  onClearSelection: () => void;
  metrics: ExerciseMetrics | null;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({
  exercise,
  selectedElementIds,
  onToggleElement,
  onClearSelection,
  metrics,
}) => {
  const [inspectingLink, setInspectingLink] = useState<ApparentLink | null>(null);
  const isEvaluated = metrics !== null;

  // Visual notice element from metadata
  const visualNoticeEl = exercise.metadataElements.find((el) => el.type === 'visual_element');

  return (
    <div className="bg-[#0D1B2A] border border-[#263A50] rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Interactive Selection Toolbar */}
      <div className="bg-[#08111F] px-4 py-3 border-b border-[#263A50] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#A7B5C7]">
          <MousePointerClick className="w-4 h-4 text-[#35E0D0] shrink-0" />
          <span>
            {isEvaluated
              ? 'Análisis completado: Revise las señales correctas, omitidas e incorrectas en el mensaje.'
              : 'Haga clic en las palabras, cabeceras o enlaces que considere indicios de fraude o legitimidad.'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[#35E0D0] font-semibold">
            {selectedElementIds.size} elemento{selectedElementIds.size === 1 ? '' : 's'} seleccionado{selectedElementIds.size === 1 ? '' : 's'}
          </span>
          {!isEvaluated && selectedElementIds.size > 0 && (
            <button
              onClick={onClearSelection}
              className="text-[#A7B5C7] hover:text-[#FB7185] flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-[#122438]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar selección</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulated Email Headers */}
      <EmailHeaders
        exercise={exercise}
        selectedElementIds={selectedElementIds}
        onToggleElement={onToggleElement}
        metrics={metrics}
      />

      {/* Email Body Workspace */}
      <div className="p-5 sm:p-7 space-y-6 bg-[#0D1B2A] flex-1">
        {/* Institutional Header Banner (if present) */}
        {exercise.institutionalVisuals && (
          <div className="bg-[#122438] p-4 rounded-xl border border-[#263A50]/70 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-sm text-[#F1F5F9] block">
                {exercise.institutionalVisuals.organizationName}
              </span>
              {exercise.institutionalVisuals.department && (
                <span className="text-xs text-[#A7B5C7] block">
                  {exercise.institutionalVisuals.department}
                </span>
              )}
            </div>
            {exercise.institutionalVisuals.securityBanner && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#35E0D0] bg-[#35E0D0]/10 border border-[#35E0D0]/30 px-2 py-1 rounded">
                {exercise.institutionalVisuals.securityBanner}
              </span>
            )}
          </div>
        )}

        {/* Visual Notice Element (selectable) */}
        {visualNoticeEl && (
          <div
            onClick={() => !isEvaluated && onToggleElement(visualNoticeEl.id)}
            className={`p-3 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-all ${
              selectedElementIds.has(visualNoticeEl.id)
                ? 'border-[#35E0D0] bg-[#35E0D0]/15 text-[#35E0D0]'
                : isEvaluated && metrics?.correctElementIds.includes(visualNoticeEl.id)
                ? 'border-[#4ADE80] bg-[#4ADE80]/15 text-[#4ADE80]'
                : isEvaluated && metrics?.incorrectElementIds.includes(visualNoticeEl.id)
                ? 'border-[#FB7185] bg-[#FB7185]/15 text-[#FB7185]'
                : isEvaluated && metrics?.missedElementIds.includes(visualNoticeEl.id)
                ? 'border-[#FBBF24] border-dashed bg-[#FBBF24]/15 text-[#FBBF24]'
                : 'border-[#263A50] bg-[#122438] text-[#A7B5C7] hover:border-[#35E0D0]/40'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#35E0D0]" />
            <span className="flex-1 font-medium">{visualNoticeEl.text}</span>
            <span className="text-[11px] underline opacity-75">
              {selectedElementIds.has(visualNoticeEl.id) ? 'Marcado como indicio' : 'Marcar indicio'}
            </span>
          </div>
        )}

        {/* Word-by-word interactive body */}
        <div className="text-sm sm:text-base leading-relaxed text-[#F1F5F9] font-sans">
          {(() => {
            const paragraphs: React.ReactNode[][] = [[]];
            let currentP = 0;

            exercise.bodyElements.forEach((el) => {
              paragraphs[currentP].push(
                <React.Fragment key={el.id}>
                  <InteractiveElement
                    element={el}
                    isSelected={selectedElementIds.has(el.id)}
                    onToggle={onToggleElement}
                    metrics={metrics}
                  />
                  {el.trailingSpace && ' '}
                </React.Fragment>
              );

              if (el.paragraphBreakAfter) {
                paragraphs.push([]);
                currentP++;
              }
            });

            return paragraphs.map((pContent, pIdx) => (
              <p key={pIdx} className="mb-4 last:mb-0">
                {pContent}
              </p>
            ));
          })()}
        </div>

        {/* Apparent Links Section */}
        {exercise.apparentLinks.length > 0 && (
          <div className="pt-2 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A7B5C7] block">
              Enlaces adjuntos en el mensaje
            </span>
            <div className="space-y-2">
              {exercise.apparentLinks.map((link) => {
                const isSelected = selectedElementIds.has(link.elementId);
                const isTP = isEvaluated && metrics?.correctElementIds.includes(link.elementId);
                const isFP = isEvaluated && metrics?.incorrectElementIds.includes(link.elementId);
                const isFN = isEvaluated && metrics?.missedElementIds.includes(link.elementId);

                let linkClasses = 'bg-[#122438] border-[#263A50] text-[#35E0D0] hover:border-[#35E0D0]/50';

                if (!isEvaluated) {
                  if (isSelected) {
                    linkClasses = 'bg-[#35E0D0]/15 border-[#35E0D0] text-[#35E0D0] ring-1 ring-[#35E0D0]';
                  }
                } else {
                  if (isTP) {
                    linkClasses = 'bg-[#4ADE80]/15 border-[#4ADE80] text-[#4ADE80]';
                  } else if (isFP) {
                    linkClasses = 'bg-[#FB7185]/15 border-[#FB7185] text-[#FB7185] line-through';
                  } else if (isFN) {
                    linkClasses = 'bg-[#FBBF24]/15 border-[#FBBF24] border-dashed text-[#FBBF24]';
                  } else {
                    linkClasses = 'bg-[#122438] border-[#263A50] text-[#A7B5C7]';
                  }
                }

                return (
                  <div
                    key={link.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${linkClasses}`}
                  >
                    <div
                      role="button"
                      tabIndex={isEvaluated ? -1 : 0}
                      onClick={() => !isEvaluated && onToggleElement(link.elementId)}
                      className="cursor-pointer flex-1 min-w-0"
                    >
                      <span className="font-semibold text-sm block truncate underline decoration-[#35E0D0]/40">
                        {link.label}
                      </span>
                      <span className="font-mono text-xs text-[#A7B5C7] truncate block mt-0.5">
                        {link.displayedUrl}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isEvaluated && (
                        <button
                          type="button"
                          onClick={() => onToggleElement(link.elementId)}
                          className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                            isSelected
                              ? 'bg-[#35E0D0] text-[#08111F] border-[#35E0D0]'
                              : 'bg-[#0D1B2A] text-[#A7B5C7] border-[#263A50] hover:text-[#F1F5F9]'
                          }`}
                        >
                          {isSelected ? '✓ Marcado como indicio' : 'Marcar indicio'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setInspectingLink(link)}
                        className="text-xs px-2.5 py-1 rounded-md bg-[#08111F] border border-[#263A50] text-[#A7B5C7] hover:text-[#35E0D0] hover:border-[#35E0D0]/40 flex items-center gap-1 transition-colors"
                        title="Inspeccionar dirección URL en panel seguro"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspeccionar URL</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Attachments Section */}
        {exercise.attachments.length > 0 && (
          <div className="pt-2 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A7B5C7] block">
              Archivos adjuntos simulados
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {exercise.attachments.map((att) => {
                const isSelected = selectedElementIds.has(att.elementId);
                const isTP = isEvaluated && metrics?.correctElementIds.includes(att.elementId);
                const isFP = isEvaluated && metrics?.incorrectElementIds.includes(att.elementId);
                const isFN = isEvaluated && metrics?.missedElementIds.includes(att.elementId);

                let attClasses = 'bg-[#122438] border-[#263A50] hover:border-[#35E0D0]/40';

                if (!isEvaluated) {
                  if (isSelected) {
                    attClasses = 'bg-[#35E0D0]/15 border-[#35E0D0] text-[#35E0D0] ring-1 ring-[#35E0D0]';
                  }
                } else {
                  if (isTP) {
                    attClasses = 'bg-[#4ADE80]/15 border-[#4ADE80] text-[#4ADE80]';
                  } else if (isFP) {
                    attClasses = 'bg-[#FB7185]/15 border-[#FB7185] text-[#FB7185] line-through';
                  } else if (isFN) {
                    attClasses = 'bg-[#FBBF24]/15 border-[#FBBF24] border-dashed text-[#FBBF24]';
                  }
                }

                return (
                  <button
                    key={att.id}
                    type="button"
                    onClick={() => !isEvaluated && onToggleElement(att.elementId)}
                    disabled={isEvaluated}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${attClasses}`}
                  >
                    <Paperclip className="w-4 h-4 text-[#35E0D0] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-[#F1F5F9] truncate block">
                        {att.name}
                      </span>
                      {att.fileSize && (
                        <span className="text-[11px] text-[#A7B5C7] block">{att.fileSize}</span>
                      )}
                    </div>
                    {!isEvaluated && (
                      <span className="text-[11px] text-[#A7B5C7] shrink-0">
                        {isSelected ? '✓ Marcado' : 'Marcar'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Institutional Footer Notice */}
        {exercise.institutionalVisuals?.footerNotice && (
          <div className="pt-4 border-t border-[#263A50] text-[11px] text-[#A7B5C7]/70 leading-relaxed font-sans">
            {exercise.institutionalVisuals.footerNotice}
          </div>
        )}
      </div>

      {/* Safe URL Inspection Modal */}
      <UrlInspectionPanel
        link={inspectingLink}
        onClose={() => setInspectingLink(null)}
      />
    </div>
  );
};
