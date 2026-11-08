import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  HelpCircle,
  Lightbulb,
  Info,
  RotateCcw,
} from 'lucide-react';
import { TUTORIAL_EXERCISE, TUTORIAL_STEPS } from './tutorialData.ts';
import { EmailViewer } from '../../components/email/EmailViewer.tsx';
import { ClassificationBar } from '../../components/email/ClassificationBar.tsx';
import { EvaluationSummary } from '../../components/feedback/EvaluationSummary.tsx';
import { ExerciseEvaluator } from '../../domain/services/evaluator.ts';
import { MessageClassification } from '../../domain/types/exercise.ts';
import { ExerciseMetrics } from '../../domain/types/evaluation.ts';
import { Button } from '../../components/ui/Button.tsx';
import { safeStorage, STORAGE_KEYS } from '../../infrastructure/storage/localStorage.ts';

export interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedElementIds, setSelectedElementIds] = useState<Set<string>>(new Set());
  const [selectedClassification, setSelectedClassification] =
    useState<MessageClassification | null>(null);
  const [metrics, setMetrics] = useState<ExerciseMetrics | null>(null);

  if (!isOpen) return null;

  const currentStep = TUTORIAL_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TUTORIAL_STEPS.length - 1;

  const handleToggleElement = (id: string) => {
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
    setSelectedElementIds(new Set());
  };

  const handleEvaluateTutorial = () => {
    if (!selectedClassification) return;
    const computedMetrics = ExerciseEvaluator.evaluate(
      TUTORIAL_EXERCISE,
      selectedClassification,
      Array.from(selectedElementIds)
    );
    setMetrics(computedMetrics);
    // If not already on feedback step, move to it
    setCurrentStepIndex(5);
  };

  const handleResetPractice = () => {
    setSelectedElementIds(new Set());
    setSelectedClassification(null);
    setMetrics(null);
  };

  const handleFinish = () => {
    safeStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, true);
    if (onComplete) onComplete();
    onClose();
  };

  const handleSkip = () => {
    safeStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, true);
    onClose();
  };

  const handleNextStep = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6"
    >
      <div className="w-full max-w-5xl bg-[#08111F] border border-[#35E0D0]/40 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col">
        {/* Header Bar */}
        <div className="bg-[#0D1B2A] border-b border-[#263A50] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#35E0D0]/15 border border-[#35E0D0]/40 flex items-center justify-center text-[#35E0D0]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="tutorial-modal-title"
                  className="text-base sm:text-lg font-bold text-[#F1F5F9] leading-tight"
                >
                  Tutorial Interactivo — Práctica Guiada
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#35E0D0]/10 text-[#35E0D0] border border-[#35E0D0]/30 hidden sm:inline">
                  Paso {currentStep.id} de {TUTORIAL_STEPS.length}
                </span>
              </div>
              <p className="text-[11px] text-[#A7B5C7]">
                Aprende a interactuar con los mensajes sin alterar tus datos de investigación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-[#A7B5C7] hover:text-[#F1F5F9]"
            >
              Omitir tutorial
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A7B5C7] hover:text-[#F1F5F9] hover:bg-[#122438] transition-colors"
              aria-label="Cerrar tutorial"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informative Experimental Disclaimer Banner */}
        <div className="bg-[#122438] border-b border-[#263A50] px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-[#A7B5C7] gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#35E0D0] shrink-0" />
            <span>
              <strong className="text-[#35E0D0]">Modo Tutorial Pedagógico:</strong> Este ejercicio es una simulación guiada.
              <span className="text-[#F1F5F9] font-medium"> Ninguna acción aquí se guarda en tu historial ni se incluye en los archivos CSV.</span>
            </span>
          </div>
          {metrics && (
            <button
              onClick={handleResetPractice}
              className="text-[#35E0D0] hover:underline flex items-center gap-1 shrink-0 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar práctica</span>
            </button>
          )}
        </div>

        {/* Step Guide Interactive Card */}
        <div className="bg-gradient-to-r from-[#0D1B2A] to-[#122438] border-b border-[#263A50] p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#35E0D0] text-[#08111F] font-black text-xs flex items-center justify-center">
                  {currentStep.id}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[#F1F5F9]">
                  {currentStep.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#F1F5F9] pl-8 leading-relaxed">
                {currentStep.instruction}
              </p>
              <div className="flex items-start gap-1.5 text-xs text-[#35E0D0] pl-8 pt-0.5">
                <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="italic">{currentStep.tip}</span>
              </div>
            </div>

            {/* Step Navigation Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Anterior
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleNextStep}
                icon={isLastStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              >
                {isLastStep ? '¡Entendido, finalizar!' : 'Siguiente'}
              </Button>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-3 mt-3 border-t border-[#263A50]/60">
            {TUTORIAL_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIndex
                    ? 'w-6 bg-[#35E0D0]'
                    : idx < currentStepIndex
                    ? 'w-2 bg-[#4ADE80]'
                    : 'w-2 bg-[#263A50]'
                }`}
                aria-label={`Ir al paso ${s.id}`}
              />
            ))}
          </div>
        </div>

        {/* Interactive Workspace Area */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Simulated Email */}
          <div
            className={`transition-all rounded-2xl ${
              currentStep.highlightTarget === 'headers' ||
              currentStep.highlightTarget === 'body' ||
              currentStep.highlightTarget === 'links'
                ? 'ring-2 ring-[#35E0D0] shadow-lg shadow-[#35E0D0]/10'
                : ''
            }`}
          >
            <EmailViewer
              exercise={TUTORIAL_EXERCISE}
              selectedElementIds={selectedElementIds}
              onToggleElement={handleToggleElement}
              onClearSelection={handleClearSelection}
              metrics={metrics}
            />
          </div>

          {/* Classification Bar or Evaluation Feedback */}
          {!metrics ? (
            <div
              className={`transition-all rounded-2xl ${
                currentStep.highlightTarget === 'classification'
                  ? 'ring-2 ring-[#35E0D0] shadow-lg shadow-[#35E0D0]/10'
                  : ''
              }`}
            >
              <ClassificationBar
                selectedClassification={selectedClassification}
                onSelectClassification={setSelectedClassification}
                onSubmit={handleEvaluateTutorial}
                isSubmitted={false}
                disabled={false}
              />
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="p-3 bg-[#35E0D0]/10 border border-[#35E0D0]/30 rounded-xl flex items-center justify-between text-xs">
                <span className="text-[#35E0D0] font-semibold">
                  ✓ ¡Práctica completada! Revisa el desglose y la matriz de confusión abajo:
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResetPractice}
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Probar otra selección
                </Button>
              </div>

              <EvaluationSummary
                exercise={TUTORIAL_EXERCISE}
                userClassification={selectedClassification!}
                metrics={metrics}
                onNextExercise={handleFinish}
                onReviewEmail={() => {}}
                onGoToDashboard={handleFinish}
                hasNextExercise={false}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#0D1B2A] border-t border-[#263A50] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#A7B5C7]">
            <HelpCircle className="w-4 h-4 text-[#35E0D0]" />
            <span>Puedes volver a consultar este tutorial en cualquier momento desde la barra superior o en Configuración.</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={handleSkip}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={handleFinish}
            >
              Comenzar a entrenar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
